import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './database_connection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
app.use(express.json()); // for parsing JSON requests

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

const PORT = process.env.PORT || 3000;

// Employee REST API

// GET all employees (limit 10)
app.get('/api/employees', (req, res) => {
  db.query('SELECT * FROM tbl_employees LIMIT 10', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// GET employee by id
app.get('/api/employees/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM tbl_employeess', [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(results[0]);
  });
});

// CREATE employee
app.post('/api/employees', (req, res) => {
  const { employee_name, age, active, position, hourly_rate, daily_rate, monthly_rate } = req.body;

  if (!employee_name) {
    return res.status(400).json({ error: 'employee_name is required' });
  }

  const query =
    'INSERT INTO tbl_employees (employee_name, age, active, position, hourly_rate, daily_rate, monthly_rate) VALUES (?, ?, ?, ?, ?, ?, ?)';
  const values = [
    employee_name,
    age || null,
    active ?? 1,
    position || null,
    hourly_rate || null,
    daily_rate || null,
    monthly_rate || null
  ];

  db.query(query, values, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: results.insertId, ...req.body });
  });
});

// UPDATE employee
app.put('/api/employees/:id', (req, res) => {
  const { id } = req.params;
  const { employee_name, age, active, position, rate_hourly, rate_daily, rate_monthly } = req.body;

  if (!employee_name) {
    return res.status(400).json({ error: 'employee_name is required' });
  }

  const query =
    'UPDATE tbl_employees SET employee_name = ?, age = ?, active = ?, position = ?, rate_hourly = ?, rate_daily = ?, rate_monthly = ? WHERE id = ?';
  const values = [
    employee_name,
    age || null,
    active ?? 1,
    position || null,
    rate_hourly || null,
    rate_daily || null,
    rate_monthly || null,
    id
  ];

  db.query(query, values, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json({ message: 'Employee updated successfully' });
  });
});

// DELETE employee
app.delete('/api/employees/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM tbl_employees WHERE id = ?', [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json({ message: 'Employee deleted successfully' });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
