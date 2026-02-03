CREATE TABLE IF NOT EXISTS tbl_tasks (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `task_name` VARCHAR(255) NOT NULL,
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  `date` DATE,
  `date_created` DATETIME DEFAULT CURRENT_TIMESTAMP
);