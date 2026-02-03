import { useEffect, useState } from "react";
import "./task_assignment_modal.css";

export default function TaskAssignmentModal({
  isOpen,
  task,
  onClose,
  onRefresh,
}) {
  const [assignments, setAssignments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("pending");

  useEffect(() => {
    if (isOpen && task) {
      fetchTaskAssignments();
      fetchAvailableEmployees();
    }
  }, [isOpen, task]);

  const fetchTaskAssignments = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/task-employees/${task.id}`,
      );
      const data = await response.json();
      setAssignments(data);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableEmployees = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/employees");
      const data = await response.json();
      setEmployees(data.filter((emp) => emp.active === 1));
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const getAssignedEmployeeIds = () => assignments.map((a) => a.employee_id);

  const handleAddAssignment = async () => {
    if (!selectedEmployeeId) {
      alert("Please select an employee");
      return;
    }

    const selectedEmployee = employees.find(
      (emp) => emp.id === Number(selectedEmployeeId),
    );

    try {
      const response = await fetch("http://localhost:3000/api/task-employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task_id: task.id,
          employee_id: Number(selectedEmployeeId),
          employee_name: selectedEmployee.employee_name,
          status: selectedStatus,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to add assignment");
      }

      await fetchTaskAssignments();
      setSelectedEmployeeId("");
      setSelectedStatus("pending");
      onRefresh();
    } catch (error) {
      console.error(error);
      alert(error.message || "Something went wrong. Please try again.");
    }
  };

  const handleStatusChange = async (assignmentId, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/task-employees/${assignmentId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update assignment");
      }

      await fetchTaskAssignments();
      onRefresh();
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleRemoveAssignment = async (assignmentId) => {
    if (!confirm("Are you sure you want to remove this assignment?")) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/task-employees/${assignmentId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to remove assignment");
      }

      await fetchTaskAssignments();
      onRefresh();
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content task-assignment-modal">
        <div className="modal-header">
          <h3>Manage Task Assignments</h3>
          <h4 style={{ margin: "5px 0 0 0", color: "#666" }}>
            {task?.task_name}
          </h4>
          <button
            type="button"
            className="btn-close"
            onClick={onClose}
            style={{
              position: "absolute",
              right: "15px",
              top: "15px",
              background: "none",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="add-assignment-section">
            <h4>Assign Employee</h4>
            <div className="assignment-form">
              <select
                value={selectedEmployeeId}
                onChange={(e) => setSelectedEmployeeId(e.target.value)}
              >
                <option value="">Select Employee</option>
                {employees
                  .filter((emp) => !getAssignedEmployeeIds().includes(emp.id))
                  .map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.employee_name}
                    </option>
                  ))}
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <button
                type="button"
                className="btn-add"
                onClick={handleAddAssignment}
              >
                Add Assignment
              </button>
            </div>
          </div>

          <div className="assignments-list-section">
            <h4>Current Assignments</h4>
            {loading ? (
              <p>Loading assignments...</p>
            ) : assignments.length === 0 ? (
              <p>No employees assigned to this task</p>
            ) : (
              <div className="assignments-list">
                {assignments.map((assignment) => (
                  <div key={assignment.id} className="assignment-item">
                    <div className="assignment-info">
                      <strong>{assignment.employee_name}</strong>
                      {assignment.date_created && (
                        <p
                          style={{
                            margin: "5px 0",
                            fontSize: "0.85em",
                            color: "#999",
                          }}
                        >
                          Assigned:{" "}
                          {
                            new Date(assignment.date_created)
                              .toISOString()
                              .split("T")[0]
                          }
                        </p>
                      )}
                    </div>
                    <div className="assignment-actions">
                      <select
                        value={assignment.status}
                        onChange={(e) =>
                          handleStatusChange(assignment.id, e.target.value)
                        }
                        className="status-select"
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                      <button
                        type="button"
                        className="btn-remove"
                        onClick={() => handleRemoveAssignment(assignment.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-cancel" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
