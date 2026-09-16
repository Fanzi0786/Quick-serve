import { useState } from "react";

import { useNavigate } from "react-router-dom";

function Feedback() {
  const navigate = useNavigate();

  const customer = JSON.parse(
    localStorage.getItem("restaurantCustomer") || "null",
  );

  const scanContext = JSON.parse(
    localStorage.getItem("restaurantScanContext") || "null",
  );

  const [rating, setRating] = useState(5);

  const [message, setMessage] = useState("");

  if (!customer || !scanContext) {
    return (
      <div className="container py-5 text-center">
        <h3>Please scan a restaurant QR code first.</h3>

        <button className="btn btn-dark mt-3" onClick={() => navigate("/")}>
          Go Home
        </button>
      </div>
    );
  }

  const submitFeedback = () => {
    if (!message.trim()) {
      alert("Please enter your feedback.");

      return;
    }

    const allFeedback = JSON.parse(
      localStorage.getItem("quickServeFeedback") || "{}",
    );

    if (!allFeedback[scanContext.restaurantId]) {
      allFeedback[scanContext.restaurantId] = [];
    }

    const feedback = {
      id: `feedback_${Date.now()}`,

      restaurantId: scanContext.restaurantId,

      restaurantName: scanContext.restaurantName,

      tableId: scanContext.tableId,

      table: scanContext.tableName,

      customerId: customer.id,

      customerName: customer.name,

      rating,

      message: message.trim(),

      createdAt: new Date().toISOString(),
    };

    allFeedback[scanContext.restaurantId].push(feedback);

    localStorage.setItem("quickServeFeedback", JSON.stringify(allFeedback));

    alert("Thank you for your feedback!");

    setMessage("");

    navigate(`/menu/${scanContext.restaurantId}/${scanContext.tableId}`);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f8f4",
      }}
    >
      <div className="container py-5">
        <div
          className="card border-0 shadow mx-auto"
          style={{
            maxWidth: "550px",
          }}
        >
          <div className="card-body p-4 p-md-5">
            <div className="text-center mb-4">
              <i
                className="bi bi-chat-square-heart"
                style={{
                  fontSize: "50px",
                }}
              ></i>

              <h3 className="fw-bold mt-3">Give Feedback</h3>

              <p className="text-muted">
                {scanContext.restaurantName}
                {" • "}
                {scanContext.tableName}
              </p>
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">Rating</label>

              <select
                className="form-select"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              >
                <option value="5">⭐⭐⭐⭐⭐ Excellent</option>

                <option value="4">⭐⭐⭐⭐ Very Good</option>

                <option value="3">⭐⭐⭐ Good</option>

                <option value="2">⭐⭐ Average</option>

                <option value="1">⭐ Poor</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">Your Feedback</label>

              <textarea
                className="form-control"
                rows="5"
                placeholder="Write your feedback..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </div>

            <button
              className="btn btn-dark w-100 py-3"
              onClick={submitFeedback}
            >
              Submit Feedback
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Feedback;
