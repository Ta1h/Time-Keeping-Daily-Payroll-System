DROP PROCEDURE IF EXISTS sp_calculate_daily_payroll;
DELIMITER |
CREATE PROCEDURE sp_calculate_daily_payroll()
BEGIN
    SELECT 
        e.`employee_name`, 
        DATEDIFF(tk.`to_date`, tk.`from_date`) + 1 AS `total_days`,
        TIMESTAMPDIFF(HOUR, tk.`time_in`, tk.`time_out`) AS `hours_worked`,
        (TIMESTAMPDIFF(HOUR, tk.`time_in`, tk.`time_out`)-1) * e.`hourly_rate` AS `amount`,
        COUNT(CASE WHEN te.`status` = 'completed' THEN 1 END) AS `task_completed`,
        tk.`from_date`, tk.`to_date`
    FROM `tbl_employees` e
    INNER JOIN `tbl_time_keeping` tk ON e.`id` = tk.`employee_id` 
    INNER JOIN `tbl_task_employees` te ON e.`id` = te.`employee_id`
    WHERE e.`active` = 1
    GROUP BY e.`id`, e.`employee_name`, e.`hourly_rate`, tk.`id`, tk.`from_date`, tk.`to_date`, tk.`time_in`, tk.`time_out`
    ORDER BY e.`employee_name`;
END;
|
DELIMITER ;
