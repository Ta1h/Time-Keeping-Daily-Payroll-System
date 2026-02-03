import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import "./daily_payroll_calculation.css";

export default function DailyPayrollCalculation() {
  const [payrollRecords, setPayrollRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch payroll records on mount
  useEffect(() => {
    fetchPayrollRecords();
  }, []);

  const fetchPayrollRecords = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/payroll/calculate",
      );
      const data = await response.json();
      setPayrollRecords(data);
    } catch (error) {
      console.error("Error fetching payroll records:", error);
    } finally {
      setLoading(false);
    }
  };

  // Define table columns
  const columns = [
    {
      accessorKey: "employee_name",
      header: "Employee Name",
    },
    {
      accessorKey: "task_completed",
      header: "Task Completed",
    },
    {
      accessorKey: "amount",
      header: "Amount",
    },
    {
      accessorKey: "from_date",
      header: "From Date",
    },
    {
      accessorKey: "to_date",
      header: "To Date",
    },
  ];

  // Create table instance
  const table = useReactTable({
    data: payrollRecords,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <section className="employee-management">
      <header className="module-header">
        <div className="header-text">
          <h2>Daily Payroll Calculation</h2>
          <p>View daily payroll calculations based on time records.</p>
        </div>
      </header>

      <div className="module-content">
        {loading ? (
          <p>Loading payroll records...</p>
        ) : (
          <table className="employee-table">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
