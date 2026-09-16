import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CustomerLogin() {
  const navigate = useNavigate();

  const [scanContext, setScanContext] = useState(null);
  const [restaurant, setRestaurant] = useState(null);

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD QR / RESTAURANT CONTEXT
  // =====================================================

  useEffect(() => {
    loadRestaurantContext();
  }, []);

  const loadRestaurantContext = () => {
    try {
      setPageLoading(true);
      setError("");

      const savedContext = JSON.parse(
        localStorage.getItem("restaurantScanContext") || "null",
      );

      // No QR scan
      if (
        !savedContext ||
        !savedContext.restaurantId ||
        !savedContext.tableId
      ) {
        setError("Please scan the restaurant table QR code before continuing.");

        setPageLoading(false);
        return;
      }

      const restaurants = JSON.parse(
        localStorage.getItem("quickServeRestaurants") || "[]",
      );

      // Find restaurant using QR restaurantId
      const currentRestaurant = restaurants.find(
        (item) => String(item.id) === String(savedContext.restaurantId),
      );

      if (!currentRestaurant) {
        setError(
          "Restaurant information could not be found. Please scan the table QR code again.",
        );

        setPageLoading(false);
        return;
      }

      // Check restaurant status
      if (currentRestaurant.status && currentRestaurant.status !== "Active") {
        setError("This restaurant is currently unavailable.");

        setPageLoading(false);
        return;
      }

      // Check subscription
      if (currentRestaurant.subscription?.endDate) {
        const endDate = new Date(currentRestaurant.subscription.endDate);

        if (endDate < new Date()) {
          setError("This restaurant's subscription has expired.");

          setPageLoading(false);
          return;
        }
      }

      // Save valid context
      setScanContext(savedContext);
      setRestaurant(currentRestaurant);

      // If customer already logged in for this restaurant/table,
      // preload their information.
      const savedCustomer = JSON.parse(
        localStorage.getItem("restaurantCustomer") || "null",
      );

      if (
        savedCustomer &&
        String(savedCustomer.restaurantId) === String(savedContext.restaurantId)
      ) {
        setName(savedCustomer.name || "");
        setMobile(savedCustomer.mobile || "");
      }

      setPageLoading(false);
    } catch (err) {
      console.error("Customer login context error:", err);

      setError(
        "Unable to load restaurant information. Please scan the QR code again.",
      );

      setPageLoading(false);
    }
  };

  // =====================================================
  // VALIDATE MOBILE
  // =====================================================

  const validateMobile = (value) => {
    return /^[6-9]\d{9}$/.test(value);
  };

  // =====================================================
  // LOGIN / REGISTER CUSTOMER
  // =====================================================

  const handleSubmit = (event) => {
    event.preventDefault();

    setError("");

    if (!scanContext || !restaurant) {
      setError(
        "Restaurant information is missing. Please scan the table QR code again.",
      );
      return;
    }

    const cleanName = name.trim();
    const cleanMobile = mobile.trim();

    // NAME
    if (cleanName.length < 2) {
      setError("Please enter your name.");
      return;
    }

    // MOBILE
    if (!validateMobile(cleanMobile)) {
      setError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    setLoading(true);

    try {
      const restaurantId = String(scanContext.restaurantId);

      const tableId = String(scanContext.tableId);

      // =================================================
      // LOAD RESTAURANT CUSTOMERS
      // =================================================

      const allCustomers = JSON.parse(
        localStorage.getItem("quickServeCustomers") || "{}",
      );

      if (!Array.isArray(allCustomers[restaurantId])) {
        allCustomers[restaurantId] = [];
      }

      const restaurantCustomers = allCustomers[restaurantId];

      // =================================================
      // FIND CUSTOMER BY MOBILE
      // =================================================

      const existingCustomer = restaurantCustomers.find(
        (customer) => String(customer.mobile) === String(cleanMobile),
      );

      let customer;

      // =================================================
      // EXISTING CUSTOMER
      // =================================================

      if (existingCustomer) {
        customer = {
          ...existingCustomer,
          name: cleanName,
          mobile: cleanMobile,
          restaurantId,
          lastTableId: tableId,
          lastTableName: scanContext.tableName || `Table ${tableId}`,
          lastLoginAt: new Date().toISOString(),
        };

        // Update existing customer
        allCustomers[restaurantId] = restaurantCustomers.map((item) =>
          String(item.mobile) === String(cleanMobile) ? customer : item,
        );
      }

      // =================================================
      // NEW CUSTOMER
      // =================================================
      else {
        const maxCustomers = restaurant.subscription?.maxCustomers;

        const customerLimitReached =
          maxCustomers !== null &&
          maxCustomers !== undefined &&
          restaurantCustomers.length >= Number(maxCustomers);

        if (customerLimitReached) {
          setError(
            `This restaurant has reached its ${maxCustomers}-customer limit. Please contact the restaurant.`,
          );

          setLoading(false);
          return;
        }

        customer = {
          id: `CUS-${Date.now()}`,

          restaurantId,

          name: cleanName,

          mobile: cleanMobile,

          firstTableId: tableId,

          firstTableName: scanContext.tableName || `Table ${tableId}`,

          lastTableId: tableId,

          lastTableName: scanContext.tableName || `Table ${tableId}`,

          createdAt: new Date().toISOString(),

          lastLoginAt: new Date().toISOString(),
        };

        allCustomers[restaurantId].push(customer);
      }

      // =================================================
      // SAVE CUSTOMERS
      // =================================================

      localStorage.setItem("quickServeCustomers", JSON.stringify(allCustomers));

      // =================================================
      // SAVE CUSTOMER SESSION
      // =================================================

      const customerSession = {
        id: customer.id,

        name: customer.name,

        mobile: customer.mobile,

        restaurantId,

        tableId,

        restaurantName: restaurant.name,

        tableName: scanContext.tableName || `Table ${tableId}`,

        loggedInAt: new Date().toISOString(),
      };

      localStorage.setItem(
        "restaurantCustomer",
        JSON.stringify(customerSession),
      );

      // =================================================
      // SAVE CURRENT RESTAURANT CONTEXT AGAIN
      // =================================================

      const updatedContext = {
        ...scanContext,

        restaurantId,

        tableId,

        restaurantName: restaurant.name,

        tableName: scanContext.tableName || `Table ${tableId}`,
      };

      localStorage.setItem(
        "restaurantScanContext",
        JSON.stringify(updatedContext),
      );

      // =================================================
      // CONTINUE TO ORDER
      // =================================================

      navigate("/order-status");
    } catch (err) {
      console.error("Customer login error:", err);

      setError(
        "Something went wrong while processing your information. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // GO BACK TO MENU
  // =====================================================

  const handleBackToMenu = () => {
    if (scanContext?.restaurantId && scanContext?.tableId) {
      navigate(`/menu/${scanContext.restaurantId}/${scanContext.tableId}`);
    } else {
      navigate("/");
    }
  };

  // =====================================================
  // PAGE LOADING
  // =====================================================

  if (pageLoading) {
    return (
      <div className="customer-login-page">
        <div className="customer-login-loading">
          <div className="customer-spinner"></div>

          <h3>Loading...</h3>

          <p>Verifying restaurant information.</p>
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR WITHOUT RESTAURANT
  // =====================================================

  if (!restaurant || !scanContext) {
    return (
      <div className="customer-login-page">
        <div className="customer-login-card customer-error-card">
          <div className="customer-login-logo">
            <i className="bi bi-lightning-charge-fill"></i>
          </div>

          <div className="customer-error-icon">
            <i className="bi bi-exclamation-triangle"></i>
          </div>

          <h1>Unable to Continue</h1>

          <p>{error || "Restaurant information is unavailable."}</p>

          <button
            className="customer-primary-btn"
            onClick={() => navigate("/")}
          >
            <i className="bi bi-qr-code-scan"></i>
            Scan QR Code Again
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // MAIN PAGE
  // =====================================================

  return (
    <div className="customer-login-page">
      {/* BACKGROUND DECORATION */}

      <div className="customer-bg-circle customer-bg-circle-one"></div>
      <div className="customer-bg-circle customer-bg-circle-two"></div>

      <main className="customer-login-wrapper">
        {/* BRAND */}

        <div className="customer-login-brand">
          <div className="customer-login-logo">
            <i className="bi bi-lightning-charge-fill"></i>
          </div>

          <div>
            <h2>QuickServe</h2>
            <p>Digital Restaurant Ordering</p>
          </div>
        </div>

        {/* LOGIN CARD */}

        <div className="customer-login-card">
          {/* RESTAURANT INFO */}

          <div className="customer-restaurant-box">
            <div className="customer-restaurant-icon">
              <i className="bi bi-shop"></i>
            </div>

            <div className="customer-restaurant-details">
              <span>Ordering from</span>

              <strong>{restaurant.name}</strong>

              <small>
                <i className="bi bi-table"></i>{" "}
                {scanContext.tableName || `Table ${scanContext.tableId}`}
              </small>
            </div>

            <div className="customer-verified">
              <i className="bi bi-check-circle-fill"></i>
            </div>
          </div>

          {/* TITLE */}

          <div className="customer-login-heading">
            <span className="customer-step">CUSTOMER DETAILS</span>

            <h1>Login to Continue</h1>

            <p>Enter your name and mobile number to place your order.</p>
          </div>

          {/* ERROR */}

          {error && (
            <div className="customer-login-error">
              <i className="bi bi-exclamation-circle-fill"></i>

              <span>{error}</span>
            </div>
          )}

          {/* FORM */}

          <form onSubmit={handleSubmit} className="customer-login-form">
            {/* NAME */}

            <div className="customer-form-group">
              <label htmlFor="customerName">Your Name</label>

              <div className="customer-input-wrapper">
                <i className="bi bi-person"></i>

                <input
                  id="customerName"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  disabled={loading}
                  maxLength={60}
                />
              </div>
            </div>

            {/* MOBILE */}

            <div className="customer-form-group">
              <label htmlFor="customerMobile">Mobile Number</label>

              <div className="customer-input-wrapper">
                <i className="bi bi-phone"></i>

                <span className="customer-country-code">+91</span>

                <input
                  id="customerMobile"
                  type="tel"
                  value={mobile}
                  onChange={(e) =>
                    setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
                  }
                  placeholder="10-digit mobile number"
                  autoComplete="tel"
                  inputMode="numeric"
                  disabled={loading}
                  maxLength={10}
                />
              </div>

              <small className="customer-input-help">
                Your mobile number is used to identify your customer account.
              </small>
            </div>

            {/* SUBMIT */}

            <button
              type="submit"
              className="customer-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="customer-button-spinner"></span>
                  Processing...
                </>
              ) : (
                <>
                  Continue to Order
                  <i className="bi bi-arrow-right"></i>
                </>
              )}
            </button>
          </form>

          {/* BACK */}

          <button
            type="button"
            className="customer-back-menu-btn"
            onClick={handleBackToMenu}
            disabled={loading}
          >
            <i className="bi bi-arrow-left"></i>
            Back to Menu
          </button>

          {/* FOOTER NOTE */}

          <div className="customer-login-note">
            <i className="bi bi-shield-check"></i>

            <span>
              Your details are securely associated with this restaurant.
            </span>
          </div>
        </div>

        {/* FOOTER */}

        <p className="customer-login-footer">
          Powered by <strong>QuickServe</strong>
        </p>
      </main>
    </div>
  );
}

export default CustomerLogin;
