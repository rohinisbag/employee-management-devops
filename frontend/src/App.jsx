import { useEffect, useState } from "react";
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "./services/employeeApi";

function App() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const data = await getEmployees();
      setEmployees(data);
    } catch (error) {
      console.error(error);
      setMessage("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      department: "",
    });

    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (editingId) {
        await updateEmployee(editingId, form);
        setMessage("Employee updated successfully");
      } else {
        await createEmployee(form);
        setMessage("Employee created successfully");
      }

      resetForm();
      await loadEmployees();
    } catch (error) {
      console.error(error);
      setMessage("Operation failed");
    }
  };

  const handleEdit = (employee) => {
    setEditingId(employee.id);

    setForm({
      name: employee.name,
      email: employee.email,
      department: employee.department || "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this employee?")) {
      return;
    }

    try {
      await deleteEmployee(id);
      setMessage("Employee deleted successfully");
      await loadEmployees();
    } catch (error) {
      console.error(error);
      setMessage("Delete failed");
    }
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "40px auto", padding: "20px" }}>
      <h1>Employee Management System</h1>

      {message && (
        <div
          style={{
            padding: "10px",
            marginBottom: "20px",
            background: "#eee",
          }}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          name="department"
          placeholder="Department"
          value={form.department}
          onChange={handleChange}
        />

        <button type="submit">
          {editingId ? "Update Employee" : "Add Employee"}
        </button>

        {editingId && (
          <button type="button" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>

      <hr />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table width="100%" border="1" cellPadding="10">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.id}</td>
                <td>{employee.name}</td>
                <td>{employee.email}</td>
                <td>{employee.department}</td>

                <td>
                  <button onClick={() => handleEdit(employee)}>
                    Edit
                  </button>

                  <button onClick={() => handleDelete(employee.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;