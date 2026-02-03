import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import ModalForm from "../../components/modal_form/modal_form";
import TaskAssignmentModal from "../../components/task_assignment_modal/task_assignment_modal";
import "./task_management.css";

export default function TaskManagement() {
  const taskFields = [
    {
      name: "task_name",
      label: "Task Name",
      type: "text",
      required: true,
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      required: true,
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ],
    },
    {
      name: "date",
      label: "Date",
      type: "date",
      required: true,
    },
  ];

  const getEmptyFormData = () =>
    taskFields.reduce(
      (acc, field) => ({
        ...acc,
        [field.name]: "",
      }),
      { id: null },
    );

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [formData, setFormData] = useState(getEmptyFormData);
  const [selectedTask, setSelectedTask] = useState(null);

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/tasks");
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setFormMode("add");
    setFormData(getEmptyFormData());
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setFormMode("edit");
    setFormData({
      id: task.id,
      task_name: task.task_name || "",
      status: task.status || "active",
      date: task.date ? new Date(task.date).toISOString().split("T")[0] : "",
    });
    setIsModalOpen(true);
  };

  const openAssignmentModal = (task) => {
    setSelectedTask(task);
    setIsAssignmentModalOpen(true);
  };

  const closeAssignmentModal = () => {
    setIsAssignmentModalOpen(false);
    setSelectedTask(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      task_name: formData.task_name.trim(),
      status: formData.status || "active",
      date: formData.date || null,
    };

    try {
      if (formMode === "add") {
        const response = await fetch("http://localhost:3000/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error("Failed to create task");
        }
      } else {
        const response = await fetch(
          `http://localhost:3000/api/tasks/${formData.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          },
        );

        if (!response.ok) {
          throw new Error("Failed to update task");
        }
      }

      await fetchTasks();
      closeModal();
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    }
  };

  // Define table columns
  const columns = [
    {
      accessorKey: "task_name",
      header: "Task Name",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        return status === "active" ? "Active" : "Inactive";
      },
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => {
        const date = row.original.date;
        return date ? new Date(date).toISOString().split("T")[0] : "";
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            type="button"
            className="btn-edit"
            onClick={() => openEditModal(row.original)}
            style={{ color: "#fff" }}
          >
            Edit
          </button>
          <button
            type="button"
            className="btn-assign"
            onClick={() => openAssignmentModal(row.original)}
            style={{ color: "#fff", backgroundColor: "#2196F3" }}
          >
            Assign
          </button>
        </div>
      ),
    },
  ];

  // Create table instance
  const table = useReactTable({
    data: tasks,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <section className="employee-management">
      <header className="module-header">
        <div className="header-text">
          <h2>Task Management</h2>
          <p>Create, assign, and track tasks for employees.</p>
        </div>
        <button
          type="button"
          className="btn-add"
          onClick={openAddModal}
          style={{ color: "#fff" }}
        >
          Add Task
        </button>
      </header>

      <div className="module-content">
        {loading ? (
          <p>Loading tasks...</p>
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
        title={formMode === "add" ? "Add Task" : "Edit Task"}
        fields={taskFields}
        values={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onClose={closeModal}
        submitLabel={formMode === "add" ? "Save" : "Update"}
      />

      <TaskAssignmentModal
        isOpen={isAssignmentModalOpen}
        task={selectedTask}
        onClose={closeAssignmentModal}
        onRefresh={fetchTasks}
      />
    </section>
  );
}
