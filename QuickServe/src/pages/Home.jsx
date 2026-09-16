import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      {/* ================= NAVBAR ================= */}

      <nav className="navbar navbar-expand-lg navbar-dark restaurant-navbar">
        <div className="container">
          {/* Logo */}
          <button
            className="navbar-brand fw-bold fs-4 border-0 bg-transparent text-white"
            onClick={() => navigate("/")}
          >
            <i className="bi bi-shop me-2"></i>
            QuickServe
          </button>

          {/* Mobile Toggle */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#quickServeNavbar"
            aria-controls="quickServeNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navbar Content */}
          <div className="collapse navbar-collapse" id="quickServeNavbar">
            {/* Navigation Links */}
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <button
                  className="nav-link active bg-transparent border-0"
                  onClick={() => navigate("/")}
                >
                  Home
                </button>
              </li>

              <li className="nav-item">
                <button
                  className="nav-link bg-transparent border-0"
                  onClick={() => navigate("/scan")}
                >
                  <i className="bi bi-qr-code-scan me-1"></i>
                  Order Food
                </button>
              </li>

              <li className="nav-item">
                <button
                  className="nav-link bg-transparent border-0"
                  onClick={() => navigate("/employee/login")}
                >
                  <i className="bi bi-person-badge me-1"></i>
                  Employee
                </button>
              </li>

              <li className="nav-item">
                <button
                  className="nav-link bg-transparent border-0"
                  onClick={() => navigate("/admin")}
                >
                  <i className="bi bi-shield-lock me-1"></i>
                  Admin
                </button>
              </li>
            </ul>

            {/* Login Buttons */}
            <div className="navbar-actions">
              <button
                className="btn btn-outline-light"
                onClick={() => navigate("/employee/login")}
              >
                <i className="bi bi-person-badge me-2"></i>
                Employee Login
              </button>

              <button
                className="btn btn-light"
                onClick={() => navigate("/admin")}
              >
                <i className="bi bi-shield-lock me-2"></i>
                Admin Login
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ================= HERO ================= */}

      <section className="home-hero">
        <div className="container">
          <div className="row align-items-center g-5">
            {/* LEFT CONTENT */}

            <div className="col-lg-7">
              <span className="home-badge">
                <i className="bi bi-stars me-2"></i>
                Digital Restaurant Ordering
              </span>

              <h1>
                Order Your Favourite Food
                <span> Easily & Quickly</span>
              </h1>

              <p className="home-hero-text">
                Scan the QR code on your table, enter your name and mobile
                number, explore the digital menu and place your order without
                waiting.
              </p>

              {/* Customer Action */}

              <div className="home-hero-buttons">
                <button
                  className="btn btn-dark home-primary-btn"
                  onClick={() => navigate("/scan")}
                >
                  <i className="bi bi-qr-code-scan me-2"></i>
                  Scan Table QR
                </button>

                <button
                  className="btn btn-outline-dark home-secondary-btn"
                  onClick={() => navigate("/employee/login")}
                >
                  <i className="bi bi-person-badge me-2"></i>
                  Employee Login
                </button>
              </div>

              {/* Security Note */}

              <div className="home-security-note">
                <i className="bi bi-shield-check"></i>

                <span>
                  Customers can access the menu only after scanning the table QR
                  and logging in.
                </span>
              </div>
            </div>

            {/* RIGHT CARD */}

            <div className="col-lg-5">
              <div className="home-hero-card">
                <div className="hero-main-icon">
                  <i className="bi bi-qr-code-scan"></i>
                </div>

                <h3>Smart Table Ordering</h3>

                <p>
                  A simple digital ordering experience for customers and
                  restaurant staff.
                </p>

                <div className="hero-mini-stats">
                  <div>
                    <i className="bi bi-qr-code"></i>
                    <span>Scan QR</span>
                  </div>

                  <div>
                    <i className="bi bi-menu-button-wide"></i>
                    <span>View Menu</span>
                  </div>

                  <div>
                    <i className="bi bi-bag-check"></i>
                    <span>Place Order</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}

      <section className="home-workflow">
        <div className="container">
          <div className="home-section-heading">
            <span>For Customers</span>

            <h2>How QuickServe Works</h2>

            <p>Ordering food is simple, fast and completely digital.</p>
          </div>

          <div className="row g-4">
            {/* STEP 1 */}

            <div className="col-md-6 col-lg-3">
              <div className="workflow-card">
                <div className="workflow-number">01</div>

                <i className="bi bi-qr-code-scan"></i>

                <h5>Scan QR</h5>

                <p>Scan the QR code available on your restaurant table.</p>
              </div>
            </div>

            {/* STEP 2 */}

            <div className="col-md-6 col-lg-3">
              <div className="workflow-card">
                <div className="workflow-number">02</div>

                <i className="bi bi-person-check"></i>

                <h5>Customer Login</h5>

                <p>
                  Enter your name and mobile number before accessing the menu.
                </p>
              </div>
            </div>

            {/* STEP 3 */}

            <div className="col-md-6 col-lg-3">
              <div className="workflow-card">
                <div className="workflow-number">03</div>

                <i className="bi bi-menu-button-wide"></i>

                <h5>Select Food</h5>

                <p>
                  Browse dishes, view prices and add your favourite food to the
                  cart.
                </p>
              </div>
            </div>

            {/* STEP 4 */}

            <div className="col-md-6 col-lg-3">
              <div className="workflow-card">
                <div className="workflow-number">04</div>

                <i className="bi bi-clock-history"></i>

                <h5>Track Order</h5>

                <p>
                  Track your order from Pending to Preparing, Ready and
                  Completed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ROLE BASED ACCESS ================= */}

      <section className="home-features">
        <div className="container">
          <div className="home-section-heading">
            <span>Role Based Access</span>

            <h2>One System, Different Roles</h2>

            <p>Each user gets access according to their role.</p>
          </div>

          <div className="row g-4">
            {/* CUSTOMER */}

            <div className="col-md-4">
              <div className="home-feature-card">
                <div className="feature-icon">
                  <i className="bi bi-person"></i>
                </div>

                <h4>Customer</h4>

                <p>
                  Scan the table QR, login with your name and mobile number,
                  view the menu, place orders and track order status.
                </p>

                <span>QR Based Access</span>
              </div>
            </div>

            {/* EMPLOYEE */}

            <div className="col-md-4">
              <div className="home-feature-card">
                <div className="feature-icon">
                  <i className="bi bi-person-badge"></i>
                </div>

                <h4>Employee</h4>

                <p>
                  Employees can login with their assigned account and perform
                  tasks according to their assigned role.
                </p>

                <span>Role Based Access</span>
              </div>
            </div>

            {/* ADMIN */}

            <div className="col-md-4">
              <div className="home-feature-card">
                <div className="feature-icon">
                  <i className="bi bi-shield-lock"></i>
                </div>

                <h4>Admin</h4>

                <p>
                  Admin can manage orders, menu items, employees and customer
                  feedback.
                </p>

                <span>Management Access</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ACCESS SECTION ================= */}

      <section className="home-access">
        <div className="container">
          <div className="home-access-card">
            <div className="home-access-content">
              <span>Secure Access</span>

              <h2>Different Roles, Different Access</h2>

              <p>
                QuickServe keeps customer, employee and administrator access
                separate.
              </p>
            </div>

            <div className="home-access-actions">
              <button
                className="btn btn-light"
                onClick={() => navigate("/scan")}
              >
                <i className="bi bi-qr-code-scan me-2"></i>
                Customer
              </button>

              <button
                className="btn btn-outline-light"
                onClick={() => navigate("/employee/login")}
              >
                <i className="bi bi-person-badge me-2"></i>
                Employee
              </button>

              <button
                className="btn btn-outline-light"
                onClick={() => navigate("/admin")}
              >
                <i className="bi bi-shield-lock me-2"></i>
                Admin
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}

      <footer className="home-footer">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <strong>
                <i className="bi bi-shop me-2"></i>
                QuickServe
              </strong>

              <p>Digital Restaurant Ordering System</p>
            </div>

            <div className="footer-links">
              <button onClick={() => navigate("/employee/login")}>
                Employee Login
              </button>

              <button onClick={() => navigate("/admin")}>Admin Login</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
