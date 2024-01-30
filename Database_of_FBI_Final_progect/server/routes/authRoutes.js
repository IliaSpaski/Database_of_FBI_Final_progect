const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const crypto = require('crypto'); // Для генерации одноразовых кодов

// Обработка запроса на страницу авторизации
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/assets/authorization.html'));
  console.log("/authorization GET");
});


router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Путь к файлу JSON, куда будем сохранять данные пользователей
const usersDataPath = path.join(__dirname, '../database/users.json');

// Обработка POST-запроса с данными авторизации
router.post('/authorize', (req, res) => {
  console.log("/authorize POST");
  // Получение данных из формы
  const { username, password } = req.body;

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
  const authorizedUser = jsonData.users.find(user => user.username === username && user.password === password);

  if (authorizedUser) {
    // Генерация и сохранение одноразового кода
    const oneTimeCode = crypto.randomBytes(8).toString('hex');
    authorizedUser.oneTimeCode = oneTimeCode;
    
    // Сохранение обновленных данных в JSON
    try {
      fs.writeFileSync(usersDataPath, JSON.stringify(jsonData, null, 2));
    } catch (error) {
      console.error('Error writing users data:', error);
      return res.status(500).send('Error writing users data.');
    }

    console.log('User authorized:', authorizedUser);
    res.status(200).send(`
      <script>
        var oneTimeCode = '${oneTimeCode}';
        alert('Authorization successful! Your one-time code is: ' + oneTimeCode);
        window.location.href = '/FBI.gov';
      </script>
    `);
  } else {
    console.log('Unauthorized access attempt:', { username, password });
    res.status(401).send(`
      <script>
        alert('Unauthorized. Invalid username or password.');
        window.location.href = '/authorization';
      </script>
    `);
  }
});



module.exports = router;
