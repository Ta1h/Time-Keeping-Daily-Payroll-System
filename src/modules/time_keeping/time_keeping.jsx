import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import ModalForm from "../../components/modal_form/modal_form";
import "./time_keeping.css";

export default function TimeKeeping() {
  const [employees, setEmployees] = useState([]);

  const getTimeKeepingFields = () => [
    {
      name: "employee_id",
      label: "Employee",
      type: "select",
      required: true,
      options: [
        { value: "", label: "Select Employee" },
        ...employees
          .filter((emp) => emp.active === 1)
          .map((emp) => ({
            value: emp.id,
            label: `${emp.employee_name}`,
            employeeName: emp.employee_name,
          })),
      ],
    },
    {
      name: "from_date",
      label: "From Date",
      type: "date",
      required: true,
    },
    {
      name: "to_date",
      label: "To Date",
      type: "date",
      required: true,
    },
    {
      name: "time_in",
      label: "Time In",
      type: "time",
      required: true,
    },
    {
      name: "time_out",
      label: "Time Out",
      type: "time",
      required: true,
    },
  ];

  const getEmptyFormData = () => ({
    id: null,
    employee_id: "",
    employee_name: "",
    from_date: "",
    to_date: "",
    time_in: "",
    time_out: "",
  });

  const [timeEntries, setTimeEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [formData, setFormData] = useState(getEmptyFormData);

  // Fetch time entries and employees on mount
  useEffect(() => {
    fetchTimeEntries();
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/employees");
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const fetchTimeEntries = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/time-keeping");
      const data = await response.json();
      setTimeEntries(data);
    } catch (error) {
      console.error("Error fetching time entries:", error);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setFormMode("add");
    setFormData(getEmptyFormData());
    setIsModalOpen(true);
  };

  const openEditModal = (entry) => {
    setFormMode("edit");

    // Extract time from DATETIME values (format: "HH:MM")
    const extractTime = (datetime) => {
      if (!datetime) return "";
      const date = new Date(datetime);
      return date.toTimeString().slice(0, 5); // "HH:MM"
    };

    setFormData({
      id: entry.id,
      employee_id: entry.employee_id || "",
      employee_name: entry.employee_name || "",
      from_date: entry.from_date
        ? new Date(entry.from_date).toISOString().split("T")[0]
        : "",
      to_date: entry.to_date
        ? new Date(entry.to_date).toISOString().split("T")[0]
        : "",
      time_in: extractTime(entry.time_in),
      time_out: extractTime(entry.time_out),
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "employee_id") {
      // When employee is selected, also set the employee_name
      const selectedEmployee = employees.find(
        (emp) => emp.id === Number(value),
      );
      setFormData((prev) => ({
        ...prev,
        employee_id: Number(value),
        employee_name: selectedEmployee ? selectedEmployee.employee_name : "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Combine from_date with time_in and to_date with time_out to create DATETIME values
    const time_in_datetime =
      formData.from_date && formData.time_in
        ? `${formData.from_date} ${formData.time_in}:00`
        : null;
    const time_out_datetime =
      formData.to_date && formData.time_out
        ? `${formData.to_date} ${formData.time_out}:00`
        : null;

    const payload = {
      employee_id: Number(formData.employee_id),
      employee_name: formData.employee_name.trim(),
      from_date: formData.from_date || null,
      to_date: formData.to_date || null,
      time_in: time_in_datetime,
      time_out: time_out_datetime,
    };

    try {
      if (formMode === "add") {
        const response = await fetch("http://localhost:3000/api/time-keeping", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error("Failed to create time entry");
        }
      } else {
        const response = await fetch(
          `http://localhost:3000/api/time-keeping/${formData.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          },
        );

        if (!response.ok) {
          throw new Error("Failed to update time entry");
        }
      }

      await fetchTimeEntries();
      closeModal();
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    }
  };

  // Define table columns
  const columns = [
    {
      accessorKey: "employee_name",
      header: "Employee Name",
    },
    {
      accessorKey: "from_date",
      header: "From Date",
      cell: ({ row }) => {
        const date = row.original.from_date;
        return date ? new Date(date).toISOString().split("T")[0] : "";
      },
    },
    {
      accessorKey: "to_date",
      header: "To Date",
      cell: ({ row }) => {
        const date = row.original.to_date;
        return date ? new Date(date).toISOString().split("T")[0] : "";
      },
    },
    {
      accessorKey: "time_in",
      header: "Time In",
      cell: ({ row }) => {
        const datetime = row.original.time_in;
        if (!datetime) return "";
        const date = new Date(datetime);
        return date.toTimeString().slice(0, 5); // "HH:MM"
      },
    },
    {
      accessorKey: "time_out",
      header: "Time Out",
      cell: ({ row }) => {
        const datetime = row.original.time_out;
        if (!datetime) return "";
        const date = new Date(datetime);
        return date.toTimeString().slice(0, 5); // "HH:MM"
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <button
          type="button"
          className="btn-edit"
          onClick={() => openEditModal(row.original)}
          style={{ color: "#fff" }}
        >
          Edit
        </button>
      ),
    },
  ];

  // Create table instance
  const table = useReactTable({
    data: timeEntries,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <section className="employee-management">
      <header className="module-header">
        <div className="header-text">
          <h2>Time Keeping</h2>
          <p>Track employee attendance, clock in/out, and work hours.</p>
        </div>
        <button
          type="button"
          className="btn-add"
          onClick={openAddModal}
          style={{ color: "#fff" }}
        >
          Add Time Entry
        </button>
      </header>

      <div className="module-content">
        {loading ? (
          <p>Loading time entries...</p>
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

      <ModalForm
        isOpen={isModalOpen}
        title={formMode === "add" ? "Add Time Entry" : "Edit Time Entry"}
        fields={getTimeKeepingFields()}
        values={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onClose={closeModal}
        submitLabel={formMode === "add" ? "Save" : "Update"}
      />
    </section>
  );
}
