const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Kondji@123',
  database: 'techdrill2026'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL!');
});
module.exports = connection;
