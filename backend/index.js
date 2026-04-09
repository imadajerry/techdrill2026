const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');
const connection = require('./config/db');

// ✅ CONNECT TO DB
connection.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('MySQL Connected...');
});

const PORT = process.env.PORT || 8586;

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});