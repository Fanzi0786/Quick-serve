import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";

function ManageTables() {
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [tables, setTables] = useState([]);
  const [newTableName, setNewTableName] = useState("");

  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const adminSession = JSON.parse(
      localStorage.getItem("restaurantAdminSession") || "null",
    );

    if (!adminSession) {
      navigate("/admin");
      return;
    }

    setSession(adminSession);

    // Get restaurants
    const restaurants = JSON.parse(
      localStorage.getItem("quickServeRestaurants") || "[]",
    );

    const currentRestaurant = restaurants.find(
      (item) => item.id === adminSession.restaurantId,
    );

    if (!currentRestaurant) {
      navigate("/admin");
      return;
    }

    setRestaurant(currentRestaurant);

    // Get restaurant-specific tables
    const allTables = JSON.parse(
      localStorage.getItem("quickServeTables") || "{}",
    );

    setTables(allTables[adminSession.restaurantId] || []);
  };

  // =========================
  // TABLE LIMIT
  // =========================

  const maxTables = restaurant?.subscription?.maxTables ?? null;

  const tableLimitReached = maxTables !== null && tables.length >= maxTables;

  // =========================
  // ADD TABLE
  // =========================

  const addTable = () => {
    if (!newTableName.trim()) {
      alert("Please enter a table name.");
      return;
    }

    if (tableLimitReached) {
      alert(
        `Table limit reached. Your ${
          restaurant?.subscription?.plan || "Free"
        } plan allows only ${maxTables} tables. Please upgrade your subscription.`,
      );
      return;
    }

    const restaurantId = session.restaurantId;

    const newTable = {
      id: `table_${Date.now()}`,
      name: newTableName.trim(),
      restaurantId: restaurantId,
      createdAt: new Date().toISOString(),
    };

    const allTables = JSON.parse(
      localStorage.getItem("quickServeTables") || "{}",
    );

    if (!allTables[restaurantId]) {
      allTables[restaurantId] = [];
    }

    allTables[restaurantId].push(newTable);

    localStorage.setItem("quickServeTables", JSON.stringify(allTables));

    setTables(allTables[restaurantId]);
    setNewTableName("");
  };

  // =========================
  // DELETE TABLE
  // =========================

  const deleteTable = (tableId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this table?",
    );

    if (!confirmDelete) {
      return;
    }

    const restaurantId = session.restaurantId;

    const allTables = JSON.parse(
      localStorage.getItem("quickServeTables") || "{}",
    );

    allTables[restaurantId] = (allTables[restaurantId] || []).filter(
      (table) => table.id !== tableId,
    );

    localStorage.setItem("quickServeTables", JSON.stringify(allTables));

    setTables(allTables[restaurantId]);
  };

  // =========================
  // QR URL
  // =========================

  const getQRUrl = (table) => {
    return `${window.location.origin}/scan/${restaurant.id}/${table.id}`;
  };

  // =========================
  // DOWNLOAD QR
  // =========================

  const downloadQR = (table) => {
    const canvas = document.getElementById(`qr-${table.id}`);

    if (!canvas) {
      alert("QR code is not ready.");
      return;
    }

    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");

    const downloadLink = document.createElement("a");

    downloadLink.href = pngUrl;

    downloadLink.download = `${restaurant.name}-${table.name}-QR.png`;

    document.body.appendChild(downloadLink);

    downloadLink.click();

    document.body.removeChild(downloadLink);
  };

  // =========================
  // PRINT QR
  // =========================

  const printQR = (table) => {
    const canvas = document.getElementById(`qr-${table.id}`);

    if (!canvas) {
      alert("QR code is not ready.");
      return;
    }

    const qrImage = canvas.toDataURL("image/png");

    const printWindow = window.open("", "_blank", "width=600,height=700");

    if (!printWindow) {
      alert("Please allow pop-ups to print the QR code.");
      return;
    }

    printWindow.document.write(`
      <html>

        <head>

          <title>
            ${table.name} QR Code
          </title>

          <style>

            body {
              font-family: Arial, sans-serif;
              text-align: center;
              padding: 40px;
            }

            h1 {
              margin-bottom: 10px;
            }

            h2 {
              margin-bottom: 25px;
            }

            img {
              width: 280px;
              height: 280px;
            }

            p {
              margin-top: 25px;
              color: #555;
            }

          </style>

        </head>

        <body>

          <h1>
            ${restaurant.name}
          </h1>

          <h2>
            ${table.name}
          </h2>

          <img src="${qrImage}" />

          <p>
            Scan this QR code to view the menu
            and place your order.
          </p>

          <script>

            window.onload = function() {
              window.print();
            };

          <\/script>

        </body>

      </html>
    `);

    printWindow.document.close();
  };

  // =========================
  // LOGOUT
  // =========================

  const logout = () => {
    localStorage.removeItem("restaurantAdminSession");

    localStorage.removeItem("restaurantAdmin");

    navigate("/admin");
  };

  // =========================
  // LOADING
  // =========================

  if (!session || !restaurant) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border"></div>

        <p className="mt-3">Loading tables...</p>
      </div>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <div className="sa-page">
      {/* =========================
          NAVBAR
      ========================== */}

      <nav className="sa-navbar">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <div className="text-white">
              <div className="fw-bold fs-5">
                <i className="bi bi-lightning-charge-fill me-2"></i>
                QuickServe
              </div>

              <small className="text-white-50">Table & QR Management</small>
            </div>

            <div className="d-flex align-items-center gap-3">
              <div className="text-white text-end d-none d-md-block">
                <strong>{restaurant.name}</strong>

                <small className="d-block text-white-50">
                  {session.adminUsername}
                </small>
              </div>

              <button className="btn btn-outline-light" onClick={logout}>
                <i className="bi bi-box-arrow-right me-2"></i>
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* =========================
          MAIN CONTENT
      ========================== */}

      <div className="container py-5">
        {/* HEADER */}

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold">Manage Tables</h2>

            <p className="text-muted mb-0">
              Create restaurant tables and generate QR codes for customer
              ordering.
            </p>
          </div>

          <button
            className="btn btn-dark"
            onClick={() => navigate("/admin/dashboard")}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Dashboard
          </button>
        </div>

        {/* =========================
            SUBSCRIPTION LIMIT
        ========================== */}

        <div className="alert alert-info">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <strong>{restaurant.subscription?.plan || "Free"} Plan</strong>

              <div className="mt-1">
                Tables:
                <strong className="ms-1">{tables.length}</strong>
                {" / "}
                {maxTables === null ? "Unlimited" : maxTables}
              </div>
            </div>

            {tableLimitReached && (
              <span className="badge bg-danger">Limit Reached</span>
            )}
          </div>
        </div>

        {/* =========================
            ADD TABLE
        ========================== */}

        <div className="sa-management-card mb-4">
          <div className="sa-section-heading">
            <h4>Add New Table</h4>

            <p>Add a table and generate its unique QR code.</p>
          </div>

          <div className="row g-3">
            <div className="col-md-8">
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Example: Table 1"
                value={newTableName}
                onChange={(e) => setNewTableName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addTable();
                  }
                }}
              />
            </div>

            <div className="col-md-4">
              <button
                className="btn btn-dark btn-lg w-100"
                onClick={addTable}
                disabled={tableLimitReached}
              >
                <i className="bi bi-plus-circle me-2"></i>

                {tableLimitReached ? "Table Limit Reached" : "Add Table"}
              </button>
            </div>
          </div>

          {tableLimitReached && (
            <div className="text-danger mt-3">
              <i className="bi bi-exclamation-triangle me-2"></i>
              Your <strong>
                {restaurant.subscription?.plan || "Free"}
              </strong>{" "}
              plan allows only <strong>{maxTables} tables</strong>. Please
              contact the QuickServe Super Admin to upgrade your plan.
            </div>
          )}
        </div>

        {/* =========================
            TABLE LIST
        ========================== */}

        <div className="sa-management-card">
          <div className="sa-section-heading">
            <h4>Restaurant Tables</h4>

            <p>Each table has its own QR code.</p>
          </div>

          {tables.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-grid fs-1 text-muted"></i>

              <h5 className="mt-3">No Tables Added</h5>

              <p className="text-muted">Add your first table above.</p>
            </div>
          ) : (
            <div className="row g-4">
              {tables.map((table) => (
                <div className="col-md-6 col-lg-4" key={table.id}>
                  <div className="card h-100 shadow-sm border-0">
                    <div className="card-body text-center">
                      {/* TABLE NAME */}

                      <h5 className="fw-bold">{table.name}</h5>

                      <p className="text-muted small">Scan QR to order</p>

                      {/* =========================
                          QR CODE
                      ========================== */}

                      <div className="d-flex justify-content-center my-3">
                        <QRCodeCanvas
                          id={`qr-${table.id}`}
                          value={getQRUrl(table)}
                          size={180}
                          bgColor="#ffffff"
                          fgColor="#000000"
                          level="H"
                          includeMargin={true}
                        />
                      </div>

                      {/* QR URL */}

                      <div className="small text-muted mb-3 text-break">
                        /scan/
                        {restaurant.id}/{table.id}
                      </div>

                      {/* =========================
                          DOWNLOAD
                      ========================== */}

                      <div className="d-grid gap-2">
                        <button
                          className="btn btn-dark"
                          onClick={() => downloadQR(table)}
                        >
                          <i className="bi bi-download me-2"></i>
                          Download QR
                        </button>

                        {/* =========================
                            PRINT
                        ========================== */}

                        <button
                          className="btn btn-outline-dark"
                          onClick={() => printQR(table)}
                        >
                          <i className="bi bi-printer me-2"></i>
                          Print QR
                        </button>

                        {/* =========================
                            DELETE
                        ========================== */}

                        <button
                          className="btn btn-outline-danger"
                          onClick={() => deleteTable(table.id)}
                        >
                          <i className="bi bi-trash me-2"></i>
                          Delete Table
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageTables;
