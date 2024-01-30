const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');


// Обработка запроса на страницу FBI
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/assets/fbi.gov.html'));
    console.log("/fbi.gov GET");
});

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Путь к файлу JSON, куда будем сохранять данные пользователей
const usersDataPath = path.join(__dirname, '../database/users.json');

// Обработка POST-запроса с данными регистрации
router.post('/FBIAuthorization', (req, res) => {
    console.log("/FBIAuthorization POST");
    // Получение данных из формы
    const { username, oneTimeCode } = req.body;

    // Чтение текущих данных из файла JSON (если есть)
    let jsonData = { users: [] };

    try {
        const rawData = fs.readFileSync(usersDataPath);
        jsonData = JSON.parse(rawData);
    } catch (error) {
        console.error('Error reading users data:', error);
        return res.status(500).send('Error reading users data.');
    }

    // Проверка, что users является массивом
    if (!Array.isArray(jsonData.users)) {
        console.error('Invalid users data format:', jsonData);
        return res.status(500).send('Invalid users data format.');
    }

    // Поиск пользователя по имени и паролю
    const authorizedUser = jsonData.users.find(user => user.username === username && user.oneTimeCode === oneTimeCode);

    if (authorizedUser) {
        console.log('User authorized:', authorizedUser);
        res.status(200).json({ success: true });

    } else {
        console.log('Unauthorized access attempt:', { username, oneTimeCode });
        res.status(401).send(`
            <script>
              alert('Unauthorized. Invalid username or oneTimeCode.');
              window.location.href = '/authorization';
            </script>
          `);
    }
});

module.exports = router;