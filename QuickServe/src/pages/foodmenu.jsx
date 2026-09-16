import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function FoodMenu() {
  const navigate = useNavigate();
  const { restaurantId, tableId } = useParams();

  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [error, setError] = useState("");

  /* =====================================================
     LOAD MENU
  ===================================================== */

  useEffect(() => {
    loadMenu();
  }, [restaurantId, tableId]);

  const loadMenu = () => {
    try {
      setError("");

      /* ---------------------------------------------
         QR SCAN CONTEXT
      --------------------------------------------- */

      const scanContext = JSON.parse(
        localStorage.getItem("restaurantScanContext") || "null",
      );

      if (
        !scanContext ||
        String(scanContext.restaurantId) !== String(restaurantId) ||
        String(scanContext.tableId) !== String(tableId)
      ) {
        setError("Please scan the restaurant table QR code first.");
        return;
      }

      /* ---------------------------------------------
         RESTAURANT
      --------------------------------------------- */

      const restaurants = JSON.parse(
        localStorage.getItem("quickServeRestaurants") || "[]",
      );

      const currentRestaurant = restaurants.find(
        (item) => String(item.id) === String(restaurantId),
      );

      if (!currentRestaurant) {
        setError("Restaurant not found.");
        return;
      }

      /* Check restaurant status */

      if (
        currentRestaurant.status &&
        String(currentRestaurant.status).toLowerCase() !== "active"
      ) {
        setError("This restaurant is currently inactive.");
        return;
      }

      setRestaurant(currentRestaurant);

      /* ---------------------------------------------
         MENU
      --------------------------------------------- */

      const allMenus = JSON.parse(
        localStorage.getItem("quickServeMenus") || "{}",
      );

      let restaurantMenu = [];

      /*
        First try exact restaurant ID.
      */

      if (Array.isArray(allMenus[restaurantId])) {
        restaurantMenu = allMenus[restaurantId];
      }

      /*
        If not found, search keys using String().
        This handles number/string ID mismatch.
      */

      if (restaurantMenu.length === 0) {
        const matchingKey = Object.keys(allMenus).find(
          (key) => String(key) === String(restaurantId),
        );

        if (matchingKey && Array.isArray(allMenus[matchingKey])) {
          restaurantMenu = allMenus[matchingKey];
        }
      }

      setMenu(restaurantMenu);

      /* ---------------------------------------------
         CART
      --------------------------------------------- */

      const savedCart = JSON.parse(
        localStorage.getItem("quickServeCart") || "[]",
      );

      const currentCart = savedCart.filter(
        (item) =>
          String(item.restaurantId) === String(restaurantId) &&
          String(item.tableId) === String(tableId),
      );

      setCart(currentCart);
    } catch (err) {
      console.error("Food menu error:", err);
      setError("Unable to load menu.");
    }
  };

  /* =====================================================
     GET QUANTITY
  ===================================================== */

  const getQuantity = (menuItemId) => {
    const item = cart.find(
      (cartItem) => String(cartItem.id) === String(menuItemId),
    );

    return item ? Number(item.quantity || 0) : 0;
  };

  /* =====================================================
     SAVE CART
  ===================================================== */

  const saveCart = (updatedCart) => {
    setCart(updatedCart);

    localStorage.setItem("quickServeCart", JSON.stringify(updatedCart));
  };

  /* =====================================================
     ADD TO CART
  ===================================================== */

  const addToCart = (item) => {
    const existing = cart.find(
      (cartItem) => String(cartItem.id) === String(item.id),
    );

    let updatedCart;

    if (existing) {
      updatedCart = cart.map((cartItem) =>
        String(cartItem.id) === String(item.id)
          ? {
              ...cartItem,
              quantity: Number(cartItem.quantity || 0) + 1,
            }
          : cartItem,
      );
    } else {
      updatedCart = [
        ...cart,
        {
          ...item,
          quantity: 1,
          restaurantId: String(restaurantId),
          tableId: String(tableId),
        },
      ];
    }

    saveCart(updatedCart);
  };

  /* =====================================================
     DECREASE QUANTITY
  ===================================================== */

  const decreaseQuantity = (itemId) => {
    const existing = cart.find(
      (cartItem) => String(cartItem.id) === String(itemId),
    );

    if (!existing) return;

    let updatedCart;

    if (Number(existing.quantity) <= 1) {
      updatedCart = cart.filter(
        (cartItem) => String(cartItem.id) !== String(itemId),
      );
    } else {
      updatedCart = cart.map((cartItem) =>
        String(cartItem.id) === String(itemId)
          ? {
              ...cartItem,
              quantity: Number(cartItem.quantity) - 1,
            }
          : cartItem,
      );
    }

    saveCart(updatedCart);
  };

  /* =====================================================
     CART TOTAL
  ===================================================== */

  const totalItems = cart.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0,
  );

  const cartTotal = cart.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
    0,
  );

  /* =====================================================
     ERROR PAGE
  ===================================================== */

  if (error) {
    return (
      <div className="menu-error-page">
        <div className="menu-error-card">
          <div className="error-icon">
            <i className="bi bi-exclamation-circle"></i>
          </div>

          <h2>Unable to Open Menu</h2>

          <p>{error}</p>

          <button
            type="button"
            className="menu-button"
            onClick={() => navigate("/")}
          >
            <i className="bi bi-qr-code-scan"></i>
            Scan QR Again
          </button>
        </div>
      </div>
    );
  }

  /* =====================================================
     MAIN MENU
  ===================================================== */

  return (
    <div className="food-menu-page">
      {/* =================================================
          HEADER
      ================================================= */}

      <header className="food-menu-header">
        <div className="food-menu-brand">
          <div className="food-menu-logo">Q</div>

          <div>
            <h1>{restaurant?.name || "Restaurant"}</h1>

            <p>
              <i className="bi bi-table"></i>{" "}
              {JSON.parse(localStorage.getItem("restaurantScanContext") || "{}")
                .tableName || `Table ${tableId}`}
            </p>
          </div>
        </div>

        {/* CART BUTTON */}

        <button
          type="button"
          className="cart-top-button"
          onClick={() => navigate("/cart")}
        >
          <i className="bi bi-cart3"></i>

          {cart.length > 0 && <span>{totalItems}</span>}
        </button>
      </header>

      {/* =================================================
          MENU CONTENT
      ================================================= */}

      <main className="food-menu-container">
        <div className="menu-title">
          <span className="menu-title-badge">
            <i className="bi bi-shop"></i>
            Digital Restaurant Menu
          </span>

          <h2>Digital Menu</h2>

          <p>Select your favourite food and add it to your cart.</p>
        </div>

        {/* =================================================
            EMPTY MENU
        ================================================= */}

        {menu.length === 0 ? (
          <div className="empty-menu">
            <div className="empty-menu-icon">
              <i className="bi bi-egg-fried"></i>
            </div>

            <h3>Menu Not Available</h3>

            <p>This restaurant has not added any menu items yet.</p>

            <button
              type="button"
              className="menu-button"
              onClick={() => navigate("/")}
            >
              <i className="bi bi-arrow-left"></i>
              Back
            </button>
          </div>
        ) : (
          /* =================================================
             MENU GRID
          ================================================= */

          <div className="menu-grid">
            {menu.map((item) => {
              const quantity = getQuantity(item.id);

              return (
                <div className="food-card" key={item.id}>
                  {/* IMAGE */}

                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="food-image"
                    />
                  ) : (
                    <div className="food-placeholder">
                      <i className="bi bi-egg-fried"></i>
                    </div>
                  )}

                  {/* CONTENT */}

                  <div className="food-content">
                    <h3>{item.name}</h3>

                    {item.category && (
                      <span className="food-category">{item.category}</span>
                    )}

                    {item.description && <p>{item.description}</p>}

                    {/* BOTTOM */}

                    <div className="food-bottom">
                      <strong>₹{Number(item.price || 0).toFixed(2)}</strong>

                      {quantity === 0 ? (
                        <button
                          type="button"
                          className="add-button"
                          onClick={() => addToCart(item)}
                        >
                          <i className="bi bi-plus-lg"></i>
                          Add
                        </button>
                      ) : (
                        <div className="quantity-control">
                          <button
                            type="button"
                            onClick={() => decreaseQuantity(item.id)}
                          >
                            −
                          </button>

                          <span>{quantity}</span>

                          <button type="button" onClick={() => addToCart(item)}>
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* =================================================
          BOTTOM CART BAR
      ================================================= */}

      {cart.length > 0 && (
        <div className="bottom-cart-bar">
          <div className="bottom-cart-info">
            <strong>
              {totalItems} {totalItems === 1 ? "Item" : "Items"}
            </strong>

            <span>₹{cartTotal.toFixed(2)}</span>
          </div>

          <button type="button" onClick={() => navigate("/cart")}>
            View Cart
            <i className="bi bi-arrow-right"></i>
          </button>
        </div>
      )}
    </div>
  );
}

export default FoodMenu;
