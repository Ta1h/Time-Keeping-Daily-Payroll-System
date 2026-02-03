CREATE TABLE IF NOT EXISTS tbl_task_employees (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `task_id` INT NOT NULL,
  `employee_id` INT NOT NULL,
  `employee_name` VARCHAR(100) NOT NULL,
  `status` ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending',
  `date_created` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `date_updated` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
