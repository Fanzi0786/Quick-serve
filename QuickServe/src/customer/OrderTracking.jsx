import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CustomerNavbar from "./CustomerNavbar";

function OrderTracking() {
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [context, setContext] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const savedCustomer = localStorage.getItem("restaurantCustomer");
    const savedContext = localStorage.getItem("restaurantScanContext");

    if (!savedCustomer || !savedContext) return;

    const customerData = JSON.parse(savedCustomer);
    const contextData = JSON.parse(savedContext);

    setCustomer(customerData);
    setContext(contextData);

    const allOrders = JSON.parse(
      localStorage.getItem("quickServeOrders") || "{}",
    );

    const restaurantOrders = allOrders[contextData.restaurantId] || [];

    const customerOrders = restaurantOrders.filter(
      (order) => order.customerId === customerData.id,
    );

    setOrders(customerOrders.reverse());
  }, []);

  const activeOrder = orders.find(
    (order) => order.status !== "Completed" && order.status !== "Cancelled",
  );

  const handleReorder = (order) => {
    if (!context) return;

    const reorderedItems = order.items.map((item) => ({
      ...item,
      restaurantId: context.restaurantId,
      tableId: context.tableId,
    }));

    localStorage.setItem("quickServeCart", JSON.stringify(reorderedItems));

    navigate(`/menu/${context.restaurantId}/${context.tableId}`);
  };

  const getStatusClass = (status) => {
    if (status === "Completed") return "completed";
    if (status === "Cancelled") return "cancelled";
    if (status === "Preparing") return "preparing";
    if (status === "Ready") return "ready";

    return "pending";
  };

  return (
    <>
      <CustomerNavbar />

      <main className="customer-page">
        <div className="customer-container">
          <div className="page-title-area">
            <span>ORDERS</span>
            <h1>My Orders</h1>
            <p>Track your current order and reorder your previous meals.</p>
          </div>

          {/* Active Order */}
          {activeOrder && (
            <section className="tracking-card">
              <div className="tracking-header">
                <div>
                  <span>ACTIVE ORDER</span>
                  <h2>{activeOrder.id}</h2>
                </div>

                <div
                  className={`status-badge ${getStatusClass(activeOrder.status)}`}
                >
                  {activeOrder.status}
                </div>
              </div>

              <div className="tracking-steps">
                <div
                  className={`tracking-step ${
                    ["Pending", "Preparing", "Ready", "Completed"].includes(
                      activeOrder.status,
                    )
                      ? "active"
                      : ""
                  }`}
                >
                  <div className="step-circle">
                    <i className="bi bi-receipt"></i>
                  </div>

                  <span>Order Placed</span>
                </div>

                <div
                  className={`tracking-line ${
                    ["Preparing", "Ready", "Completed"].includes(
                      activeOrder.status,
                    )
                      ? "active"
                      : ""
                  }`}
                ></div>

                <div
                  className={`tracking-step ${
                    ["Preparing", "Ready", "Completed"].includes(
                      activeOrder.status,
                    )
                      ? "active"
                      : ""
                  }`}
                >
                  <div className="step-circle">
                    <i className="bi bi-fire"></i>
                  </div>

                  <span>Preparing</span>
                </div>

                <div
                  className={`tracking-line ${
                    ["Ready", "Completed"].includes(activeOrder.status)
                      ? "active"
                      : ""
                  }`}
                ></div>

                <div
                  className={`tracking-step ${
                    ["Ready", "Completed"].includes(activeOrder.status)
                      ? "active"
                      : ""
                  }`}
                >
                  <div className="step-circle">
                    <i className="bi bi-bell"></i>
                  </div>

                  <span>Ready</span>
                </div>

                <div
                  className={`tracking-line ${
                    activeOrder.status === "Completed" ? "active" : ""
                  }`}
                ></div>

                <div
                  className={`tracking-step ${
                    activeOrder.status === "Completed" ? "active" : ""
                  }`}
                >
                  <div className="step-circle">
                    <i className="bi bi-check-lg"></i>
                  </div>

                  <span>Completed</span>
                </div>
              </div>

              <div className="tracking-order-info">
                <div>
                  <span>Restaurant</span>
                  <strong>{activeOrder.restaurantName}</strong>
                </div>

                <div>
                  <span>Table</span>
                  <strong>{activeOrder.table}</strong>
                </div>

                <div>
                  <span>Total</span>
                  <strong>₹{Number(activeOrder.total || 0).toFixed(2)}</strong>
                </div>
              </div>

              <div className="tracking-actions">
                <Link to="/customer/payment" className="primary-customer-btn">
                  <i className="bi bi-credit-card"></i>
                  Payment
                </Link>

                <Link
                  to="/customer/feedback"
                  className="secondary-customer-btn"
                >
                  <i className="bi bi-star"></i>
                  Feedback
                </Link>
              </div>
            </section>
          )}

          {/* History */}
          <section className="order-history-section">
            <div className="section-heading">
              <div>
                <span>HISTORY</span>
                <h2>Previous Orders</h2>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="empty-orders">
                <i className="bi bi-receipt"></i>
                <h3>No orders found</h3>
                <p>Place your first order from the menu.</p>
              </div>
            ) : (
              <div className="order-history-list">
                {orders.map((order) => (
                  <div className="order-history-card" key={order.id}>
                    <div className="history-main">
                      <div className="history-order-icon">
                        <i className="bi bi-bag-check"></i>
                      </div>

                      <div>
                        <strong>{order.id}</strong>

                        <span>
                          {order.items?.map((item) => item.name).join(", ")}
                        </span>

                        <small>
                          {new Date(order.createdAt).toLocaleString()}
                        </small>
                      </div>
                    </div>

                    <div className="history-price">
                      <strong>₹{Number(order.total || 0).toFixed(2)}</strong>

                      <span
                        className={`status-badge ${getStatusClass(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <button
                      className="reorder-btn"
                      onClick={() => handleReorder(order)}
                    >
                      <i className="bi bi-arrow-repeat"></i>
                      Reorder
                    </button>
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

export default OrderTracking;
