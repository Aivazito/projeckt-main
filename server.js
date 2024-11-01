const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const PORT = process.env.PORT || 8000; // Определение порта

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Подключаем статические файлы
app.use(express.static(__dirname, 'client-dist'));

// Главная страница
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Событие подключения клиента
io.on('connection', (socket) => {
    console.log('Новый клиент подключился');

    // Обработка сообщения от клиента
    socket.on('message', (data) => {
        // Широковещательная рассылка сообщения всем клиентам
        io.emit('message', data);
    });

    // Обработка отключения клиента
    socket.on('disconnect', () => {
        console.log('Клиент отключился');
    });
});

// Запуск сервера
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
