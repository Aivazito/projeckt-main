import com.corundumstudio.socketio.Configuration;
import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.listener.DataListener;
import spark.Spark;

import java.util.ArrayList;
import java.util.List;

public class ChatServer {
    private static List<String> queue = new ArrayList<>();

    public static void main(String[] args) {
        int port = 8000;

        // Настройка Socket.IO сервера
        Configuration config = new Configuration();
        config.setHostname("0.0.0.0");
        config.setPort(port);

        SocketIOServer ioServer = new SocketIOServer(config);

        // Обработка добавления в очередь
        ioServer.addEventListener("addToQueue", String.class, (client, name, ackSender) -> {
            queue.add(name); // Добавляем имя в очередь
            ioServer.getBroadcastOperations().sendEvent("updateQueue", queue); // Отправляем обновленный список
        });

        // Запуск сервера Socket.IO
        ioServer.start();

        // Настройка статических файлов и маршрутов
        Spark.staticFiles.externalLocation("client-dist");
        Spark.get("/", (req, res) -> {
            res.type("text/html");
            return "<html><body><h1>Добро пожаловать!</h1></body></html>";
        });

        System.out.println("Сервер запущен на порту " + port);

        // Завершаем работу сервера при завершении программы
        Runtime.getRuntime().addShutdownHook(new Thread(ioServer::stop));
    }
}
