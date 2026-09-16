import React from "react";
import { Link, useNavigate } from "react-router-dom";

function SuperAdminDashboard() {
  const navigate = useNavigate();

  const restaurants = JSON.parse(
    localStorage.getItem("quickServeRestaurants") || "[]",
  );

  const subscriptions = JSON.parse(
    localStorage.getItem("quickServeSubscriptions") || "[]",
  );

  const totalRestaurants = restaurants.length;

  const activeRestaurants = restaurants.filter(
    (r) => !r.status || r.status.toLowerCase() === "active",
  ).length;

  const inactiveRestaurants = totalRestaurants - activeRestaurants;

  const totalSubscriptions = subscriptions.length;

  const handleLogout = () => {
    localStorage.removeItem("quickServeSuperAdminLoggedIn");

    localStorage.removeItem("quickServeSuperAdmin");

    navigate("/superadmin", {
      replace: true,
    });
  };

  return (
    <div className="sa-layout">
      {/* SIDEBAR */}

      <aside className="sa-sidebar">
        <div className="sa-logo">
          <div className="sa-logo-icon">Q</div>

          <div>
            <h2>QuickServe</h2>
            <span>Super Admin</span>
          </div>
        </div>

        <nav className="sa-nav">
          <p className="sa-nav-title">MAIN MENU</p>

          <Link to="/superadmin/dashboard" className="sa-nav-link active">
            <i className="bi bi-grid-1x2-fill"></i>
            <span>Dashboard</span>
          </Link>

          <Link to="/superadmin/restaurants" className="sa-nav-link">
            <i className="bi bi-shop"></i>
            <span>Restaurants</span>
          </Link>

          <Link to="/superadmin/subscriptions" className="sa-nav-link">
            <i className="bi bi-credit-card"></i>
            <span>Subscriptions</span>
          </Link>

          <Link to="/superadmin/analytics" className="sa-nav-link">
            <i className="bi bi-bar-chart-fill"></i>
            <span>Analytics</span>
          </Link>
        </nav>

        <div className="sa-sidebar-bottom">
          <div className="sa-admin-user">
            <div className="sa-user-icon">
              <i className="bi bi-person-fill"></i>
            </div>

            <div>
              <strong>Super Admin</strong>
              <span>Platform Owner</span>
            </div>
          </div>

          <button className="sa-logout" onClick={handleLogout}>
            <i className="bi bi-box-arrow-left"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN */}

      <main className="sa-main">
        {/* TOPBAR */}

        <header className="sa-topbar">
          <div>
            <h1>Dashboard</h1>

            <p>Manage and monitor your QuickServe platform</p>
          </div>

          <div className="sa-topbar-right">
            <button className="sa-notification">
              <i className="bi bi-bell"></i>
            </button>

            <div className="sa-top-user">
              <div className="sa-top-avatar">SA</div>

              <div>
                <strong>Super Admin</strong>
                <span>Administrator</span>
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT */}

        <section className="sa-content">
          {/* WELCOME */}

          <div className="sa-welcome">
            <div>
              <h2>Welcome back, Super Admin 👋</h2>

              <p>Here's what's happening across your QuickServe platform.</p>
            </div>

            <Link to="/superadmin/restaurants" className="sa-primary-btn">
              <i className="bi bi-plus-lg"></i>
              Add Restaurant
            </Link>
          </div>

          {/* STATISTICS */}

          <div className="sa-stats">
            <div className="sa-stat-card">
              <div className="sa-stat-icon green">
                <i className="bi bi-shop"></i>
              </div>

              <div className="sa-stat-info">
                <span>Total Restaurants</span>
                <h3>{totalRestaurants}</h3>
                <small>Registered restaurants</small>
              </div>
            </div>

            <div className="sa-stat-card">
              <div className="sa-stat-icon blue">
                <i className="bi bi-check-circle"></i>
              </div>

              <div className="sa-stat-info">
                <span>Active Restaurants</span>
                <h3>{activeRestaurants}</h3>
                <small>Currently active</small>
              </div>
            </div>

            <div className="sa-stat-card">
              <div className="sa-stat-icon orange">
                <i className="bi bi-pause-circle"></i>
              </div>

              <div className="sa-stat-info">
                <span>Inactive</span>
                <h3>{inactiveRestaurants}</h3>
                <small>Inactive restaurants</small>
              </div>
            </div>

            <div className="sa-stat-card">
              <div className="sa-stat-icon purple">
                <i className="bi bi-credit-card"></i>
              </div>

              <div className="sa-stat-info">
                <span>Subscriptions</span>
                <h3>{totalSubscriptions}</h3>
                <small>Total subscriptions</small>
              </div>
            </div>
          </div>

          {/* TWO COLUMN */}

          <div className="sa-grid">
            {/* RESTAURANTS */}

            <div className="sa-card">
              <div className="sa-card-header">
                <div>
                  <h3>Recent Restaurants</h3>
                  <p>Latest restaurants added to QuickServe</p>
                </div>

                <Link to="/superadmin/restaurants">View All</Link>
              </div>

              {restaurants.length === 0 ? (
                <div className="sa-empty">
                  <div className="sa-empty-icon">
                    <i className="bi bi-shop"></i>
                  </div>

                  <h4>No Restaurants Yet</h4>

                  <p>Add your first restaurant to get started.</p>

                  <Link to="/superadmin/restaurants" className="sa-primary-btn">
                    Add Restaurant
                  </Link>
                </div>
              ) : (
                <div className="sa-restaurant-list">
                  {restaurants
                    .slice(-5)
                    .reverse()
                    .map((restaurant) => (
                      <div className="sa-restaurant-row" key={restaurant.id}>
                        <div className="sa-restaurant-logo">
                          <i className="bi bi-shop"></i>
                        </div>

                        <div className="sa-restaurant-info">
                          <strong>{restaurant.name}</strong>

                          <span>
                            {restaurant.email || "No email available"}
                          </span>
                        </div>

                        <span
                          className={`sa-status ${
                            restaurant.status &&
                            restaurant.status.toLowerCase() === "inactive"
                              ? "inactive"
                              : "active"
                          }`}
                        >
                          {restaurant.status || "Active"}
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* QUICK ACTIONS */}

            <div className="sa-card">
              <div className="sa-card-header">
                <div>
                  <h3>Quick Actions</h3>

                  <p>Manage your platform</p>
                </div>
              </div>

              <div className="sa-actions">
                <Link to="/superadmin/restaurants" className="sa-action">
                  <div className="sa-action-icon">
                    <i className="bi bi-shop"></i>
                  </div>

                  <div>
                    <strong>Manage Restaurants</strong>

                    <span>Add, edit or deactivate</span>
                  </div>

                  <i className="bi bi-chevron-right"></i>
                </Link>

                <Link to="/superadmin/subscriptions" className="sa-action">
                  <div className="sa-action-icon">
                    <i className="bi bi-credit-card"></i>
                  </div>

                  <div>
                    <strong>Subscriptions</strong>

                    <span>Manage plans and expiry</span>
                  </div>

                  <i className="bi bi-chevron-right"></i>
                </Link>

                <Link to="/superadmin/analytics" className="sa-action">
                  <div className="sa-action-icon">
                    <i className="bi bi-bar-chart"></i>
                  </div>

                  <div>
                    <strong>Restaurant Analytics</strong>

                    <span>View restaurant performance</span>
                  </div>

                  <i className="bi bi-chevron-right"></i>
                </Link>
              </div>
            </div>
          </div>

          {/* PLATFORM OVERVIEW */}

          <div className="sa-card sa-overview">
            <div className="sa-card-header">
              <div>
                <h3>Platform Overview</h3>

                <p>QuickServe platform management</p>
              </div>
            </div>

            <div className="sa-overview-grid">
              <div className="sa-overview-item">
                <i className="bi bi-shop"></i>
                <div>
                  <strong>Restaurants</strong>
                  <span>Manage restaurant accounts</span>
                </div>
              </div>

              <div className="sa-overview-item">
                <i className="bi bi-calendar-check"></i>
                <div>
                  <strong>Subscriptions</strong>
                  <span>Control plans and validity</span>
                </div>
              </div>

              <div className="sa-overview-item">
                <i className="bi bi-graph-up-arrow"></i>
                <div>
                  <strong>Analytics</strong>
                  <span>Monitor restaurant usage</span>
                </div>
              </div>

              <div className="sa-overview-item">
                <i className="bi bi-shield-check"></i>
                <div>
                  <strong>Platform Control</strong>
                  <span>Full QuickServe administration</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default SuperAdminDashboard;
