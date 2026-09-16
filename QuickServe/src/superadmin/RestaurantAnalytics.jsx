import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function RestaurantAnalytics() {
  const navigate = useNavigate();

  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const data = JSON.parse(
      localStorage.getItem("quickServeRestaurants") || "[]",
    );

    setRestaurants(data);
  }, []);

  return (
    <div className="sa-page">
      <nav className="navbar sa-navbar">
        <div className="container">
          <button
            className="btn text-white"
            onClick={() => navigate("/superadmin/dashboard")}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Dashboard
          </button>

          <span className="navbar-brand text-white fw-bold">
            Restaurant Analytics
          </span>

          <span></span>
        </div>
      </nav>

      <div className="container py-5">
        <div className="sa-heading">
          <div>
            <h2>Restaurant Analytics</h2>

            <p>Monitor restaurant activity across the QuickServe platform.</p>
          </div>
        </div>

        <div className="row g-4">
          {restaurants.map((restaurant) => (
            <div className="col-md-6 col-lg-4" key={restaurant.id}>
              <div className="sa-analytics-card">
                <div className="sa-analytics-header">
                  <div className="sa-analytics-icon">
                    <i className="bi bi-shop"></i>
                  </div>

                  <div>
                    <h5>{restaurant.name}</h5>

                    <small>{restaurant.adminUsername}</small>
                  </div>
                </div>

                <div className="sa-analytics-stats">
                  <div>
                    <small>Orders</small>
                    <strong>0</strong>
                  </div>

                  <div>
                    <small>Customers</small>
                    <strong>0</strong>
                  </div>

                  <div>
                    <small>Revenue</small>
                    <strong>₹0</strong>
                  </div>

                  <div>
                    <small>QR Scans</small>
                    <strong>0</strong>
                  </div>
                </div>

                <div className="sa-analytics-footer">
                  <span
                    className={
                      restaurant.status === "Active"
                        ? "sa-status active"
                        : "sa-status inactive"
                    }
                  >
                    {restaurant.status}
                  </span>

                  <span>{restaurant.subscription?.plan}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {restaurants.length === 0 && (
          <div className="sa-empty mt-4">
            <i className="bi bi-bar-chart"></i>

            <h5>No Analytics Available</h5>

            <p>Add restaurants to start monitoring platform activity.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default RestaurantAnalytics;
