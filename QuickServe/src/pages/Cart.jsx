import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [scanContext, setScanContext] = useState(null);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    try {
      const savedCart = JSON.parse(
        localStorage.getItem("quickServeCart") || "[]",
      );

      const context = JSON.parse(
        localStorage.getItem("restaurantScanContext") || "null",
      );

      setScanContext(context);

      if (!context) {
        setCart([]);
        return;
      }

      const restaurantId = String(context.restaurantId);
      const tableId = String(context.tableId);

      const currentCart = savedCart.filter(
        (item) =>
          String(item.restaurantId) === restaurantId &&
          String(item.tableId) === tableId,
      );

      setCart(currentCart);
    } catch (error) {
      console.error("Cart loading error:", error);
      setCart([]);
    }
  };

  // =====================================================
  // SAVE CART
  // =====================================================

  const saveCart = (updatedCart) => {
    try {
      const context = JSON.parse(
        localStorage.getItem("restaurantScanContext") || "null",
      );

      if (!context) {
        return;
      }

      const savedCart = JSON.parse(
        localStorage.getItem("quickServeCart") || "[]",
      );

      const restaurantId = String(context.restaurantId);
      const tableId = String(context.tableId);

      const otherCartItems = savedCart.filter(
        (item) =>
          !(
            String(item.restaurantId) === restaurantId &&
            String(item.tableId) === tableId
          ),
      );

      const finalCart = [...otherCartItems, ...updatedCart];

      localStorage.setItem("quickServeCart", JSON.stringify(finalCart));

      setCart(updatedCart);
    } catch (error) {
      console.error("Cart save error:", error);
    }
  };

  // =====================================================
  // INCREASE QUANTITY
  // =====================================================

  const increaseQuantity = (id) => {
    const updatedCart = cart.map((item) =>
      String(item.id) === String(id)
        ? {
            ...item,
            quantity: Number(item.quantity || 0) + 1,
          }
        : item,
    );

    saveCart(updatedCart);
  };

  // =====================================================
  // DECREASE QUANTITY
  // =====================================================

  const decreaseQuantity = (id) => {
    const updatedCart = cart
      .map((item) =>
        String(item.id) === String(id)
          ? {
              ...item,
              quantity: Number(item.quantity || 0) - 1,
            }
          : item,
      )
      .filter((item) => Number(item.quantity || 0) > 0);

    saveCart(updatedCart);
  };

  // =====================================================
  // REMOVE ITEM
  // =====================================================

  const removeItem = (id) => {
    const updatedCart = cart.filter((item) => String(item.id) !== String(id));

    saveCart(updatedCart);
  };

  // =====================================================
  // CLEAR CART
  // =====================================================

  const clearCart = () => {
    if (cart.length === 0) return;

    const confirmed = window.confirm(
      "Are you sure you want to remove all items from your cart?",
    );

    if (!confirmed) return;

    saveCart([]);
  };

  // =====================================================
  // TOTALS
  // =====================================================

  const totalItems = cart.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0,
  );

  const subtotal = cart.reduce(
    (total, item) =>
      total + Number(item.price || 0) * Number(item.quantity || 0),
    0,
  );

  const taxes = 0;

  const grandTotal = subtotal + taxes;

  // =====================================================
  // GO TO LOGIN
  // =====================================================

  const handleContinue = () => {
    if (!scanContext) {
      alert("Please scan the restaurant table QR code first.");
      navigate("/");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    navigate("/login");
  };

  // =====================================================
  // EMPTY CART
  // =====================================================

  if (!scanContext) {
    return (
      <div className="cart-page">
        <div className="cart-header">
          <div className="cart-header-inner">
            <button className="cart-back-btn" onClick={() => navigate("/")}>
              <i className="bi bi-arrow-left"></i>
              <span>Back</span>
            </button>

            <div className="cart-brand">
              <i className="bi bi-lightning-charge-fill"></i>
              <span>QuickServe</span>
            </div>

            <div className="cart-header-space"></div>
          </div>
        </div>

        <main className="cart-container">
          <div className="cart-empty-card">
            <div className="cart-empty-icon">
              <i className="bi bi-qr-code-scan"></i>
            </div>

            <h2>Scan Your Table QR</h2>

            <p>
              Please scan your restaurant table QR code before adding items to
              your cart.
            </p>

            <button className="cart-primary-btn" onClick={() => navigate("/")}>
              <i className="bi bi-qr-code-scan"></i>
              Scan QR Code
            </button>
          </div>
        </main>
      </div>
    );
  }

  // =====================================================
  // CART PAGE
  // =====================================================

  return (
    <div className="cart-page">
      {/* =================================================
          HEADER
      ================================================== */}

      <header className="cart-header">
        <div className="cart-header-inner">
          <button
            className="cart-back-btn"
            onClick={() =>
              navigate(
                `/menu/${scanContext.restaurantId}/${scanContext.tableId}`,
              )
            }
          >
            <i className="bi bi-arrow-left"></i>
            <span>Menu</span>
          </button>

          <div className="cart-brand">
            <i className="bi bi-lightning-charge-fill"></i>
            <span>QuickServe</span>
          </div>

          <div className="cart-table-info">
            <i className="bi bi-table"></i>

            <div>
              <strong>
                {scanContext.tableName || `Table ${scanContext.tableId}`}
              </strong>

              <small>{scanContext.restaurantName || "Restaurant"}</small>
            </div>
          </div>
        </div>
      </header>

      {/* =================================================
          MAIN
      ================================================== */}

      <main className="cart-container">
        {/* PAGE TITLE */}

        <div className="cart-page-title">
          <div>
            <span className="cart-eyebrow">YOUR ORDER</span>

            <h1>Shopping Cart</h1>

            <p>Review your selected items before placing your order.</p>
          </div>

          {cart.length > 0 && (
            <button className="cart-clear-btn" onClick={clearCart}>
              <i className="bi bi-trash3"></i>
              Clear Cart
            </button>
          )}
        </div>

        {/* =================================================
            EMPTY
        ================================================== */}

        {cart.length === 0 ? (
          <div className="cart-empty-card">
            <div className="cart-empty-icon">
              <i className="bi bi-cart3"></i>
            </div>

            <h2>Your Cart Is Empty</h2>

            <p>
              You haven't added any food items yet. Browse the menu and choose
              your favourite dishes.
            </p>

            <button
              className="cart-primary-btn"
              onClick={() =>
                navigate(
                  `/menu/${scanContext.restaurantId}/${scanContext.tableId}`,
                )
              }
            >
              <i className="bi bi-egg-fried"></i>
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="cart-layout">
            {/* =================================================
                CART ITEMS
            ================================================== */}

            <section className="cart-items-section">
              <div className="cart-section-heading">
                <div>
                  <h2>Your Items</h2>

                  <p>
                    {totalItems} item
                    {totalItems !== 1 ? "s" : ""} in your cart
                  </p>
                </div>

                <span className="cart-item-count">
                  {cart.length} {cart.length !== 1 ? "Dishes" : "Dish"}
                </span>
              </div>

              <div className="cart-items-list">
                {cart.map((item) => {
                  const quantity = Number(item.quantity || 0);

                  const itemTotal = Number(item.price || 0) * quantity;

                  return (
                    <article className="cart-item-card" key={item.id}>
                      {/* IMAGE */}

                      <div className="cart-item-image-wrapper">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="cart-item-image"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";

                              e.currentTarget.nextElementSibling.style.display =
                                "flex";
                            }}
                          />
                        ) : null}

                        <div
                          className="cart-item-placeholder"
                          style={{
                            display: item.image ? "none" : "flex",
                          }}
                        >
                          <i className="bi bi-egg-fried"></i>
                        </div>
                      </div>

                      {/* DETAILS */}

                      <div className="cart-item-details">
                        <span className="cart-item-category">
                          {item.category || "Food Item"}
                        </span>

                        <h3>{item.name}</h3>

                        {item.description && <p>{item.description}</p>}

                        <strong className="cart-item-price">
                          ₹{Number(item.price || 0).toLocaleString("en-IN")}
                        </strong>
                      </div>

                      {/* CONTROLS */}

                      <div className="cart-item-actions">
                        <div className="cart-quantity-control">
                          <button
                            type="button"
                            onClick={() => decreaseQuantity(item.id)}
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>

                          <span>{quantity}</span>

                          <button
                            type="button"
                            onClick={() => increaseQuantity(item.id)}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        <strong className="cart-item-total">
                          ₹{itemTotal.toLocaleString("en-IN")}
                        </strong>

                        <button
                          type="button"
                          className="cart-remove-btn"
                          onClick={() => removeItem(item.id)}
                          aria-label={`Remove ${item.name}`}
                        >
                          <i className="bi bi-trash3"></i>
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* CONTINUE SHOPPING */}

              <button
                className="cart-continue-btn"
                onClick={() =>
                  navigate(
                    `/menu/${scanContext.restaurantId}/${scanContext.tableId}`,
                  )
                }
              >
                <i className="bi bi-arrow-left"></i>
                Continue Shopping
              </button>
            </section>

            {/* =================================================
                ORDER SUMMARY
            ================================================== */}

            <aside className="cart-summary-card">
              <div className="cart-summary-header">
                <div className="cart-summary-icon">
                  <i className="bi bi-receipt"></i>
                </div>

                <div>
                  <h2>Order Summary</h2>

                  <p>
                    {totalItems} total item
                    {totalItems !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              <div className="cart-summary-lines">
                <div>
                  <span>Items</span>
                  <strong>{totalItems}</strong>
                </div>

                <div>
                  <span>Subtotal</span>
                  <strong>₹{subtotal.toLocaleString("en-IN")}</strong>
                </div>

                <div>
                  <span>Taxes</span>
                  <strong>{taxes === 0 ? "Included" : `₹${taxes}`}</strong>
                </div>
              </div>

              <div className="cart-summary-divider"></div>

              <div className="cart-grand-total">
                <span>Total</span>

                <strong>₹{grandTotal.toLocaleString("en-IN")}</strong>
              </div>

              <button className="cart-order-btn" onClick={handleContinue}>
                <span>Continue to Login & Order</span>

                <i className="bi bi-arrow-right"></i>
              </button>

              <div className="cart-secure-note">
                <i className="bi bi-shield-check"></i>

                <span>
                  Your order is linked to{" "}
                  {scanContext.tableName || "your table"}.
                </span>
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}

export default Cart;
