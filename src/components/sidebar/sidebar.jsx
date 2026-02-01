import "./sidebar.css";

export default function Sidebar({ activeModule, setActiveModule }) {
  const modules = [
    { code: "employee_management", name: "Employee Management" },
    { code: "task_management", name: "Task Management" },
    { code: "time_keeping", name: "Time Keeping" },
    { code: "daily_payroll_calculation", name: "Daily Payroll Calculation" },
  ];

  return (
    <aside className="sidebar">
      <h1 className="sidebar-title">
        <strong>
          Time Keeping & <br />
          Daily Payroll System
        </strong>
      </h1>

      <nav className="sidebar-nav">
        <ul>
          {modules.map((item) => (
            <li
              key={item.code}
              className={activeModule === item.code ? "active" : ""}
              onClick={() => setActiveModule(item.code)}
            >
              {item.name}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
