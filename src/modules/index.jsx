import DailyPayrollCalculation from "./daily_payroll_calculation/daily_payroll_calculation";
import EmployeeManagement from "./employee_management/employee_management";
import TaskManagement from "./task_management/task_management";
import TimeKeeping from "./time_keeping/time_keeping";

export default function ModulesMain({ activeModule }) {
  const renderModule = () => {
    switch (activeModule) {
      case "employee_management":
        return <EmployeeManagement />;
      case "task_management":
        return <TaskManagement />;
      case "time_keeping":
        return <TimeKeeping />;
      case "daily_payroll_calculation":
        return <DailyPayrollCalculation />;
    }
  };

  return <main className="modules-main">{renderModule()}</main>;
}
