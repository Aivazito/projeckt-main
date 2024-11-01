const inputElement = document.getElementById('title');
const createBtn = document.getElementById('create');
const listElement = document.getElementById('list');

let notes = [];
const allowedPhrases = ['Aivaz', 'Daniyar', 'Edya', 'Manas','Maha', 'Meir']; 
function loadNotesFromLocalStorage() {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
        notes = JSON.parse(savedNotes);
        render();
    }
}


function saveNotesToLocalStorage() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

loadNotesFromLocalStorage();

function render() {
    listElement.innerHTML = '';
    if (notes.length === 0) {
        listElement.innerHTML = '<p>Нет очереди</p>';
    }
    for (let i = 0; i < notes.length; i++) {
        listElement.insertAdjacentHTML('beforeend', getNoteTemplate(notes[i], i));
    }
}


createBtn.onclick = function () {
    if (inputElement.value.length === 0) {
        return;
    }

    const note = inputElement.value.toLowerCase(); 
    const isAllowed = allowedPhrases.some(phrase => note.includes(phrase.toLowerCase()));

    if (!isAllowed) {
        alert('Напиши своё имя ебалай.');
        return; 
    }
    
    if (notes.length > 0 && inputElement.value === notes[notes.length - 1].title) {
        alert('Ты уже в очереди');
        return;
    }

    if (notes.length >= 6) {
        alert('Имей терпение.');
        return;
    }

    const newNote = {
        title: inputElement.value,
        completed: false,
    };

    notes.push(newNote);
    render();
    inputElement.value = '';

    saveNotesToLocalStorage();
};

listElement.addEventListener('click', function(event) {
    if (event.target.dataset.type === 'remove') {
        const index = parseInt(event.target.dataset.index);
        notes.splice(index, 1);
        render();
        saveNotesToLocalStorage();
    }
});


function getNoteTemplate(note, index) {
    return `
    <li
        class="list_ul"
    >
        <span class="${note.completed ? 'text-decoration-line-through' : ''}">${note.title}</span>
        <span>
            <span class="btn btn-small btn-danger " data-type="remove" data-index="${index}">&times;</span>
        </span>
    </li>`;
}

// Сохранение данных в локальном хранилище
function saveDataToLocalStorage(data) {
    localStorage.setItem('cachedData', JSON.stringify(data));
}

// Получение данных из локального хранилища
function getDataFromLocalStorage() {
    const cachedData = localStorage.getItem('cachedData');
    return cachedData ? JSON.parse(cachedData) : null;
}

// Отображение данных из локального хранилища
function displayDataFromCache() {
    const cachedData = getDataFromLocalStorage();
    if (cachedData) {
        // Отображаем данные из кэша
        displayData(cachedData);
    } else {
        // Если данных в кэше нет, отображаем сообщение об отсутствии данных
        displayNoDataMessage();
    }
}

// Функция для отображения данных
function displayData(data) {
    // Реализуйте отображение данных в вашем приложении
}

// Функция для отображения сообщения об отсутствии данных
function displayNoDataMessage() {
    // Реализуйте отображение сообщения об отсутствии данных в вашем приложении
}

// Проверяем наличие данных в локальном хранилище при запуске приложения
window.onload = function() {
    displayDataFromCache();
};

// Подключение к серверу и обработка данных
function connectToServer() {
    // Реализуйте подключение к серверу и получение данных
    // Пример использования fetch API для запроса данных
    fetch('http://example.com/data')
        .then(response => response.json())
        .then(data => {
            // Если данные успешно получены, сохраняем их в локальное хранилище
            saveDataToLocalStorage(data);
            // Отображаем полученные данные
            displayData(data);
        })
        .catch(error => {
            console.error('Ошибка при получении данных:', error);
            // Если возникла ошибка при получении данных, отображаем данные из кэша (если они есть)
            displayDataFromCache();
        });
}
