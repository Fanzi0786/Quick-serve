import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PLAN_CONFIG = {
  Free: {
    duration: "30 Days",
    days: 30,
    maxTables: 5,
    maxCustomers: 50,
  },
  "30 Days": {
    duration: "30 Days",
    days: 30,
    maxTables: null,
    maxCustomers: null,
  },
  "90 Days": {
    duration: "90 Days",
    days: 90,
    maxTables: null,
    maxCustomers: null,
  },
  "6 Months": {
    duration: "6 Months",
    days: 180,
    maxTables: null,
    maxCustomers: null,
  },
  "1 Year": {
    duration: "1 Year",
    days: 365,
    maxTables: null,
    maxCustomers: null,
  },
};

function calculateEndDate(startDate, days) {
  const date = new Date(startDate);
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
}

function ManageRestaurants() {
  const navigate = useNavigate();

  const [restaurants, setRestaurants] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    ownerName: "",
    mobile: "",
    email: "",
    address: "",
    adminUsername: "",
    adminPassword: "",
    plan: "Free",
  });

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = () => {
    const data = JSON.parse(
      localStorage.getItem("quickServeRestaurants") || "[]",
    );

    setRestaurants(data);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setForm({
      name: "",
      ownerName: "",
      mobile: "",
      email: "",
      address: "",
      adminUsername: "",
      adminPassword: "",
      plan: "Free",
    });

    setEditingId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.ownerName.trim() ||
      !form.mobile.trim() ||
      !form.email.trim() ||
      !form.adminUsername.trim() ||
      !form.adminPassword.trim()
    ) {
      alert("Please fill all required fields.");
      return;
    }

    const usernameExists = restaurants.some(
      (restaurant) =>
        restaurant.adminUsername.toLowerCase() ===
          form.adminUsername.trim().toLowerCase() &&
        restaurant.id !== editingId,
    );

    if (usernameExists) {
      alert("This admin username is already in use.");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    const config = PLAN_CONFIG[form.plan];

    if (editingId) {
      const updated = restaurants.map((restaurant) => {
        if (restaurant.id !== editingId) {
          return restaurant;
        }

        return {
          ...restaurant,
          name: form.name.trim(),
          ownerName: form.ownerName.trim(),
          mobile: form.mobile.trim(),
          email: form.email.trim(),
          address: form.address.trim(),
          adminUsername: form.adminUsername.trim(),
          adminPassword: form.adminPassword,
        };
      });

      localStorage.setItem("quickServeRestaurants", JSON.stringify(updated));

      setRestaurants(updated);
      alert("Restaurant updated successfully.");
      resetForm();
      return;
    }

    const newRestaurant = {
      id: Date.now(),

      name: form.name.trim(),
      ownerName: form.ownerName.trim(),
      mobile: form.mobile.trim(),
      email: form.email.trim(),
      address: form.address.trim(),

      adminUsername: form.adminUsername.trim(),
      adminPassword: form.adminPassword,

      status: "Active",

      subscription: {
        plan: form.plan,
        duration: config.duration,
        startDate: today,
        endDate: calculateEndDate(today, config.days),

        maxTables: config.maxTables,
        maxCustomers: config.maxCustomers,
      },

      createdAt: today,
    };

    const updated = [...restaurants, newRestaurant];

    localStorage.setItem("quickServeRestaurants", JSON.stringify(updated));

    setRestaurants(updated);

    alert(`${form.name} created successfully with ${form.plan} plan.`);

    resetForm();
  };

  const editRestaurant = (restaurant) => {
    setEditingId(restaurant.id);

    setForm({
      name: restaurant.name || "",
      ownerName: restaurant.ownerName || "",
      mobile: restaurant.mobile || "",
      email: restaurant.email || "",
      address: restaurant.address || "",
      adminUsername: restaurant.adminUsername || "",
      adminPassword: restaurant.adminPassword || "",
      plan: restaurant.subscription?.plan || "Free",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteRestaurant = (id) => {
    const restaurant = restaurants.find((item) => item.id === id);

    if (!restaurant) return;

    const confirmed = window.confirm(
      `Delete ${restaurant.name}? This action cannot be undone.`,
    );

    if (!confirmed) return;

    const updated = restaurants.filter((restaurant) => restaurant.id !== id);

    localStorage.setItem("quickServeRestaurants", JSON.stringify(updated));

    setRestaurants(updated);
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

    localStorage.setItem("quickServeRestaurants", JSON.stringify(updated));

    setRestaurants(updated);
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
            <h2>{editingId ? "Edit Restaurant" : "Manage Restaurants"}</h2>

            <p>
              Create restaurants and assign their admin accounts and
              subscriptions.
            </p>
          </div>

          <span className="sa-admin-badge">Super Admin</span>
        </div>

        <div className="sa-management-card">
          <div className="sa-section-heading">
            <h4>{editingId ? "Update Restaurant" : "Add New Restaurant"}</h4>

            <p>Create a restaurant with its own admin login.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Restaurant Name *</label>

                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Example: Royal Cafe"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Owner Name *</label>

                <input
                  type="text"
                  className="form-control"
                  name="ownerName"
                  value={form.ownerName}
                  onChange={handleChange}
                  placeholder="Owner name"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Mobile *</label>

                <input
                  type="text"
                  className="form-control"
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  placeholder="Mobile number"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Email *</label>

                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="restaurant@email.com"
                />
              </div>

              <div className="col-12">
                <label className="form-label">Address</label>

                <textarea
                  className="form-control"
                  name="address"
                  rows="2"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Restaurant address"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Admin Username *</label>

                <input
                  type="text"
                  className="form-control"
                  name="adminUsername"
                  value={form.adminUsername}
                  onChange={handleChange}
                  placeholder="Restaurant admin username"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Admin Password *</label>

                <input
                  type="text"
                  className="form-control"
                  name="adminPassword"
                  value={form.adminPassword}
                  onChange={handleChange}
                  placeholder="Set admin password"
                />
              </div>

              {!editingId && (
                <div className="col-md-6">
                  <label className="form-label">Subscription Plan</label>

                  <select
                    className="form-select"
                    name="plan"
                    value={form.plan}
                    onChange={handleChange}
                  >
                    <option value="Free">Free — 30 Days</option>

                    <option value="30 Days">30 Days — Unlimited</option>

                    <option value="90 Days">90 Days — Unlimited</option>

                    <option value="6 Months">6 Months — Unlimited</option>

                    <option value="1 Year">1 Year — Unlimited</option>
                  </select>
                </div>
              )}

              {!editingId && form.plan === "Free" && (
                <div className="col-md-6">
                  <div className="alert alert-warning mb-0">
                    <strong>Free Plan Limits</strong>

                    <div className="mt-2">
                      <div>
                        <i className="bi bi-grid me-2"></i>
                        Maximum 5 Tables
                      </div>

                      <div>
                        <i className="bi bi-people me-2"></i>
                        Maximum 50 Unique Customers
                      </div>

                      <div>
                        <i className="bi bi-calendar me-2"></i>
                        Valid for 30 Days
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="col-12">
                <button type="submit" className="btn btn-dark me-2">
                  <i
                    className={`bi ${
                      editingId ? "bi-check-lg" : "bi-plus-lg"
                    } me-2`}
                  ></i>

                  {editingId ? "Update Restaurant" : "Create Restaurant"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={resetForm}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        <div className="sa-management-card">
          <div className="sa-section-heading">
            <h4>Restaurants</h4>

            <p>
              {restaurants.length} restaurant
              {restaurants.length !== 1 ? "s" : ""} registered.
            </p>
          </div>

          {restaurants.length === 0 ? (
            <div className="sa-empty">
              <i className="bi bi-shop"></i>
              <h5>No Restaurants Yet</h5>
              <p>Create your first restaurant using the form above.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table sa-table">
                <thead>
                  <tr>
                    <th>Restaurant</th>
                    <th>Admin Login</th>
                    <th>Plan</th>
                    <th>Limits</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {restaurants.map((restaurant) => {
                    const subscription = restaurant.subscription || {};

                    const isFree = subscription.plan === "Free";

                    const expired =
                      subscription.endDate &&
                      new Date(subscription.endDate) < new Date();

                    return (
                      <tr key={restaurant.id}>
                        <td>
                          <strong>{restaurant.name}</strong>
                          <small>{restaurant.ownerName}</small>
                        </td>

                        <td>
                          <strong>{restaurant.adminUsername}</strong>

                          <small>Password set</small>
                        </td>

                        <td>
                          <span className="badge bg-dark">
                            {subscription.plan || "Free"}
                          </span>

                          <small>
                            {subscription.startDate} → {subscription.endDate}
                          </small>
                        </td>

                        <td>
                          {isFree ? (
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
                          <div className="d-flex gap-2 flex-wrap">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => editRestaurant(restaurant)}
                            >
                              <i className="bi bi-pencil"></i>
                            </button>

                            <button
                              className={`btn btn-sm ${
                                restaurant.status === "Active"
                                  ? "btn-outline-warning"
                                  : "btn-outline-success"
                              }`}
                              onClick={() => toggleAccess(restaurant.id)}
                            >
                              <i
                                className={`bi ${
                                  restaurant.status === "Active"
                                    ? "bi-pause"
                                    : "bi-play"
                                }`}
                              ></i>
                            </button>

                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => deleteRestaurant(restaurant.id)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
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

export default ManageRestaurants;
