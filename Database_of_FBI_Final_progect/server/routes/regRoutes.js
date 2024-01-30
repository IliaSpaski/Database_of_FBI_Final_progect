const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

// Обработка запроса на страницу регистрации
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/assets/registration.html'));
  console.log("/registration GET");
});

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Путь к файлу JSON, куда будем сохранять данные пользователей
const usersDataPath = path.join(__dirname, '../database/users.json');

// Обработка POST-запроса с данными регистрации
router.post('/registr', (req, res) => {
  console.log("/registr POST");
  // Получение данных из формы
  const { username, email, access_level, password } = req.body;

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

  // Добавление нового пользователя в массив
  const newUser = { username, email, access_level, password };
  jsonData.users.push(newUser);

  // Запись обновленных данных в файл JSON
  try {
    fs.writeFileSync(usersDataPath, JSON.stringify(jsonData, null, 2));
    
    console.log('User data successfully updated:', newUser);
    res.status(200).send(`
      <script>
        alert('Registration successful! You can now login.');
        window.location.href = '/authorization';
      </script>
    `);
  } catch (error) {
    console.error('Error writing users data:', error);
    res.status(500).send('Error registering user.');
  }
});

module.exports = router;