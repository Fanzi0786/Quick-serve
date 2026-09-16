import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (!username.trim() || !password) {
      alert("Please enter username and password.");
      return;
    }

    const restaurants = JSON.parse(
      localStorage.getItem("quickServeRestaurants") || "[]",
    );

    const restaurant = restaurants.find(
      (item) =>
        item.adminUsername === username.trim() &&
        item.adminPassword === password,
    );

    if (!restaurant) {
      alert("Invalid restaurant admin credentials.");
      return;
    }

    if (restaurant.status !== "Active") {
      alert(
        "Your restaurant admin account is inactive. Please contact QuickServe Super Admin.",
      );
      return;
    }

    const endDate = restaurant.subscription?.endDate;

    if (endDate && new Date(endDate) < new Date()) {
      alert(
        "Your subscription has expired. Please contact QuickServe Super Admin.",
      );
      return;
    }

    const session = {
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      ownerName: restaurant.ownerName,
      email: restaurant.email,
      adminUsername: restaurant.adminUsername,
      subscription: restaurant.subscription,
    };

    localStorage.setItem("restaurantAdminSession", JSON.stringify(session));

    localStorage.setItem("restaurantAdmin", "true");

    navigate("/admin/dashboard");
  };

  return (
    <div className="sa-auth-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="sa-auth-card">
              <div className="sa-auth-icon">
                <i className="bi bi-shop"></i>
              </div>

              <h1>Restaurant Admin</h1>

              <p>
                Login using the credentials created by QuickServe Super Admin.
              </p>

              <form onSubmit={handleLogin}>
                <div className="mb-3 text-start">
                  <label className="form-label">Username</label>

                  <input
                    type="text"
                    className="form-control"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter admin username"
                  />
                </div>

                <div className="mb-4 text-start">
                  <label className="form-label">Password</label>

                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                  />
                </div>

                <button type="submit" className="btn btn-dark w-100 py-2">
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Login
                </button>
              </form>

              <button
                className="btn btn-link mt-3"
                onClick={() => navigate("/superadmin")}
              >
                Super Admin Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
