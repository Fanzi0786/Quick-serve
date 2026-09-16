import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function OrderManagement() {
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    loadOrders();

    const interval = setInterval(loadOrders, 2000);

    return () => clearInterval(interval);
  }, []);

  const loadOrders = () => {
    try {
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
        (item) => String(item.id) === String(adminSession.restaurantId),
      );

      if (!currentRestaurant) {
        navigate("/admin");
        return;
      }

      setRestaurant(currentRestaurant);

      const allOrders = JSON.parse(
        localStorage.getItem("quickServeOrders") || "{}",
      );

      const restaurantOrders = allOrders[adminSession.restaurantId] || [];

      setOrders(restaurantOrders);
    } catch (error) {
      console.error(error);
    }
  };

  const updateOrderStatus = (orderId, newStatus) => {
    try {
      const adminSession = JSON.parse(
        localStorage.getItem("restaurantAdminSession") || "null",
      );

      if (!adminSession) return;

      const allOrders = JSON.parse(
        localStorage.getItem("quickServeOrders") || "{}",
      );

      const restaurantOrders = allOrders[adminSession.restaurantId] || [];

      const updatedOrders = restaurantOrders.map((order) =>
        String(order.id) === String(orderId)
          ? {
              ...order,
              status: newStatus,
              updatedAt: new Date().toISOString(),
            }
          : order,
      );

      allOrders[adminSession.restaurantId] = updatedOrders;

      localStorage.setItem("quickServeOrders", JSON.stringify(allOrders));

      // Current customer order bhi update karo
      const currentOrder = JSON.parse(
        localStorage.getItem("quickServeCurrentOrder") || "null",
      );

      if (currentOrder && String(currentOrder.id) === String(orderId)) {
        const updatedCurrentOrder = {
          ...currentOrder,
          status: newStatus,
          updatedAt: new Date().toISOString(),
        };

        localStorage.setItem(
          "quickServeCurrentOrder",
          JSON.stringify(updatedCurrentOrder),
        );
      }

      setOrders(updatedOrders);
    } catch (error) {
      console.error("Status update error:", error);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Preparing":
        return "order-admin-preparing";

      case "Ready":
        return "order-admin-ready";

      case "Completed":
        return "order-admin-completed";

      case "Cancelled":
        return "order-admin-cancelled";

      default:
        return "order-admin-pending";
    }
  };

  const filteredOrders =
    filter === "All"
      ? orders
      : orders.filter((order) => (order.status || "Pending") === filter);

  const pendingCount = orders.filter(
    (order) => (order.status || "Pending") === "Pending",
  ).length;

  const preparingCount = orders.filter(
    (order) => order.status === "Preparing",
  ).length;

  const readyCount = orders.filter((order) => order.status === "Ready").length;

  const completedCount = orders.filter(
    (order) => order.status === "Completed",
  ).length;

  return (
    <div className="admin-orders-page">
      {/* NAVBAR */}

      <nav className="sa-navbar">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <div className="text-white">
              <div className="fw-bold fs-5">
                <i className="bi bi-lightning-charge-fill me-2"></i>
                QuickServe
              </div>

              <small className="text-white-50">Order Management</small>
            </div>

            <div className="d-flex align-items-center gap-3">
              <div className="text-white text-end d-none d-md-block">
                <strong>{restaurant?.name || "Restaurant"}</strong>

                <small className="d-block text-white-50">
                  {session?.adminUsername || ""}
                </small>
              </div>

              <button
                className="btn btn-outline-light"
                onClick={() => navigate("/admin")}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container py-5">
        {/* HEADER */}

        <div className="admin-orders-heading">
          <div>
            <h1>Order Management</h1>

            <p>Manage and update customer orders for your restaurant.</p>
          </div>

          <div className="order-live-badge">
            <span></span>
            Live Orders
          </div>
        </div>

        {/* STATS */}

        <div className="row g-3 mb-4">
          <div className="col-md-6 col-xl-3">
            <div className="order-admin-stat">
              <span className="stat-icon">
                <i className="bi bi-clock"></i>
              </span>

              <div>
                <small>Pending</small>
                <h3>{pendingCount}</h3>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-xl-3">
            <div className="order-admin-stat">
              <span className="stat-icon">
                <i className="bi bi-fire"></i>
              </span>

              <div>
                <small>Preparing</small>
                <h3>{preparingCount}</h3>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-xl-3">
            <div className="order-admin-stat">
              <span className="stat-icon">
                <i className="bi bi-check-circle"></i>
              </span>

              <div>
                <small>Ready</small>
                <h3>{readyCount}</h3>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-xl-3">
            <div className="order-admin-stat">
              <span className="stat-icon">
                <i className="bi bi-check2-all"></i>
              </span>

              <div>
                <small>Completed</small>
                <h3>{completedCount}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* FILTER */}

        <div className="order-filter-card">
          <div className="order-filter-title">
            <h4>Orders</h4>

            <span>{filteredOrders.length} orders</span>
          </div>

          <div className="order-filter-buttons">
            {[
              "All",
              "Pending",
              "Preparing",
              "Ready",
              "Completed",
              "Cancelled",
            ].map((status) => (
              <button
                key={status}
                className={filter === status ? "active" : ""}
                onClick={() => setFilter(status)}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* ORDERS */}

        {filteredOrders.length === 0 ? (
          <div className="order-admin-empty">
            <div>
              <i className="bi bi-receipt"></i>
            </div>

            <h3>No Orders Found</h3>

            <p>Customer orders will appear here when they place an order.</p>
          </div>
        ) : (
          <div className="admin-order-list">
            {[...filteredOrders].reverse().map((order, index) => {
              const status = order.status || "Pending";

              const items = order.items || [];

              return (
                <div className="admin-order-card" key={order.id || index}>
                  {/* TOP */}

                  <div className="admin-order-top">
                    <div>
                      <span className="admin-order-label">Order</span>

                      <h3>#{order.id || index + 1}</h3>
                    </div>

                    <span
                      className={`admin-order-status ${getStatusClass(status)}`}
                    >
                      {status}
                    </span>
                  </div>

                  {/* INFO */}

                  <div className="admin-order-info">
                    <div>
                      <span>
                        <i className="bi bi-person"></i>
                        Customer
                      </span>

                      <strong>{order.customerName || "Customer"}</strong>

                      {order.customerMobile && (
                        <small>{order.customerMobile}</small>
                      )}
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
                        Time
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
                        {Number(
                          order.total || order.totalAmount || 0,
                        ).toLocaleString("en-IN")}
                      </strong>
                    </div>
                  </div>

                  {/* ITEMS */}

                  <div className="admin-order-items">
                    <h4>Items</h4>

                    {items.map((item, itemIndex) => (
                      <div
                        className="admin-order-item"
                        key={item.id || itemIndex}
                      >
                        <span>{item.name}</span>

                        <span>× {item.quantity || 1}</span>

                        <strong>
                          ₹
                          {(
                            Number(item.price || 0) * Number(item.quantity || 1)
                          ).toFixed(2)}
                        </strong>
                      </div>
                    ))}
                  </div>

                  {/* ACTION */}

                  <div className="admin-order-actions">
                    <label>Update Order Status</label>

                    <select
                      value={status}
                      onChange={(e) =>
                        updateOrderStatus(order.id, e.target.value)
                      }
                    >
                      <option value="Pending">Pending</option>

                      <option value="Preparing">Preparing</option>

                      <option value="Ready">Ready</option>

                      <option value="Completed">Completed</option>

                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default OrderManagement;
