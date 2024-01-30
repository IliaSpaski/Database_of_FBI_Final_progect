const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

// Подключение маршрутов
const authRouter = require('./routes/authRoutes');
const regRouter = require('./routes/regRoutes');
const fileRouter = require('./routes/fileRoutes');

// Middleware для обработки JSON
app.use(express.json());

// Статические файлы (HTML, CSS, изображения)
app.use(express.static(path.join(__dirname, '../client/assets')));
app.use(express.static(path.join(__dirname, '../client/styles')));
app.use(express.static(path.join(__dirname, '../client/img')));
app.use(express.static(path.join(__dirname, '../client/js')));

// Маршруты для перехода между страницами
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Использование роутеров
app.use('/authorization', authRouter);
app.use('/registration', regRouter);
app.use('/FBI.gov', fileRouter);



// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Что-то пошло не так!');
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту http://localhost:${PORT}`);
});

//server\server.js