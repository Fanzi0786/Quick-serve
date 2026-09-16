import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function OrderStatus() {
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();

    // Admin/customer status update ke baad automatically refresh
    const interval = setInterval(loadOrder, 2000);

    return () => clearInterval(interval);
  }, []);

  const loadOrder = () => {
    try {
      const currentOrder = JSON.parse(
        localStorage.getItem("quickServeCurrentOrder") || "null",
      );

      if (!currentOrder) {
        setOrder(null);
        setLoading(false);
        return;
      }

      setOrder(currentOrder);

      const restaurants = JSON.parse(
        localStorage.getItem("quickServeRestaurants") || "[]",
      );

      const currentRestaurant = restaurants.find(
        (item) => String(item.id) === String(currentOrder.restaurantId),
      );

      setRestaurant(currentRestaurant || null);
    } catch (error) {
      console.error("Order loading error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Preparing":
        return "preparing";

      case "Ready":
        return "ready";

      case "Completed":
        return "completed";

      case "Cancelled":
        return "cancelled";

      default:
        return "pending";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Preparing":
        return "bi bi-fire";

      case "Ready":
        return "bi bi-check-circle";

      case "Completed":
        return "bi bi-check2-all";

      case "Cancelled":
        return "bi bi-x-circle";

      default:
        return "bi bi-clock";
    }
  };

  const steps = ["Pending", "Preparing", "Ready", "Completed"];

  const currentStatus = order?.status || "Pending";

  const currentIndex = steps.indexOf(currentStatus);

  if (loading) {
    return (
      <div className="order-status-page">
        <div className="order-loading">
          <div className="spinner-border"></div>
          <p>Loading your order...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-status-page">
        <div className="order-empty-card">
          <div className="order-empty-icon">
            <i className="bi bi-receipt"></i>
          </div>

          <h2>No Active Order</h2>

          <p>You don't have an active order at the moment.</p>

          <button className="order-primary-btn" onClick={() => navigate("/")}>
            <i className="bi bi-qr-code-scan"></i>
            Scan Table QR
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-status-page">
      {/* HEADER */}
      <div className="order-status-header">
        <button className="order-back-btn" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left"></i>
        </button>

        <div>
          <h1>Order Status</h1>

          <p>{restaurant?.name || "Restaurant"}</p>
        </div>
      </div>

      <main className="order-status-container">
        {/* ORDER HEADER */}
        <div className="order-main-card">
          <div className="order-card-top">
            <div>
              <span className="order-label">Order ID</span>

              <h2>#{order.id || "ORDER"}</h2>
            </div>

            <div
              className={`order-status-badge ${getStatusClass(currentStatus)}`}
            >
              <i className={getStatusIcon(currentStatus)}></i>

              {currentStatus}
            </div>
          </div>

          <div className="order-info-grid">
            <div>
              <span>
                <i className="bi bi-person"></i>
                Customer
              </span>

              <strong>{order.customerName || "Customer"}</strong>
            </div>

            <div>
              <span>
                <i className="bi bi-table"></i>
                Table
              </span>

              <strong>
                {order.tableName ||
                  order.table ||
                  `Table ${order.tableId || "-"}`}
              </strong>
            </div>

            <div>
              <span>
                <i className="bi bi-clock"></i>
                Order Time
              </span>

              <strong>
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleString("en-IN")
                  : "-"}
              </strong>
            </div>

            <div>
              <span>
                <i className="bi bi-currency-rupee"></i>
                Total
              </span>

              <strong>
                ₹
                {Number(order.total || order.totalAmount || 0).toLocaleString(
                  "en-IN",
                )}
              </strong>
            </div>
          </div>
        </div>

        {/* CANCELLED */}
        {currentStatus === "Cancelled" ? (
          <div className="order-cancelled-card">
            <i className="bi bi-x-circle-fill"></i>

            <div>
              <h3>Order Cancelled</h3>

              <p>This order has been cancelled by the restaurant.</p>
            </div>
          </div>
        ) : (
          /* TRACKING */
          <div className="order-main-card">
            <h3 className="order-section-title">Track Your Order</h3>

            <div className="order-timeline">
              {steps.map((step, index) => {
                const completed = currentIndex >= index;

                const active = currentStatus === step;

                return (
                  <div
                    className={`timeline-step ${
                      completed ? "completed-step" : ""
                    } ${active ? "active-step" : ""}`}
                    key={step}
                  >
                    <div className="timeline-icon">
                      {completed ? (
                        <i className="bi bi-check"></i>
                      ) : (
                        <i className="bi bi-circle"></i>
                      )}
                    </div>

                    <div>
                      <strong>{step}</strong>

                      <small>
                        {step === "Pending" && "Order received"}

                        {step === "Preparing" && "Your food is being prepared"}

                        {step === "Ready" && "Your order is ready"}

                        {step === "Completed" && "Order completed"}
                      </small>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ITEMS */}
        <div className="order-main-card">
          <h3 className="order-section-title">Order Items</h3>

          <div className="order-items-list">
            {(order.items || []).map((item, index) => (
              <div className="order-item-row" key={item.id || index}>
                <div className="order-item-left">
                  {item.image ? (
                    <img src={item.image} alt={item.name} />
                  ) : (
                    <div className="order-item-placeholder">
                      <i className="bi bi-egg-fried"></i>
                    </div>
                  )}

                  <div>
                    <strong>{item.name}</strong>

                    <span>
                      ₹{Number(item.price || 0).toFixed(2)} ×{" "}
                      {item.quantity || 1}
                    </span>
                  </div>
                </div>

                <strong>
                  ₹
                  {(
                    Number(item.price || 0) * Number(item.quantity || 1)
                  ).toFixed(2)}
                </strong>
              </div>
            ))}
          </div>

          <div className="order-total-row">
            <span>Total Amount</span>

            <strong>
              ₹
              {Number(order.total || order.totalAmount || 0).toLocaleString(
                "en-IN",
              )}
            </strong>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="order-actions">
          <button className="order-secondary-btn" onClick={() => navigate("/")}>
            <i className="bi bi-house"></i>
            Back to Home
          </button>

          <button
            className="order-primary-btn"
            onClick={() => navigate("/customer")}
          >
            <i className="bi bi-person-circle"></i>
            Customer Panel
          </button>
        </div>
      </main>
    </div>
  );
}

export default OrderStatus;
