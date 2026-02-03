CREATE TABLE IF NOT EXISTS tbl_payroll (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `employee_id` INT NOT NULL,
  `employee_name` VARCHAR(100) NOT NULL,
  `task_completed` VARCHAR(255),
  `amount` DECIMAL(10, 2),
  `from_date` DATE,
  `to_date` DATE,
  `date_created` DATETIME DEFAULT CURRENT_TIMESTAMP
);
