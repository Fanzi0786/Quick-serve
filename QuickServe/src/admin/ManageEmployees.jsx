import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const defaultEmployees = [];

function ManageEmployees() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem("restaurantEmployees");

    return saved ? JSON.parse(saved) : defaultEmployees;
  });

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    role: "",
    username: "",
    password: "",
    active: true,
  });

  useEffect(() => {
    localStorage.setItem("restaurantEmployees", JSON.stringify(employees));
  }, [employees]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      mobile: "",
      email: "",
      role: "",
      username: "",
      password: "",
      active: true,
    });

    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.mobile.trim() ||
      !formData.role ||
      !formData.username.trim()
    ) {
      alert("Please fill all required fields.");
      return;
    }

    if (formData.mobile.length !== 10) {
      alert("Please enter a valid 10 digit mobile number.");
      return;
    }

    if (!editingId && !formData.password.trim()) {
      alert("Please enter a password.");
      return;
    }

    if (editingId) {
      const updatedEmployees = employees.map((employee) =>
        employee.id === editingId
          ? {
              ...employee,
              ...formData,
              password: formData.password.trim()
                ? formData.password
                : employee.password,
            }
          : employee,
      );

      setEmployees(updatedEmployees);
      alert("Employee updated successfully.");
    } else {
      const usernameExists = employees.some(
        (employee) =>
          employee.username.toLowerCase() ===
          formData.username.trim().toLowerCase(),
      );

      if (usernameExists) {
        alert("This username is already in use.");
        return;
      }

      const newEmployee = {
        id: Date.now(),
        ...formData,
        name: formData.name.trim(),
        mobile: formData.mobile,
        email: formData.email.trim(),
        username: formData.username.trim(),
        password: formData.password,
      };

      setEmployees([...employees, newEmployee]);

      alert("Employee added successfully.");
    }

    resetForm();
  };

  const editEmployee = (employee) => {
    setFormData({
      name: employee.name,
      mobile: employee.mobile,
      email: employee.email || "",
      role: employee.role,
      username: employee.username,
      password: "",
      active: employee.active,
    });

    setEditingId(employee.id);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteEmployee = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?",
    );

    if (!confirmDelete) return;

    const updatedEmployees = employees.filter((employee) => employee.id !== id);

    setEmployees(updatedEmployees);
  };

  const toggleEmployeeStatus = (id) => {
    const updatedEmployees = employees.map((employee) =>
      employee.id === id
        ? {
            ...employee,
            active: !employee.active,
          }
        : employee,
    );

    setEmployees(updatedEmployees);
  };

  return (
    <div className="manage-employees-page">
      {/* Navbar */}
      <nav className="navbar restaurant-navbar">
        <div className="container">
          <button
            className="btn btn-outline-light"
            onClick={() => navigate("/admin/dashboard")}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Dashboard
          </button>

          <span className="navbar-brand text-white fw-bold mb-0">
            <i className="bi bi-people me-2"></i>
            Manage Employees
          </span>

          <div></div>
        </div>
      </nav>

      <div className="container py-5">
        {/* Header */}
        <div className="employee-page-header">
          <div>
            <h2>Employee Management</h2>

            <p>Add, edit and manage your restaurant employees.</p>
          </div>

          <button
            className="btn btn-dark add-employee-btn"
            onClick={() => {
              if (showForm) {
                resetForm();
              } else {
                setShowForm(true);
              }
            }}
          >
            <i
              className={`bi ${showForm ? "bi-x-lg" : "bi-person-plus"} me-2`}
            ></i>

            {showForm ? "Cancel" : "Add Employee"}
          </button>
        </div>

        {/* Employee Form */}
        {showForm && (
          <div className="employee-form-card mb-5">
            <div className="employee-form-header">
              <h4>{editingId ? "Edit Employee" : "Add New Employee"}</h4>

              <p>Enter the employee information below.</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="row g-4">
                {/* Name */}
                <div className="col-md-6">
                  <label className="form-label">Employee Name *</label>

                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Enter employee name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Mobile */}
                <div className="col-md-6">
                  <label className="form-label">Mobile Number *</label>

                  <input
                    type="tel"
                    name="mobile"
                    className="form-control"
                    placeholder="Enter 10 digit mobile number"
                    maxLength="10"
                    value={formData.mobile}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        mobile: e.target.value.replace(/\D/g, ""),
                      })
                    }
                    required
                  />
                </div>

                {/* Email */}
                <div className="col-md-6">
                  <label className="form-label">Email Address</label>

                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="employee@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                {/* Role */}
                <div className="col-md-6">
                  <label className="form-label">Employee Role *</label>

                  <select
                    name="role"
                    className="form-select"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Role</option>

                    <option value="Manager">Manager</option>

                    <option value="Waiter">Waiter</option>

                    <option value="Chef">Chef</option>

                    <option value="Cashier">Cashier</option>

                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Username */}
                <div className="col-md-6">
                  <label className="form-label">Username *</label>

                  <input
                    type="text"
                    name="username"
                    className="form-control"
                    placeholder="Enter login username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Password */}
                <div className="col-md-6">
                  <label className="form-label">
                    Password {editingId ? "(leave blank to keep current)" : "*"}
                  </label>

                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder={
                      editingId ? "Enter new password" : "Enter password"
                    }
                    value={formData.password}
                    onChange={handleChange}
                    required={!editingId}
                  />
                </div>

                {/* Status */}
                <div className="col-12">
                  <div className="employee-status-input">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="employeeActive"
                      name="active"
                      checked={formData.active}
                      onChange={handleChange}
                    />

                    <label
                      className="form-check-label"
                      htmlFor="employeeActive"
                    >
                      Employee is currently active
                    </label>
                  </div>
                </div>

                {/* Buttons */}
                <div className="col-12">
                  <button type="submit" className="btn btn-dark me-2">
                    <i className="bi bi-check-lg me-2"></i>

                    {editingId ? "Update Employee" : "Add Employee"}
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={resetForm}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Employee List */}
        <div className="employee-list-card">
          <div className="employee-list-header">
            <div>
              <h4>All Employees</h4>

              <span>
                {employees.length} employee
                {employees.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="employee-counts">
              <span className="active-count">
                Active: {employees.filter((employee) => employee.active).length}
              </span>

              <span className="inactive-count">
                Inactive:{" "}
                {employees.filter((employee) => !employee.active).length}
              </span>
            </div>
          </div>

          {employees.length === 0 ? (
            <div className="empty-employee-state">
              <i className="bi bi-people"></i>

              <h4>No employees added</h4>

              <p>
                Add your first employee to start managing your restaurant team.
              </p>

              <button
                className="btn btn-dark"
                onClick={() => setShowForm(true)}
              >
                <i className="bi bi-person-plus me-2"></i>
                Add Employee
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table employee-admin-table align-middle">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Contact</th>
                    <th>Role</th>
                    <th>Username</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee.id}>
                      {/* Employee */}
                      <td>
                        <div className="employee-info">
                          <div className="employee-avatar">
                            {employee.name.charAt(0).toUpperCase()}
                          </div>

                          <div>
                            <strong>{employee.name}</strong>

                            <small>Employee ID: {employee.id}</small>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td>
                        <div className="employee-contact">
                          <span>
                            <i className="bi bi-telephone me-2"></i>
                            {employee.mobile}
                          </span>

                          {employee.email && (
                            <span>
                              <i className="bi bi-envelope me-2"></i>
                              {employee.email}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Role */}
                      <td>
                        <span className="employee-role">{employee.role}</span>
                      </td>

                      {/* Username */}
                      <td>
                        <span className="employee-username">
                          {employee.username}
                        </span>
                      </td>

                      {/* Status */}
                      <td>
                        <button
                          className={`employee-status-btn ${
                            employee.active ? "active" : "inactive"
                          }`}
                          onClick={() => toggleEmployeeStatus(employee.id)}
                        >
                          <i
                            className={`bi ${
                              employee.active
                                ? "bi-check-circle"
                                : "bi-x-circle"
                            } me-1`}
                          ></i>

                          {employee.active ? "Active" : "Inactive"}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => editEmployee(employee)}
                          title="Edit Employee"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>

                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => deleteEmployee(employee.id)}
                          title="Delete Employee"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageEmployees;
