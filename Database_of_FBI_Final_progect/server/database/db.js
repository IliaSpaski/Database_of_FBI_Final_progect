const mysql = require('mysql');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'your_database_name',
  connectionLimit: 10, // настройка лимита соединений
});

module.exports = pool;
