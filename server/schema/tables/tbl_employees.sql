CREATE TABLE IF NOT EXISTS tbl_employees (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `employee_name` VARCHAR(100) NOT NULL,
  `age` INT,
  `active` INT DEFAULT 1,
  `position` VARCHAR(100),
  `rate_hourly` DECIMAL(10, 2),
  `rate_daily` DECIMAL(10, 2),
  `rate_monthly` DECIMAL(10, 2),
  `date_created` DATETIME DEFAULT CURRENT_TIMESTAMP
);
