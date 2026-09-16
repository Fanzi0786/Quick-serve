import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CustomerNavbar from "./CustomerNavbar";

function CustomerPanel() {
  const [customer, setCustomer] = useState(null);
  const [scanContext, setScanContext] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const savedCustomer = localStorage.getItem("restaurantCustomer");
    const savedContext = localStorage.getItem("restaurantScanContext");

    if (savedCustomer) {
      const customerData = JSON.parse(savedCustomer);
      setCustomer(customerData);

      if (savedContext) {
        const context = JSON.parse(savedContext);
        setScanContext(context);

        const allOrders = JSON.parse(
          localStorage.getItem("quickServeOrders") || "{}",
        );

        const restaurantOrders = allOrders[context.restaurantId] || [];

        const customerOrders = restaurantOrders.filter(
          (order) => order.customerId === customerData.id,
        );

        setOrders(customerOrders);
      }
    }
  }, []);

  const currentOrder = orders.find(
    (order) => order.status !== "Completed" && order.status !== "Cancelled",
  );

  const completedOrders = orders.filter(
    (order) => order.status === "Completed",
  );

  const totalSpent = orders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0,
  );

  return (
    <>
      <CustomerNavbar />

      <main className="customer-page">
        <div className="customer-container">
          {/* Welcome */}
          <section className="customer-welcome">
            <div>
              <span className="customer-small-title">CUSTOMER PANEL</span>

              <h1>Welcome, {customer?.name || "Customer"} 👋</h1>

              <p>Manage your orders, payments and feedback from one place.</p>
            </div>

            {scanContext && (
              <div className="restaurant-context">
                <i className="bi bi-shop"></i>

                <div>
                  <strong>{scanContext.restaurantName}</strong>
                  <span>{scanContext.tableName}</span>
                </div>
              </div>
            )}
          </section>

          {/* Stats */}
          <section className="customer-stats">
            <div className="customer-stat-card">
              <div className="stat-icon">
                <i className="bi bi-bag-check"></i>
              </div>

              <div>
                <span>Total Orders</span>
                <strong>{orders.length}</strong>
              </div>
            </div>

            <div className="customer-stat-card">
              <div className="stat-icon">
                <i className="bi bi-hourglass-split"></i>
              </div>

              <div>
                <span>Active Orders</span>
                <strong>{currentOrder ? 1 : 0}</strong>
              </div>
            </div>

            <div className="customer-stat-card">
              <div className="stat-icon">
                <i className="bi bi-check-circle"></i>
              </div>

              <div>
                <span>Completed</span>
                <strong>{completedOrders.length}</strong>
              </div>
            </div>

            <div className="customer-stat-card">
              <div className="stat-icon">
                <i className="bi bi-currency-rupee"></i>
              </div>

              <div>
                <span>Total Spent</span>
                <strong>₹{totalSpent.toFixed(2)}</strong>
              </div>
            </div>
          </section>

          {/* Current Order */}
          {currentOrder && (
            <section className="customer-section">
              <div className="section-heading">
                <div>
                  <span>ACTIVE ORDER</span>
                  <h2>Track Your Current Order</h2>
                </div>

                <Link to="/customer/orders" className="view-all-btn">
                  View Details
                </Link>
              </div>

              <div className="current-order-card">
                <div className="current-order-left">
                  <div className="order-icon">
                    <i className="bi bi-receipt-cutoff"></i>
                  </div>

                  <div>
                    <span>Order ID</span>
                    <strong>{currentOrder.id}</strong>

                    <small>{currentOrder.items?.length || 0} item(s)</small>
                  </div>
                </div>

                <div className="current-order-middle">
                  <span>Status</span>

                  <strong className="order-status">
                    {currentOrder.status}
                  </strong>
                </div>

                <div className="current-order-right">
                  <span>Total</span>
                  <strong>₹{Number(currentOrder.total || 0).toFixed(2)}</strong>

                  <Link to="/customer/orders">
                    Track Order
                    <i className="bi bi-arrow-right"></i>
                  </Link>
                </div>
              </div>
            </section>
          )}

          {/* Quick Actions */}
          <section className="customer-section">
            <div className="section-heading">
              <div>
                <span>QUICK ACTIONS</span>
                <h2>What would you like to do?</h2>
              </div>
            </div>

            <div className="customer-actions">
              <Link
                to={
                  scanContext
                    ? `/menu/${scanContext.restaurantId}/${scanContext.tableId}`
                    : "/"
                }
                className="customer-action-card"
              >
                <div className="action-icon">
                  <i className="bi bi-menu-button-wide"></i>
                </div>

                <h3>Browse Menu</h3>
                <p>View food items and place a new order.</p>

                <span>
                  Open Menu <i className="bi bi-arrow-right"></i>
                </span>
              </Link>

              <Link to="/customer/orders" className="customer-action-card">
                <div className="action-icon">
                  <i className="bi bi-receipt"></i>
                </div>

                <h3>My Orders</h3>
                <p>Track your current order and view history.</p>

                <span>
                  View Orders <i className="bi bi-arrow-right"></i>
                </span>
              </Link>

              <Link to="/customer/payment" className="customer-action-card">
                <div className="action-icon">
                  <i className="bi bi-credit-card"></i>
                </div>

                <h3>Payment</h3>
                <p>Check your payment and complete your order.</p>

                <span>
                  Make Payment <i className="bi bi-arrow-right"></i>
                </span>
              </Link>

              <Link to="/customer/feedback" className="customer-action-card">
                <div className="action-icon">
                  <i className="bi bi-star"></i>
                </div>

                <h3>Feedback</h3>
                <p>Share your experience with the restaurant.</p>

                <span>
                  Give Feedback <i className="bi bi-arrow-right"></i>
                </span>
              </Link>
            </div>
          </section>

          {/* Recent Orders */}
          <section className="customer-section">
            <div className="section-heading">
              <div>
                <span>ORDER HISTORY</span>
                <h2>Recent Orders</h2>
              </div>

              <Link to="/customer/orders" className="view-all-btn">
                View All
              </Link>
            </div>

            {orders.length === 0 ? (
              <div className="empty-orders">
                <i className="bi bi-bag-x"></i>
                <h3>No orders yet</h3>
                <p>Your order history will appear here.</p>
              </div>
            ) : (
              <div className="recent-orders">
                {orders
                  .slice(-5)
                  .reverse()
                  .map((order) => (
                    <div className="recent-order-card" key={order.id}>
                      <div>
                        <strong>{order.id}</strong>

                        <span>{order.items?.length || 0} item(s)</span>
                      </div>

                      <div>
                        <strong>₹{Number(order.total || 0).toFixed(2)}</strong>

                        <span className="history-status">{order.status}</span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}

export default CustomerPanel;
