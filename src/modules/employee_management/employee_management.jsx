import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import ModalForm from "../../components/modal_form/modal_form";
import "./employee_management.css";

export default function EmployeeManagement() {
  const employeeFields = [
    {
      name: "employee_name",
      label: "Employee Name",
      type: "text",
      required: true,
    },
    {
      name: "age",
      label: "Age",
      type: "number",
    },
    {
      name: "active",
      label: "Active",
      type: "select",
      options: [
        { value: 1, label: "Active" },
        { value: 0, label: "Inactive" },
      ],
    },
    {
      name: "position",
      label: "Position",
      type: "text",
    },
    {
      name: "hourly_rate",
      label: "Hourly Rate",
      type: "number",
      step: "0.01",
    },
    {
      name: "daily_rate",
      label: "Daily Rate",
      type: "number",
      step: "0.01",
    },
    {
      name: "monthly_rate",
      label: "Monthly Rate",
      type: "number",
      step: "0.01",
    },
  ];

  const getEmptyFormData = () =>
    employeeFields.reduce(
      (acc, field) => ({
        ...acc,
        [field.name]: field.type === "select" ? 1 : "",
      }),
      { id: null },
    );

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [formData, setFormData] = useState(getEmptyFormData);

  // Fetch employees on mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/employees");
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setFormMode("add");
    setFormData(getEmptyFormData());
    setIsModalOpen(true);
  };

  const openEditModal = (employee) => {
    setFormMode("edit");
    setFormData({
      id: employee.id,
      employee_name: employee.employee_name || "",
      age: employee.age ?? "",
      active: employee.active ?? 1,
      position: employee.position || "",
      hourly_rate: employee.hourly_rate ?? "",
      daily_rate: employee.daily_rate ?? "",
      monthly_rate: employee.monthly_rate ?? "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "active" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      employee_name: formData.employee_name.trim(),
      age: formData.age === "" ? null : Number(formData.age),
      active: formData.active,
      position: formData.position.trim(),
      hourly_rate:
        formData.hourly_rate === "" ? null : Number(formData.hourly_rate),
      daily_rate:
        formData.daily_rate === "" ? null : Number(formData.daily_rate),
      monthly_rate:
        formData.monthly_rate === "" ? null : Number(formData.monthly_rate),
    };

    try {
      if (formMode === "add") {
        const response = await fetch("http://localhost:3000/api/employees", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error("Failed to create employee");
        }
      } else {
        const response = await fetch(
          `http://localhost:3000/api/employees/${formData.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          },
        );

        if (!response.ok) {
          throw new Error("Failed to update employee");
        }
      }

      await fetchEmployees();
      closeModal();
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    }
  };

  // Define table columns
  const columns = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "employee_name",
      header: "Employee Name",
    },
    {
      accessorKey: "age",
      header: "Age",
    },
    {
      accessorKey: "active",
      header: "Active",
      cell: (info) => (Number(info.getValue()) === 1 ? "Active" : "Inactive"),
    },
    {
      accessorKey: "position",
      header: "Position",
    },
    {
      accessorKey: "hourly_rate",
      header: "Hourly Rate",
    },
    {
      accessorKey: "daily_rate",
      header: "Daily Rate",
    },
    {
      accessorKey: "monthly_rate",
      header: "Monthly Rate",
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
    data: employees,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <section className="employee-management">
      <header className="module-header">
        <div className="header-text">
          <h2>Employee Management</h2>
          <p>Manage employee profiles, roles, and status.</p>
        </div>
        <button
          type="button"
          className="btn-add"
          onClick={openAddModal}
          style={{ color: "#fff" }}
        >
          Add Employee
        </button>
      </header>

      <div className="module-content">
        {loading ? (
          <p>Loading employees...</p>
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
        title={formMode === "add" ? "Add Employee" : "Edit Employee"}
        fields={employeeFields}
        values={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onClose={closeModal}
        submitLabel={formMode === "add" ? "Save" : "Update"}
      />
    </section>
  );
}
