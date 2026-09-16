import React, { useEffect, useState } from "react";
import CustomerNavbar from "./CustomerNavbar";

function Payment() {
  const [customer, setCustomer] = useState(null);
  const [context, setContext] = useState(null);
  const [order, setOrder] = useState(null);
  const [method, setMethod] = useState("UPI");
  const [paid, setPaid] = useState(false);

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
      (item) => item.customerId === customerData.id,
    );

    const activeOrder = customerOrders
      .filter(
        (item) => item.status !== "Completed" && item.status !== "Cancelled",
      )
      .pop();

    setOrder(activeOrder || null);
  }, []);

  const handlePayment = () => {
    if (!order) return;

    const allOrders = JSON.parse(
      localStorage.getItem("quickServeOrders") || "{}",
    );

    const restaurantOrders = allOrders[context.restaurantId] || [];

    const updatedOrders = restaurantOrders.map((item) => {
      if (item.id === order.id) {
        return {
          ...item,
          paymentStatus: "Paid",
          paymentMethod: method,
          paidAt: new Date().toISOString(),
        };
      }

      return item;
    });

    allOrders[context.restaurantId] = updatedOrders;

    localStorage.setItem("quickServeOrders", JSON.stringify(allOrders));

    setPaid(true);

    setOrder({
      ...order,
      paymentStatus: "Paid",
      paymentMethod: method,
    });
  };

  return (
    <>
      <CustomerNavbar />

      <main className="customer-page">
        <div className="customer-container">
          <div className="page-title-area">
            <span>PAYMENT</span>
            <h1>Make Payment</h1>
            <p>Complete your payment for the current order.</p>
          </div>

          {!order && !paid ? (
            <div className="empty-orders payment-empty">
              <i className="bi bi-credit-card"></i>

              <h3>No pending payment</h3>

              <p>You currently don't have an unpaid order.</p>
            </div>
          ) : paid ? (
            <div className="payment-success">
              <div className="payment-success-icon">
                <i className="bi bi-check-lg"></i>
              </div>

              <h2>Payment Successful</h2>

              <p>Your payment has been recorded successfully.</p>

              <div className="payment-success-details">
                <div>
                  <span>Order ID</span>
                  <strong>{order?.id}</strong>
                </div>

                <div>
                  <span>Amount</span>
                  <strong>₹{Number(order?.total || 0).toFixed(2)}</strong>
                </div>

                <div>
                  <span>Method</span>
                  <strong>{order?.paymentMethod}</strong>
                </div>
              </div>
            </div>
          ) : (
            <div className="payment-layout">
              {/* Order Summary */}
              <div className="payment-card">
                <div className="payment-card-header">
                  <span>ORDER SUMMARY</span>
                  <h2>{order.id}</h2>
                </div>

                <div className="payment-items">
                  {order.items?.map((item, index) => (
                    <div className="payment-item" key={index}>
                      <div>
                        <strong>{item.name}</strong>
                        <span>
                          {item.quantity} × ₹{item.price}
                        </span>
                      </div>

                      <strong>
                        ₹
                        {(Number(item.price) * Number(item.quantity)).toFixed(
                          2,
                        )}
                      </strong>
                    </div>
                  ))}
                </div>

                <div className="payment-total">
                  <span>Total Amount</span>

                  <strong>₹{Number(order.total || 0).toFixed(2)}</strong>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="payment-card">
                <div className="payment-card-header">
                  <span>PAYMENT METHOD</span>
                  <h2>Select Payment Method</h2>
                </div>

                <div className="payment-methods">
                  <button
                    className={`payment-method ${
                      method === "UPI" ? "selected" : ""
                    }`}
                    onClick={() => setMethod("UPI")}
                  >
                    <i className="bi bi-phone"></i>

                    <div>
                      <strong>UPI</strong>
                      <span>Google Pay, PhonePe, Paytm</span>
                    </div>

                    <i className="bi bi-check-circle"></i>
                  </button>

                  <button
                    className={`payment-method ${
                      method === "Card" ? "selected" : ""
                    }`}
                    onClick={() => setMethod("Card")}
                  >
                    <i className="bi bi-credit-card"></i>

                    <div>
                      <strong>Debit / Credit Card</strong>
                      <span>Visa, Mastercard and more</span>
                    </div>

                    <i className="bi bi-check-circle"></i>
                  </button>

                  <button
                    className={`payment-method ${
                      method === "Cash" ? "selected" : ""
                    }`}
                    onClick={() => setMethod("Cash")}
                  >
                    <i className="bi bi-cash-stack"></i>

                    <div>
                      <strong>Cash</strong>
                      <span>Pay at restaurant counter</span>
                    </div>

                    <i className="bi bi-check-circle"></i>
                  </button>
                </div>

                <button className="pay-now-btn" onClick={handlePayment}>
                  <i className="bi bi-lock-fill"></i>
                  Pay ₹{Number(order.total || 0).toFixed(2)}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default Payment;
