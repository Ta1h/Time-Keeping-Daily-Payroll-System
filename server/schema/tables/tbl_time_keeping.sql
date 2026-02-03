CREATE TABLE IF NOT EXISTS tbl_time_keeping (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `employee_id` INT NOT NULL,
  `employee_name` VARCHAR(100) NOT NULL,
  `time_in` DATETIME,
  `time_out` DATETIME,
  `from_date` DATE,
  `to_date` DATE,
  `date_created` DATETIME DEFAULT CURRENT_TIMESTAMP
);
