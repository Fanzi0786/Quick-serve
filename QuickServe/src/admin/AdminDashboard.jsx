import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [restaurant, setRestaurant] = useState(null);

  const [tables, setTables] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState([]);
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = () => {
    const adminSession = JSON.parse(
      localStorage.getItem("restaurantAdminSession") || "null",
    );

    if (!adminSession) {
      navigate("/admin");
      return;
    }

    setSession(adminSession);

    const restaurants = JSON.parse(
      localStorage.getItem("quickServeRestaurants") || "[]",
    );

    const currentRestaurant = restaurants.find(
      (item) => item.id === adminSession.restaurantId,
    );

    if (!currentRestaurant) {
      localStorage.removeItem("restaurantAdminSession");

      localStorage.removeItem("restaurantAdmin");

      navigate("/admin");

      return;
    }

    setRestaurant(currentRestaurant);

    // -------------------------
    // TABLES
    // -------------------------

    const allTables = JSON.parse(
      localStorage.getItem("quickServeTables") || "{}",
    );

    setTables(allTables[adminSession.restaurantId] || []);

    // -------------------------
    // CUSTOMERS
    // -------------------------

    const allCustomers = JSON.parse(
      localStorage.getItem("quickServeCustomers") || "{}",
    );

    setCustomers(allCustomers[adminSession.restaurantId] || []);

    // -------------------------
    // EMPLOYEES
    // -------------------------

    const allEmployees = JSON.parse(
      localStorage.getItem("quickServeEmployees") || "{}",
    );

    /*
      Supports both:
      1. New restaurant-wise employee storage
      2. Old global employee storage
    */

    if (allEmployees[adminSession.restaurantId]) {
      setEmployees(allEmployees[adminSession.restaurantId]);
    } else {
      const oldEmployees = JSON.parse(
        localStorage.getItem("restaurantEmployees") || "[]",
      );

      setEmployees(oldEmployees);
    }

    // -------------------------
    // MENU
    // -------------------------

    const allMenus = JSON.parse(
      localStorage.getItem("quickServeMenus") || "{}",
    );

    if (allMenus[adminSession.restaurantId]) {
      setMenu(allMenus[adminSession.restaurantId]);
    } else {
      const oldMenu = JSON.parse(
        localStorage.getItem("restaurantMenu") || "[]",
      );

      setMenu(oldMenu);
    }

    // -------------------------
    // ORDERS
    // -------------------------

    const allOrders = JSON.parse(
      localStorage.getItem("quickServeOrders") || "{}",
    );

    if (allOrders[adminSession.restaurantId]) {
      setOrders(allOrders[adminSession.restaurantId]);
    } else {
      const oldOrder = JSON.parse(
        localStorage.getItem("restaurantOrder") || "null",
      );

      setOrders(oldOrder ? [oldOrder] : []);
    }

    // -------------------------
    // FEEDBACK
    // -------------------------

    const allFeedback = JSON.parse(
      localStorage.getItem("quickServeFeedback") || "{}",
    );

    if (allFeedback[adminSession.restaurantId]) {
      setFeedback(allFeedback[adminSession.restaurantId]);
    } else {
      const oldFeedback = JSON.parse(
        localStorage.getItem("restaurantFeedback") || "[]",
      );

      setFeedback(oldFeedback);
    }
  };

  // -------------------------
  // LOGOUT
  // -------------------------

  const handleLogout = () => {
    localStorage.removeItem("restaurantAdminSession");

    localStorage.removeItem("restaurantAdmin");

    navigate("/admin");
  };

  // -------------------------
  // SUBSCRIPTION
  // -------------------------

  const subscription = restaurant?.subscription || {};

  const plan = subscription.plan || "Free";

  const maxTables = subscription.maxTables;

  const maxCustomers = subscription.maxCustomers;

  const tableLimitReached =
    maxTables !== null && maxTables !== undefined && tables.length >= maxTables;

  const customerLimitReached =
    maxCustomers !== null &&
    maxCustomers !== undefined &&
    customers.length >= maxCustomers;

  // -------------------------
  // EXPIRY
  // -------------------------

  const expired =
    subscription.endDate && new Date(subscription.endDate) < new Date();

  // -------------------------
  // REVENUE
  // -------------------------

  const totalRevenue = orders.reduce(
    (total, order) => total + Number(order.total || order.totalAmount || 0),
    0,
  );

  // -------------------------
  // ACTIVE MENU
  // -------------------------

  const availableMenuItems = menu.filter(
    (item) => item.available !== false,
  ).length;

  // -------------------------
  // RECENT ORDERS
  // -------------------------

  const recentOrders = [...orders].reverse().slice(0, 5);

  if (!session || !restaurant) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border" role="status"></div>

          <p className="mt-3">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sa-page">
      {/* =========================
          NAVBAR
      ========================== */}

      <nav className="sa-navbar">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <div className="text-white">
              <div className="fw-bold fs-5">
                <i className="bi bi-lightning-charge-fill me-2"></i>
                QuickServe
              </div>

              <small className="text-white-50">Restaurant Admin</small>
            </div>

            <div className="d-flex align-items-center gap-3">
              <div className="text-white text-end d-none d-md-block">
                <strong>{restaurant.name}</strong>

                <small className="d-block text-white-50">
                  {session.adminUsername}
                </small>
              </div>

              <button className="btn btn-outline-light" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right me-2"></i>
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container py-5">
        {/* =========================
            HEADER
        ========================== */}

        <div className="sa-heading">
          <div>
            <h2>Welcome, {restaurant.ownerName}</h2>

            <p>Manage your restaurant, menu, employees, tables and orders.</p>
          </div>

          <div className="text-end">
            <span
              className={`badge ${
                plan === "Free" ? "bg-warning text-dark" : "bg-dark"
              } px-3 py-2`}
            >
              {plan} Plan
            </span>

            <small className="d-block text-muted mt-2">
              Valid until: {subscription.endDate || "-"}
            </small>
          </div>
        </div>

        {/* =========================
            EXPIRY WARNING
        ========================== */}

        {expired && (
          <div className="alert alert-danger">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            <strong>Subscription Expired.</strong> Your restaurant access is
            currently unavailable. Please contact QuickServe Super Admin.
          </div>
        )}

        {/* =========================
            FREE PLAN WARNING
        ========================== */}

        {plan === "Free" &&
          !expired &&
          (tableLimitReached || customerLimitReached) && (
            <div className="alert alert-warning">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              <strong>Free Plan Limit Reached.</strong>{" "}
              {tableLimitReached && "Table limit has been reached. "}
              {customerLimitReached && "Customer limit has been reached. "}
              Please upgrade your subscription for unlimited usage.
            </div>
          )}

        {/* =========================
            STATS
        ========================== */}

        <div className="row g-4 mb-4">
          {/* TABLES */}

          <div className="col-md-6 col-xl-3">
            <div className="sa-stat-card">
              <div className="sa-stat-icon">
                <i className="bi bi-grid"></i>
              </div>

              <div>
                <small>Tables</small>

                <h3>
                  {tables.length} /{" "}
                  {maxTables === null || maxTables === undefined
                    ? "∞"
                    : maxTables}
                </h3>
              </div>
            </div>
          </div>

          {/* CUSTOMERS */}

          <div className="col-md-6 col-xl-3">
            <div className="sa-stat-card">
              <div className="sa-stat-icon">
                <i className="bi bi-people"></i>
              </div>

              <div>
                <small>Customers</small>

                <h3>
                  {customers.length} /{" "}
                  {maxCustomers === null || maxCustomers === undefined
                    ? "∞"
                    : maxCustomers}
                </h3>
              </div>
            </div>
          </div>

          {/* ORDERS */}

          <div className="col-md-6 col-xl-3">
            <div className="sa-stat-card">
              <div className="sa-stat-icon">
                <i className="bi bi-receipt"></i>
              </div>

              <div>
                <small>Total Orders</small>

                <h3>{orders.length}</h3>
              </div>
            </div>
          </div>

          {/* REVENUE */}

          <div className="col-md-6 col-xl-3">
            <div className="sa-stat-card">
              <div className="sa-stat-icon">
                <i className="bi bi-currency-rupee"></i>
              </div>

              <div>
                <small>Revenue</small>

                <h3>₹{totalRevenue.toLocaleString("en-IN")}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* =========================
            USAGE CARDS
        ========================== */}

        <div className="row g-4 mb-4">
          {/* TABLE USAGE */}

          <div className="col-lg-6">
            <div className="sa-management-card h-100 mb-0">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h5 className="fw-bold mb-1">Table Usage</h5>

                  <p className="text-muted mb-0">Current table usage</p>
                </div>

                <i className="bi bi-grid fs-3"></i>
              </div>

              <div className="progress mb-3">
                <div
                  className="progress-bar"
                  style={{
                    width:
                      maxTables === null || maxTables === undefined
                        ? "20%"
                        : `${Math.min(
                            (tables.length / maxTables) * 100,
                            100,
                          )}%`,
                  }}
                ></div>
              </div>

              <div className="d-flex justify-content-between">
                <strong>{tables.length} used</strong>

                <span className="text-muted">
                  {maxTables === null || maxTables === undefined
                    ? "Unlimited"
                    : `${maxTables} maximum`}
                </span>
              </div>
            </div>
          </div>

          {/* CUSTOMER USAGE */}

          <div className="col-lg-6">
            <div className="sa-management-card h-100 mb-0">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h5 className="fw-bold mb-1">Customer Usage</h5>

                  <p className="text-muted mb-0">Unique customers</p>
                </div>

                <i className="bi bi-people fs-3"></i>
              </div>

              <div className="progress mb-3">
                <div
                  className="progress-bar"
                  style={{
                    width:
                      maxCustomers === null || maxCustomers === undefined
                        ? "20%"
                        : `${Math.min(
                            (customers.length / maxCustomers) * 100,
                            100,
                          )}%`,
                  }}
                ></div>
              </div>

              <div className="d-flex justify-content-between">
                <strong>{customers.length} used</strong>

                <span className="text-muted">
                  {maxCustomers === null || maxCustomers === undefined
                    ? "Unlimited"
                    : `${maxCustomers} maximum`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================
            MANAGEMENT
        ========================== */}

        <div className="sa-management-card">
          <div className="sa-section-heading">
            <h4>Restaurant Management</h4>

            <p>Manage all major restaurant operations from here.</p>
          </div>

          <div className="row g-3">
            {/* MENU */}

            <div className="col-md-6 col-lg-4">
              <button
                className="sa-management-btn"
                onClick={() => navigate("/admin/menu")}
              >
                <span className="sa-management-icon">
                  <i className="bi bi-egg-fried"></i>
                </span>

                <span>
                  <strong>Manage Menu</strong>

                  <small>{availableMenuItems} available items</small>
                </span>

                <i className="bi bi-chevron-right"></i>
              </button>
            </div>

            {/* TABLES */}

            <div className="col-md-6 col-lg-4">
              <button
                className="sa-management-btn"
                onClick={() => navigate("/admin/tables")}
              >
                <span className="sa-management-icon">
                  <i className="bi bi-grid"></i>
                </span>

                <span>
                  <strong>Manage Tables</strong>

                  <small>
                    {tables.length} /{" "}
                    {maxTables === null || maxTables === undefined
                      ? "∞"
                      : maxTables}{" "}
                    tables
                  </small>
                </span>

                <i className="bi bi-chevron-right"></i>
              </button>
            </div>

            {/* EMPLOYEES */}

            <div className="col-md-6 col-lg-4">
              <button
                className="sa-management-btn"
                onClick={() => navigate("/admin/employees")}
              >
                <span className="sa-management-icon">
                  <i className="bi bi-person-badge"></i>
                </span>

                <span>
                  <strong>Manage Employees</strong>

                  <small>{employees.length} employees</small>
                </span>

                <i className="bi bi-chevron-right"></i>
              </button>
            </div>

            {/* ORDERS */}

            <div className="col-md-6 col-lg-4">
              <button
                className="sa-management-btn"
                onClick={() =>
                  alert("Order management page will be added next.")
                }
              >
                <span className="sa-management-icon">
                  <i className="bi bi-receipt"></i>
                </span>

                <span>
                  <strong>Orders</strong>

                  <small>{orders.length} total orders</small>
                </span>

                <i className="bi bi-chevron-right"></i>
              </button>
            </div>

            {/* CUSTOMERS */}

            <div className="col-md-6 col-lg-4">
              <button
                className="sa-management-btn"
                onClick={() =>
                  alert("Customer management page will be added next.")
                }
              >
                <span className="sa-management-icon">
                  <i className="bi bi-people"></i>
                </span>

                <span>
                  <strong>Customers</strong>

                  <small>{customers.length} unique customers</small>
                </span>

                <i className="bi bi-chevron-right"></i>
              </button>
            </div>

            {/* FEEDBACK */}

            <div className="col-md-6 col-lg-4">
              <button
                className="sa-management-btn"
                onClick={() =>
                  alert(`You have ${feedback.length} feedback records.`)
                }
              >
                <span className="sa-management-icon">
                  <i className="bi bi-chat-square-text"></i>
                </span>

                <span>
                  <strong>Feedback</strong>

                  <small>{feedback.length} feedback records</small>
                </span>

                <i className="bi bi-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>

        {/* =========================
            SUBSCRIPTION
        ========================== */}

        <div className="sa-management-card">
          <div className="sa-section-heading">
            <h4>Subscription</h4>

            <p>Current subscription information.</p>
          </div>

          <div className="row g-4">
            <div className="col-md-3">
              <small className="text-muted">Plan</small>

              <h5 className="fw-bold mt-1">{plan}</h5>
            </div>

            <div className="col-md-3">
              <small className="text-muted">Start Date</small>

              <h6 className="fw-bold mt-2">{subscription.startDate || "-"}</h6>
            </div>

            <div className="col-md-3">
              <small className="text-muted">End Date</small>

              <h6 className="fw-bold mt-2">{subscription.endDate || "-"}</h6>
            </div>

            <div className="col-md-3">
              <small className="text-muted">Limits</small>

              <h6 className="fw-bold mt-2">
                {maxTables === null || maxTables === undefined
                  ? "Unlimited"
                  : `${maxTables} Tables / ${maxCustomers} Customers`}
              </h6>
            </div>
          </div>
        </div>

        {/* =========================
            RECENT ORDERS
        ========================== */}

        <div className="sa-management-card">
          <div className="sa-section-heading">
            <h4>Recent Orders</h4>

            <p>Latest restaurant orders.</p>
          </div>

          {recentOrders.length === 0 ? (
            <div className="sa-empty py-4">
              <i className="bi bi-receipt"></i>

              <h5>No Orders Yet</h5>

              <p>Customer orders will appear here.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table sa-table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Table</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {recentOrders.map((order, index) => (
                    <tr key={order.id || index}>
                      <td>
                        <strong>#{order.id || index + 1}</strong>
                      </td>

                      <td>
                        {order.customerName ||
                          order.customer?.name ||
                          "Customer"}
                      </td>

                      <td>{order.table || "Not assigned"}</td>

                      <td>
                        ₹
                        {Number(
                          order.total || order.totalAmount || 0,
                        ).toLocaleString("en-IN")}
                      </td>

                      <td>
                        <span className="badge bg-secondary">
                          {order.status || "Pending"}
                        </span>
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

export default AdminDashboard;
