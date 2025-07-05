const mysql = require('mysql2');

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

// Use promise wrapper
const promisePool = connection.promise();

console.log('✅ Connected to MySQL Database');

module.exports = promisePool;
