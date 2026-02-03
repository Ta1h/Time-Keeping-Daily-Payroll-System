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
  db.query('SELECT * FROM tbl_employees', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// GET employee by id
app.get('/api/employees/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM tbl_employees WHERE id = ?', [id], (err, results) => {
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
  const { employee_name, age, active, position, hourly_rate, daily_rate, monthly_rate } = req.body;

  if (!employee_name) {
    return res.status(400).json({ error: 'employee_name is required' });
  }

  const query =
    'UPDATE tbl_employees SET employee_name = ?, age = ?, active = ?, position = ?, hourly_rate = ?, daily_rate = ?, monthly_rate = ? WHERE id = ?';
  const values = [
    employee_name,
    age || null,
    active ?? 1,
    position || null,
    hourly_rate || null,
    daily_rate || null,
    monthly_rate || null,
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

// Task Management REST API

// GET all tasks
app.get('/api/tasks', (req, res) => {
  db.query('SELECT * FROM tbl_tasks', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// GET task by id
app.get('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM tbl_tasks WHERE id = ?', [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(results[0]);
  });
});

// CREATE task
app.post('/api/tasks', (req, res) => {
  const { task_name, status, date } = req.body;

  if (!task_name) {
    return res.status(400).json({ error: 'task_name is required' });
  }

  const query = 'INSERT INTO tbl_tasks (task_name, status, date) VALUES (?, ?, ?)';
  const values = [task_name, status || 'active', date || null];

  db.query(query, values, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: results.insertId, ...req.body });
  });
});

// UPDATE task
app.put('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { task_name, status, date } = req.body;

  if (!task_name) {
    return res.status(400).json({ error: 'task_name is required' });
  }

  const query = 'UPDATE tbl_tasks SET task_name = ?, status = ?, date = ? WHERE id = ?';
  const values = [task_name, status || 'active', date || null, id];

  db.query(query, values, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task updated successfully' });
  });
});

// Time Keeping REST API

// GET all time entries
app.get('/api/time-keeping', (req, res) => {
  db.query('SELECT * FROM tbl_time_keeping', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// GET time entry by id
app.get('/api/time-keeping/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM tbl_time_keeping WHERE id = ?', [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Time entry not found' });
    }
    res.json(results[0]);
  });
});

// CREATE time entry
app.post('/api/time-keeping', (req, res) => {
  const { employee_id, employee_name, from_date, to_date, time_in, time_out } = req.body;

  if (!employee_id || !employee_name) {
    return res.status(400).json({ error: 'employee_id and employee_name are required' });
  }

  const query = 'INSERT INTO tbl_time_keeping (employee_id, employee_name, from_date, to_date, time_in, time_out) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [employee_id, employee_name, from_date || null, to_date || null, time_in || null, time_out || null];

  db.query(query, values, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: results.insertId, ...req.body });
  });
});

// UPDATE time entry
app.put('/api/time-keeping/:id', (req, res) => {
  const { id } = req.params;
  const { employee_id, employee_name, from_date, to_date, time_in, time_out } = req.body;

  if (!employee_id || !employee_name) {
    return res.status(400).json({ error: 'employee_id and employee_name are required' });
  }

  const query = 'UPDATE tbl_time_keeping SET employee_id = ?, employee_name = ?, from_date = ?, to_date = ?, time_in = ?, time_out = ? WHERE id = ?';
  const values = [employee_id, employee_name, from_date || null, to_date || null, time_in || null, time_out || null, id];

  db.query(query, values, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Time entry not found' });
    }
    res.json({ message: 'Time entry updated successfully' });
  });
});

// Daily Payroll Calculation REST API

// GET payroll calculation
app.get('/api/payroll/calculate', (req, res) => {
  db.query(
    'CALL sp_calculate_daily_payroll()',
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results[0]);
    },
  );
});

// Task Employees Assignment REST API

// GET all employees assigned to a task
app.get('/api/task-employees/:task_id', (req, res) => {
  const { task_id } = req.params;
  db.query('SELECT * FROM tbl_task_employees WHERE task_id = ?', [task_id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// CREATE task employee assignment
app.post('/api/task-employees', (req, res) => {
  const { task_id, employee_id, employee_name, status } = req.body;

  if (!task_id || !employee_id || !employee_name) {
    return res.status(400).json({ error: 'task_id, employee_id, and employee_name are required' });
  }

  const query = 'INSERT INTO tbl_task_employees (task_id, employee_id, employee_name, status) VALUES (?, ?, ?, ?)';
  const values = [task_id, employee_id, employee_name, status || 'pending'];

  db.query(query, values, (err, results) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'Employee is already assigned to this task' });
      }
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: results.insertId, ...req.body });
  });
});

// UPDATE task employee assignment status
app.put('/api/task-employees/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'status is required' });
  }

  const query = 'UPDATE tbl_task_employees SET status = ? WHERE id = ?';
  const values = [status, id];

  db.query(query, values, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Task employee assignment not found' });
    }
    res.json({ message: 'Assignment status updated successfully' });
  });
});

// DELETE task employee assignment
app.delete('/api/task-employees/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM tbl_task_employees WHERE id = ?', [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Task employee assignment not found' });
    }
    res.json({ message: 'Assignment deleted successfully' });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
