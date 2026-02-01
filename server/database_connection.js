import dotenv from 'dotenv';
import mysql from 'mysql2';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

// Connect to the database
connection.connect(err => {
  if (err) {
    console.error('Database connection failed:', err);
    process.exit(1); // stop the app if DB is not connected
  } else {
    console.log('Connected to MySQL database!');
  }
});

export default connection;
