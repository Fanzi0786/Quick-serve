import { useNavigate } from "react-router-dom";

function EmployeeDashboard() {
  const navigate = useNavigate();

  const employee = JSON.parse(
    localStorage.getItem("restaurantEmployee") || "{}",
  );

  const order = JSON.parse(localStorage.getItem("restaurantOrder") || "{}");

  const logout = () => {
    localStorage.removeItem("restaurantEmployee");
    navigate("/employee/login");
  };

  const changeStatus = (status) => {
    if (!order.id) {
      alert("No active order found.");
      return;
    }

    const updatedOrder = {
      ...order,
      status,
    };

    localStorage.setItem("restaurantOrder", JSON.stringify(updatedOrder));

    alert(`Order status changed to ${status}`);

    window.location.reload();
  };

  return (
    <div className="admin-page">
      {/* NAVBAR */}

      <nav className="navbar restaurant-navbar">
        <div className="container">
          <span className="navbar-brand text-white fw-bold">
            <i className="bi bi-person-badge me-2"></i>
            Employee Panel
          </span>

          <button className="btn btn-light" onClick={logout}>
            <i className="bi bi-box-arrow-right me-2"></i>
            Logout
          </button>
        </div>
      </nav>

      {/* CONTENT */}

      <div className="container py-5">
        {/* HEADER */}

        <div className="admin-dashboard-heading">
          <div>
            <h2>Welcome, {employee.name || "Employee"}</h2>

            <p>Manage restaurant orders according to your role.</p>
          </div>

          <span className="badge bg-dark fs-6 px-3 py-2">
            {employee.role || "Employee"}
          </span>
        </div>

        {/* ROLE INFO */}

        <div className="admin-management-section mb-4">
          <div className="management-section-heading">
            <h4>
              <i className="bi bi-person-badge me-2"></i>
              Employee Information
            </h4>

            <p>Your current employee account details.</p>
          </div>

          <div className="row g-3">
            <div className="col-md-4">
              <div className="p-3 bg-light rounded">
                <small className="text-muted">Name</small>

                <div className="fw-bold">{employee.name}</div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="p-3 bg-light rounded">
                <small className="text-muted">Username</small>

                <div className="fw-bold">{employee.username}</div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="p-3 bg-light rounded">
                <small className="text-muted">Role</small>

                <div className="fw-bold">{employee.role}</div>
              </div>
            </div>
          </div>
        </div>

        {/* ORDER */}

        <div className="admin-management-section">
          <div className="management-section-heading">
            <h4>
              <i className="bi bi-bag-check me-2"></i>
              Current Order
            </h4>

            <p>Update the customer order status.</p>
          </div>

          {!order.id ? (
            <div className="text-center py-5">
              <i className="bi bi-inbox fs-1 text-muted"></i>

              <h5 className="mt-3">No Active Order</h5>

              <p className="text-muted">
                There are currently no customer orders.
              </p>
            </div>
          ) : (
            <div>
              <div className="border rounded p-4 mb-4">
                <div className="row g-3">
                  <div className="col-md-4">
                    <small className="text-muted">Order ID</small>

                    <h6>#{order.id}</h6>
                  </div>

                  <div className="col-md-4">
                    <small className="text-muted">Table</small>

                    <h6>{order.table || "N/A"}</h6>
                  </div>

                  <div className="col-md-4">
                    <small className="text-muted">Current Status</small>

                    <h6>{order.status}</h6>
                  </div>
                </div>
              </div>

              {/* STATUS BUTTONS */}

              <div className="d-flex gap-2 flex-wrap">
                <button
                  className="btn btn-warning"
                  onClick={() => changeStatus("Preparing")}
                >
                  <i className="bi bi-fire me-2"></i>
                  Preparing
                </button>

                <button
                  className="btn btn-info"
                  onClick={() => changeStatus("Ready")}
                >
                  <i className="bi bi-check2-circle me-2"></i>
                  Ready
                </button>

                <button
                  className="btn btn-success"
                  onClick={() => changeStatus("Completed")}
                >
                  <i className="bi bi-check-circle me-2"></i>
                  Completed
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmployeeDashboard;
