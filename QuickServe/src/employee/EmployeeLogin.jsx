import { useState } from "react";
import { useNavigate } from "react-router-dom";

function EmployeeLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    const employees = JSON.parse(
      localStorage.getItem("restaurantEmployees") || "[]",
    );

    const employee = employees.find(
      (item) =>
        item.username.toLowerCase() === username.trim().toLowerCase() &&
        item.password === password &&
        item.active !== false,
    );

    if (!employee) {
      alert("Invalid username or password.");
      return;
    }

    localStorage.setItem("restaurantEmployee", JSON.stringify(employee));

    navigate("/employee/dashboard");
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="auth-card">
              <div className="logo-circle">
                <i className="bi bi-person-badge"></i>
              </div>

              <h1>Employee Login</h1>

              <p className="text-muted">Login to access your employee panel.</p>

              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label className="form-label">Username</label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">Password</label>

                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-dark w-100 py-3">
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Login
                </button>
              </form>

              <button
                className="btn btn-link mt-3"
                onClick={() => navigate("/")}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeLogin;
