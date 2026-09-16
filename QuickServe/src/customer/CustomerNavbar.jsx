import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function CustomerNavbar() {
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [scanContext, setScanContext] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const loadData = () => {
      const savedCustomer = localStorage.getItem("restaurantCustomer");
      const savedContext = localStorage.getItem("restaurantScanContext");

      setCustomer(savedCustomer ? JSON.parse(savedCustomer) : null);
      setScanContext(savedContext ? JSON.parse(savedContext) : null);
    };

    loadData();

    window.addEventListener("storage", loadData);

    return () => {
      window.removeEventListener("storage", loadData);
    };
  }, []);

  const menuPath =
    scanContext?.restaurantId && scanContext?.tableId
      ? `/menu/${scanContext.restaurantId}/${scanContext.tableId}`
      : "/";

  const handleLogout = () => {
    localStorage.removeItem("restaurantCustomer");
    localStorage.removeItem("restaurantScanContext");
    localStorage.removeItem("quickServeCart");
    localStorage.removeItem("quickServeCurrentOrder");

    navigate("/");
  };

  return (
    <nav className="customer-navbar">
      <div className="customer-nav-container">
        {/* Logo */}
        <Link to="/customer" className="customer-logo">
          <span className="customer-logo-icon">Q</span>
          <span>QuickServe</span>
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="customer-menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <i className={`bi ${menuOpen ? "bi-x-lg" : "bi-list"}`}></i>
        </button>

        {/* Navigation Links */}
        <div className={`customer-nav-links ${menuOpen ? "active" : ""}`}>
          <Link to="/customer" onClick={() => setMenuOpen(false)}>
            <i className="bi bi-house"></i>
            Home
          </Link>

          <Link to={menuPath} onClick={() => setMenuOpen(false)}>
            <i className="bi bi-grid"></i>
            Menu
          </Link>

          <Link to="/cart" onClick={() => setMenuOpen(false)}>
            <i className="bi bi-cart3"></i>
            Cart
          </Link>

          <Link to="/customer/orders" onClick={() => setMenuOpen(false)}>
            <i className="bi bi-receipt"></i>
            My Orders
          </Link>

          <Link to="/customer/payment" onClick={() => setMenuOpen(false)}>
            <i className="bi bi-credit-card"></i>
            Payment
          </Link>

          <Link to="/customer/feedback" onClick={() => setMenuOpen(false)}>
            <i className="bi bi-star"></i>
            Feedback
          </Link>

          {/* Customer Profile */}
          {customer && (
            <div className="customer-profile">
              <div className="customer-avatar">
                {customer.name?.charAt(0).toUpperCase()}
              </div>

              <div className="customer-info">
                <span>Hello</span>
                <strong>{customer.name}</strong>
              </div>
            </div>
          )}

          {/* Logout */}
          <button className="customer-logout" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right"></i>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default CustomerNavbar;
