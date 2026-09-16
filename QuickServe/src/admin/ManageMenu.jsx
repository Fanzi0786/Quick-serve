import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const defaultDishes = [
  {
    id: 1,
    name: "Margherita Pizza",
    category: "Pizza",
    price: 299,
    description: "Fresh cheese, tomato sauce and basil.",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002",
    available: true,
  },
  {
    id: 2,
    name: "Veg Burger",
    category: "Burger",
    price: 149,
    description: "Crispy vegetable patty with fresh vegetables.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
    available: true,
  },
  {
    id: 3,
    name: "White Sauce Pasta",
    category: "Pasta",
    price: 249,
    description: "Creamy pasta with herbs and vegetables.",
    image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601",
    available: true,
  },
  {
    id: 4,
    name: "Cold Coffee",
    category: "Drinks",
    price: 120,
    description: "Chilled coffee with creamy texture.",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735",
    available: true,
  },
];

const emptyForm = {
  name: "",
  category: "",
  price: "",
  description: "",
  image: "",
  available: true,
};

function ManageMenu() {
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [restaurant, setRestaurant] = useState(null);

  const [dishes, setDishes] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState(emptyForm);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [error, setError] = useState("");

  // =========================================================
  // LOAD RESTAURANT + MENU
  // =========================================================

  useEffect(() => {
    loadMenu();
  }, []);

  const loadMenu = () => {
    try {
      setError("");

      // -----------------------------------------
      // ADMIN SESSION
      // -----------------------------------------

      const adminSession = JSON.parse(
        localStorage.getItem("restaurantAdminSession") || "null",
      );

      if (!adminSession || !adminSession.restaurantId) {
        navigate("/admin");
        return;
      }

      setSession(adminSession);

      const restaurantId = String(adminSession.restaurantId);

      // -----------------------------------------
      // RESTAURANT
      // -----------------------------------------

      const restaurants = JSON.parse(
        localStorage.getItem("quickServeRestaurants") || "[]",
      );

      const currentRestaurant = restaurants.find(
        (item) => String(item.id) === restaurantId,
      );

      if (!currentRestaurant) {
        localStorage.removeItem("restaurantAdminSession");
        localStorage.removeItem("restaurantAdmin");

        navigate("/admin");
        return;
      }

      setRestaurant(currentRestaurant);

      // -----------------------------------------
      // QUICK SERVE MENUS
      // -----------------------------------------

      const savedMenus = JSON.parse(
        localStorage.getItem("quickServeMenus") || "{}",
      );

      // -----------------------------------------
      // CURRENT RESTAURANT MENU
      // -----------------------------------------

      let restaurantMenu = [];

      if (Array.isArray(savedMenus[restaurantId])) {
        restaurantMenu = savedMenus[restaurantId];
      } else {
        // ---------------------------------------
        // OLD MENU MIGRATION
        // ---------------------------------------

        const oldMenu = JSON.parse(
          localStorage.getItem("restaurantMenu") || "[]",
        );

        if (Array.isArray(oldMenu) && oldMenu.length > 0) {
          restaurantMenu = oldMenu.map((item) => ({
            ...item,
            id: item.id ?? Date.now() + Math.random(),
            available: item.available !== false,
          }));

          savedMenus[restaurantId] = restaurantMenu;

          localStorage.setItem("quickServeMenus", JSON.stringify(savedMenus));
        }
      }

      setDishes(restaurantMenu);
    } catch (err) {
      console.error("ManageMenu load error:", err);
      setError("Unable to load restaurant menu.");
    }
  };

  // =========================================================
  // SAVE MENU
  // =========================================================

  const saveMenu = (updatedMenu) => {
    try {
      if (!session?.restaurantId) {
        return;
      }

      const restaurantId = String(session.restaurantId);

      const allMenus = JSON.parse(
        localStorage.getItem("quickServeMenus") || "{}",
      );

      allMenus[restaurantId] = updatedMenu;

      localStorage.setItem("quickServeMenus", JSON.stringify(allMenus));

      setDishes(updatedMenu);
    } catch (err) {
      console.error("Menu save error:", err);
      alert("Unable to save menu.");
    }
  };

  // =========================================================
  // FORM CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =========================================================
  // RESET FORM
  // =========================================================

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  // =========================================================
  // OPEN ADD FORM
  // =========================================================

  const openAddForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================================================
  // ADD / UPDATE ITEM
  // =========================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    const name = formData.name.trim();
    const category = formData.category.trim();
    const description = formData.description.trim();
    const price = Number(formData.price);

    if (!name || !category || !description || !formData.price) {
      alert("Please fill all required fields.");
      return;
    }

    if (price <= 0) {
      alert("Price must be greater than ₹0.");
      return;
    }

    // -----------------------------------------
    // UPDATE EXISTING ITEM
    // -----------------------------------------

    if (editingId !== null) {
      const updatedMenu = dishes.map((dish) => {
        if (String(dish.id) !== String(editingId)) {
          return dish;
        }

        return {
          ...dish,
          name,
          category,
          price,
          description,
          image: formData.image.trim(),
          available: formData.available,
        };
      });

      saveMenu(updatedMenu);

      alert("Menu item updated successfully.");

      resetForm();
      return;
    }

    // -----------------------------------------
    // ADD NEW ITEM
    // -----------------------------------------

    const newDish = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name,
      category,
      price,
      description,
      image: formData.image.trim(),
      available: formData.available,
    };

    const updatedMenu = [...dishes, newDish];

    saveMenu(updatedMenu);

    alert("New menu item added successfully.");

    resetForm();
  };

  // =========================================================
  // EDIT ITEM
  // =========================================================

  const editDish = (dish) => {
    setFormData({
      name: dish.name || "",
      category: dish.category || "",
      price: dish.price ?? "",
      description: dish.description || "",
      image: dish.image || "",
      available: dish.available !== false,
    });

    setEditingId(dish.id);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================================================
  // DELETE ITEM
  // =========================================================

  const deleteDish = (id) => {
    const dish = dishes.find((item) => String(item.id) === String(id));

    if (!dish) {
      return;
    }

    const confirmDelete = window.confirm(
      `Delete "${dish.name}" from the menu?`,
    );

    if (!confirmDelete) {
      return;
    }

    const updatedMenu = dishes.filter((item) => String(item.id) !== String(id));

    saveMenu(updatedMenu);

    if (String(editingId) === String(id)) {
      resetForm();
    }

    alert("Menu item deleted successfully.");
  };

  // =========================================================
  // TOGGLE AVAILABILITY
  // =========================================================

  const toggleAvailability = (id) => {
    const updatedMenu = dishes.map((dish) =>
      String(dish.id) === String(id)
        ? {
            ...dish,
            available: dish.available === false,
          }
        : dish,
    );

    saveMenu(updatedMenu);
  };

  // =========================================================
  // FILTER MENU
  // =========================================================

  const categories = [
    "All",
    ...Array.from(new Set(dishes.map((dish) => dish.category).filter(Boolean))),
  ];

  const filteredDishes = dishes.filter((dish) => {
    const search = searchTerm.toLowerCase().trim();

    const matchesSearch =
      !search ||
      dish.name?.toLowerCase().includes(search) ||
      dish.category?.toLowerCase().includes(search) ||
      dish.description?.toLowerCase().includes(search);

    const matchesCategory =
      categoryFilter === "All" || dish.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // =========================================================
  // COUNTS
  // =========================================================

  const totalItems = dishes.length;

  const availableItems = dishes.filter(
    (dish) => dish.available !== false,
  ).length;

  const unavailableItems = dishes.filter(
    (dish) => dish.available === false,
  ).length;

  // =========================================================
  // ERROR
  // =========================================================

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
            className="btn btn-dark"
            onClick={() => navigate("/admin/dashboard")}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // =========================================================
  // LOADING
  // =========================================================

  if (!session || !restaurant) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border" role="status"></div>

          <p className="mt-3">Loading menu management...</p>
        </div>
      </div>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="manage-menu-page">
      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <nav className="navbar restaurant-navbar">
        <div className="container">
          <button
            className="btn btn-outline-light"
            onClick={() => navigate("/admin/dashboard")}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Dashboard
          </button>

          <span className="navbar-brand text-white fw-bold mb-0">
            <i className="bi bi-menu-button-wide me-2"></i>
            Manage Menu
          </span>

          <div className="text-white text-end d-none d-md-block">
            <strong>{restaurant.name}</strong>

            <small className="d-block text-white-50">Restaurant Admin</small>
          </div>
        </div>
      </nav>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <div className="container py-5">
        {/* ===================================================
            HEADER
        ==================================================== */}

        <div className="manage-menu-header">
          <div>
            <h2>Menu Management</h2>

            <p>Add, edit and manage your restaurant menu items.</p>
          </div>

          <button
            className="btn btn-dark add-menu-btn"
            onClick={showForm ? resetForm : openAddForm}
          >
            <i className={`bi ${showForm ? "bi-x-lg" : "bi-plus-lg"} me-2`}></i>

            {showForm ? "Cancel" : "Add New Item"}
          </button>
        </div>

        {/* ===================================================
            RESTAURANT INFO
        ==================================================== */}

        <div className="alert alert-light border shadow-sm mb-4">
          <div className="d-flex align-items-center">
            <div className="me-3">
              <i className="bi bi-shop fs-3"></i>
            </div>

            <div>
              <strong>{restaurant.name}</strong>

              <small className="d-block text-muted">
                Restaurant ID: {session.restaurantId}
              </small>
            </div>
          </div>
        </div>

        {/* ===================================================
            STATISTICS
        ==================================================== */}

        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <div className="sa-stat-card">
              <div className="sa-stat-icon">
                <i className="bi bi-egg-fried"></i>
              </div>

              <div>
                <small>Total Items</small>
                <h3>{totalItems}</h3>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="sa-stat-card">
              <div className="sa-stat-icon">
                <i className="bi bi-check-circle"></i>
              </div>

              <div>
                <small>Available</small>
                <h3>{availableItems}</h3>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="sa-stat-card">
              <div className="sa-stat-icon">
                <i className="bi bi-x-circle"></i>
              </div>

              <div>
                <small>Unavailable</small>
                <h3>{unavailableItems}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================
            FORM
        ==================================================== */}

        {showForm && (
          <div className="menu-form-card mb-5">
            <div className="form-card-header">
              <h4>
                {editingId !== null ? "Edit Menu Item" : "Add New Menu Item"}
              </h4>

              <p>Enter the details of your food item below.</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="row g-4">
                {/* ITEM NAME */}

                <div className="col-md-6">
                  <label className="form-label">Item Name *</label>

                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="e.g. Paneer Tikka"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* CATEGORY */}

                <div className="col-md-6">
                  <label className="form-label">Category *</label>

                  <select
                    name="category"
                    className="form-select"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Category</option>

                    <option value="Pizza">Pizza</option>

                    <option value="Burger">Burger</option>

                    <option value="Pasta">Pasta</option>

                    <option value="Drinks">Drinks</option>

                    <option value="Starters">Starters</option>

                    <option value="Main Course">Main Course</option>

                    <option value="Desserts">Desserts</option>

                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* PRICE */}

                <div className="col-md-6">
                  <label className="form-label">Price (₹) *</label>

                  <input
                    type="number"
                    name="price"
                    className="form-control"
                    placeholder="e.g. 199"
                    min="1"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* IMAGE */}

                <div className="col-md-6">
                  <label className="form-label">Image URL</label>

                  <input
                    type="url"
                    name="image"
                    className="form-control"
                    placeholder="https://example.com/image.jpg"
                    value={formData.image}
                    onChange={handleChange}
                  />
                </div>

                {/* DESCRIPTION */}

                <div className="col-12">
                  <label className="form-label">Description *</label>

                  <textarea
                    name="description"
                    className="form-control"
                    rows="3"
                    placeholder="Describe the dish..."
                    value={formData.description}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                {/* AVAILABILITY */}

                <div className="col-12">
                  <div className="availability-input">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="available"
                      name="available"
                      checked={formData.available}
                      onChange={handleChange}
                    />

                    <label className="form-check-label" htmlFor="available">
                      Item is currently available
                    </label>
                  </div>
                </div>

                {/* BUTTONS */}

                <div className="col-12">
                  <button type="submit" className="btn btn-dark me-2">
                    <i className="bi bi-check-lg me-2"></i>

                    {editingId !== null ? "Update Item" : "Add Item"}
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={resetForm}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* ===================================================
            SEARCH + FILTER
        ==================================================== */}

        {dishes.length > 0 && (
          <div className="menu-management-card mb-4">
            <div className="row g-3 align-items-center">
              <div className="col-lg-7">
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-search"></i>
                  </span>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search menu items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-lg-5">
                <select
                  className="form-select"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === "All" ? "All Categories" : category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================
            MENU LIST
        ==================================================== */}

        <div className="menu-management-card">
          <div className="menu-list-header">
            <div>
              <h4>All Menu Items</h4>

              <span>
                {filteredDishes.length} of {dishes.length} item
                {dishes.length !== 1 ? "s" : ""}
              </span>
            </div>

            {dishes.length > 0 && (
              <button className="btn btn-dark" onClick={openAddForm}>
                <i className="bi bi-plus-lg me-2"></i>
                Add Item
              </button>
            )}
          </div>

          {/* EMPTY MENU */}

          {dishes.length === 0 ? (
            <div className="empty-menu-state">
              <i className="bi bi-egg-fried"></i>

              <h4>No Menu Items</h4>

              <p>Add your first menu item to get started.</p>

              <button className="btn btn-dark" onClick={openAddForm}>
                <i className="bi bi-plus-lg me-2"></i>
                Add Item
              </button>
            </div>
          ) : filteredDishes.length === 0 ? (
            /* NO SEARCH RESULTS */

            <div className="empty-menu-state">
              <i className="bi bi-search"></i>

              <h4>No Matching Items</h4>

              <p>Try another search term or category.</p>

              <button
                className="btn btn-outline-dark"
                onClick={() => {
                  setSearchTerm("");
                  setCategoryFilter("All");
                }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            /* MENU TABLE */

            <div className="table-responsive">
              <table className="table menu-admin-table align-middle">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Availability</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredDishes.map((dish) => (
                    <tr key={dish.id}>
                      {/* ITEM */}

                      <td>
                        <div className="admin-menu-item">
                          {dish.image ? (
                            <img
                              src={dish.image}
                              alt={dish.name}
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="no-menu-image">
                              <i className="bi bi-image"></i>
                            </div>
                          )}

                          <div>
                            <strong>{dish.name}</strong>

                            <small>{dish.description}</small>
                          </div>
                        </div>
                      </td>

                      {/* CATEGORY */}

                      <td>
                        <span className="admin-category">{dish.category}</span>
                      </td>

                      {/* PRICE */}

                      <td>
                        <strong>
                          ₹{Number(dish.price || 0).toLocaleString("en-IN")}
                        </strong>
                      </td>

                      {/* AVAILABILITY */}

                      <td>
                        <button
                          type="button"
                          className={`availability-btn ${
                            dish.available !== false
                              ? "available"
                              : "unavailable"
                          }`}
                          onClick={() => toggleAvailability(dish.id)}
                        >
                          <i
                            className={`bi ${
                              dish.available !== false
                                ? "bi-check-circle"
                                : "bi-x-circle"
                            } me-1`}
                          ></i>

                          {dish.available !== false
                            ? "Available"
                            : "Unavailable"}
                        </button>
                      </td>

                      {/* ACTIONS */}

                      <td className="text-end">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => editDish(dish)}
                          title="Edit menu item"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>

                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => deleteDish(dish.id)}
                          title="Delete menu item"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageMenu;
