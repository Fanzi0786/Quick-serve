import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PLAN_CONFIG = {
  Free: {
    days: 30,
    maxTables: 5,
    maxCustomers: 50,
  },

  "30 Days": {
    days: 30,
    maxTables: null,
    maxCustomers: null,
  },

  "90 Days": {
    days: 90,
    maxTables: null,
    maxCustomers: null,
  },

  "6 Months": {
    days: 180,
    maxTables: null,
    maxCustomers: null,
  },

  "1 Year": {
    days: 365,
    maxTables: null,
    maxCustomers: null,
  },
};

function getEndDate(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);

  return date.toISOString().split("T")[0];
}

function ManageSubscriptions() {
  const navigate = useNavigate();

  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = () => {
    const data = JSON.parse(
      localStorage.getItem("quickServeRestaurants") || "[]",
    );

    setRestaurants(data);
  };

  const updateRestaurants = (updated) => {
    localStorage.setItem("quickServeRestaurants", JSON.stringify(updated));

    setRestaurants(updated);
  };

  const renewSubscription = (id, plan) => {
    const config = PLAN_CONFIG[plan];

    const today = new Date().toISOString().split("T")[0];

    const endDate = getEndDate(config.days);

    const updated = restaurants.map((restaurant) => {
      if (restaurant.id !== id) {
        return restaurant;
      }

      return {
        ...restaurant,

        status: "Active",

        subscription: {
          plan,
          duration: plan === "Free" ? "30 Days" : plan,
          startDate: today,
          endDate,

          maxTables: config.maxTables,
          maxCustomers: config.maxCustomers,
        },
      };
    });

    updateRestaurants(updated);

    alert(`Subscription updated to ${plan} successfully.`);
  };

  const toggleAccess = (id) => {
    const updated = restaurants.map((restaurant) =>
      restaurant.id === id
        ? {
            ...restaurant,
            status: restaurant.status === "Active" ? "Inactive" : "Active",
          }
        : restaurant,
    );

    updateRestaurants(updated);
  };

  const isExpired = (restaurant) => {
    const endDate = restaurant.subscription?.endDate;

    if (!endDate) return true;

    return new Date(endDate) < new Date();
  };

  return (
    <div className="sa-page">
      <nav className="sa-navbar">
        <div className="container d-flex justify-content-between align-items-center">
          <div className="text-white fw-bold fs-5">
            <i className="bi bi-lightning-charge-fill me-2"></i>
            QuickServe Super Admin
          </div>

          <button
            className="btn btn-outline-light"
            onClick={() => navigate("/superadmin/dashboard")}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Dashboard
          </button>
        </div>
      </nav>

      <div className="container py-5">
        <div className="sa-heading">
          <div>
            <h2>Subscriptions</h2>

            <p>Manage restaurant plans, limits and subscription access.</p>
          </div>

          <span className="sa-admin-badge">Super Admin</span>
        </div>

        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <div className="sa-stat-card">
              <div className="sa-stat-icon">
                <i className="bi bi-gift"></i>
              </div>

              <div>
                <small>Free Plan</small>
                <h3>5 Tables</h3>
                <small>50 Customers</small>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="sa-stat-card">
              <div className="sa-stat-icon">
                <i className="bi bi-infinity"></i>
              </div>

              <div>
                <small>Paid Plans</small>
                <h3>Unlimited</h3>
                <small>Tables & Customers</small>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="sa-stat-card">
              <div className="sa-stat-icon">
                <i className="bi bi-calendar-check"></i>
              </div>

              <div>
                <small>Free Duration</small>
                <h3>30 Days</h3>
                <small>Fixed period</small>
              </div>
            </div>
          </div>
        </div>

        <div className="sa-management-card">
          {restaurants.length === 0 ? (
            <div className="sa-empty">
              <i className="bi bi-credit-card"></i>

              <h5>No Restaurants Found</h5>

              <p>Add a restaurant before managing subscriptions.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table sa-table">
                <thead>
                  <tr>
                    <th>Restaurant</th>
                    <th>Current Plan</th>
                    <th>Validity</th>
                    <th>Limits</th>
                    <th>Status</th>
                    <th>Change Plan</th>
                    <th>Access</th>
                  </tr>
                </thead>

                <tbody>
                  {restaurants.map((restaurant) => {
                    const subscription = restaurant.subscription || {};

                    const plan = subscription.plan || "Free";

                    const expired = isExpired(restaurant);

                    const free = plan === "Free";

                    return (
                      <tr key={restaurant.id}>
                        <td>
                          <strong>{restaurant.name}</strong>

                          <small>{restaurant.ownerName}</small>
                        </td>

                        <td>
                          <span className="badge bg-dark">{plan}</span>
                        </td>

                        <td>
                          <small>Start: {subscription.startDate || "-"}</small>

                          <small>End: {subscription.endDate || "-"}</small>
                        </td>

                        <td>
                          {free ? (
                            <>
                              <small>Tables: 5</small>

                              <small>Customers: 50</small>
                            </>
                          ) : (
                            <span className="text-success fw-bold">
                              Unlimited
                            </span>
                          )}
                        </td>

                        <td>
                          {expired ? (
                            <span className="sa-status expired">Expired</span>
                          ) : (
                            <span
                              className={`sa-status ${
                                restaurant.status === "Active"
                                  ? "active"
                                  : "inactive"
                              }`}
                            >
                              {restaurant.status}
                            </span>
                          )}
                        </td>

                        <td>
                          <select
                            className="form-select form-select-sm"
                            value={plan}
                            onChange={(e) =>
                              renewSubscription(restaurant.id, e.target.value)
                            }
                          >
                            <option value="Free">Free</option>

                            <option value="30 Days">30 Days</option>

                            <option value="90 Days">90 Days</option>

                            <option value="6 Months">6 Months</option>

                            <option value="1 Year">1 Year</option>
                          </select>
                        </td>

                        <td>
                          <button
                            className={`btn btn-sm ${
                              restaurant.status === "Active"
                                ? "btn-outline-warning"
                                : "btn-outline-success"
                            }`}
                            onClick={() => toggleAccess(restaurant.id)}
                          >
                            {restaurant.status === "Active"
                              ? "Suspend"
                              : "Activate"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageSubscriptions;
