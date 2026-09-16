import { Navigate, Route, Routes } from "react-router-dom";

/* =========================
   CUSTOMER PAGES
========================= */
import Home from "./pages/Home";
import TableScan from "./pages/TableScan";
import CustomerLogin from "./pages/CustomerLogin";
import FoodMenu from "./pages/foodmenu";
import Cart from "./pages/Cart";
import OrderStatus from "./pages/OrderStatus";
import Feedback from "./pages/Feedback";

/* =========================
   CUSTOMER PANEL
========================= */
import CustomerPanel from "./customer/CustomerPanel";
import OrderTracking from "./customer/OrderTracking";
import Payment from "./customer/Payment";

/* =========================
   RESTAURANT ADMIN
========================= */
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import ManageMenu from "./admin/ManageMenu";
import ManageEmployees from "./admin/ManageEmployees";
import ManageTables from "./admin/ManageTables";
import OrderManagement from "./admin/OrderManagement";

/* =========================
   EMPLOYEE
========================= */
import EmployeeLogin from "./employee/EmployeeLogin";
import EmployeeDashboard from "./employee/EmployeeDashboard";

/* =========================
   SUPER ADMIN
========================= */
import SuperAdminLogin from "./superadmin/SuperAdminLogin";
import SuperAdminDashboard from "./superadmin/SuperAdminDashboard";
import ManageRestaurants from "./superadmin/ManageRestaurants";
import ManageSubscriptions from "./superadmin/ManageSubscriptions";
import RestaurantAnalytics from "./superadmin/RestaurantAnalytics";

/* =========================================================
   CUSTOMER MENU PROTECTION
   Customer must scan QR first
========================================================= */

function CustomerMenuRoute({ children }) {
  const scanContext = JSON.parse(
    localStorage.getItem("restaurantScanContext") || "null",
  );

  if (!scanContext) {
    return <Navigate to="/" replace />;
  }

  return children;
}

/* =========================================================
   CUSTOMER LOGIN PROTECTION
   Customer must have restaurant/table QR context
========================================================= */

function CustomerLoginRoute({ children }) {
  const scanContext = JSON.parse(
    localStorage.getItem("restaurantScanContext") || "null",
  );

  if (!scanContext) {
    return <Navigate to="/" replace />;
  }

  return children;
}

/* =========================================================
   CUSTOMER PROTECTED ROUTE
========================================================= */

function CustomerRoute({ children }) {
  const scanContext = JSON.parse(
    localStorage.getItem("restaurantScanContext") || "null",
  );

  const customer = JSON.parse(
    localStorage.getItem("restaurantCustomer") || "null",
  );

  if (!scanContext) {
    return <Navigate to="/" replace />;
  }

  if (!customer) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

/* =========================================================
   RESTAURANT ADMIN PROTECTED ROUTE
========================================================= */

function AdminRoute({ children }) {
  const adminSession = JSON.parse(
    localStorage.getItem("restaurantAdminSession") || "null",
  );

  if (!adminSession) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

/* =========================================================
   EMPLOYEE PROTECTED ROUTE
========================================================= */

function EmployeeRoute({ children }) {
  const employeeSession = JSON.parse(
    localStorage.getItem("employeeSession") || "null",
  );

  if (!employeeSession) {
    return <Navigate to="/employee" replace />;
  }

  return children;
}

/* =========================================================
   SUPER ADMIN PROTECTED ROUTE
========================================================= */

function SuperAdminRoute({ children }) {
  const loggedIn = localStorage.getItem("quickServeSuperAdminLoggedIn");

  if (loggedIn !== "true") {
    return <Navigate to="/superadmin" replace />;
  }

  return children;
}

/* =========================================================
   APP ROUTES
========================================================= */

function App() {
  return (
    <Routes>
      {/* =====================================================
          CUSTOMER
      ===================================================== */}

      {/* Home / QR instruction */}
      <Route path="/" element={<Home />} />

      {/* QR Scanner */}
      <Route path="/scan" element={<TableScan />} />

      {/* QR Scanner with restaurant + table */}
      <Route path="/scan/:restaurantId/:tableId" element={<TableScan />} />

      {/* Customer Login */}
      <Route
        path="/login"
        element={
          <CustomerLoginRoute>
            <CustomerLogin />
          </CustomerLoginRoute>
        }
      />

      {/* Restaurant Menu */}
      <Route
        path="/menu/:restaurantId/:tableId"
        element={
          <CustomerMenuRoute>
            <FoodMenu />
          </CustomerMenuRoute>
        }
      />

      {/* Cart */}
      <Route
        path="/cart"
        element={
          <CustomerMenuRoute>
            <Cart />
          </CustomerMenuRoute>
        }
      />

      {/* Current Order Status */}
      <Route
        path="/order-status"
        element={
          <CustomerRoute>
            <OrderStatus />
          </CustomerRoute>
        }
      />

      {/* Feedback */}
      <Route
        path="/feedback"
        element={
          <CustomerRoute>
            <Feedback />
          </CustomerRoute>
        }
      />

      {/* =====================================================
          CUSTOMER PANEL
      ===================================================== */}

      <Route
        path="/customer"
        element={
          <CustomerRoute>
            <CustomerPanel />
          </CustomerRoute>
        }
      />

      {/* Customer Order Tracking */}
      <Route
        path="/customer/orders"
        element={
          <CustomerRoute>
            <OrderTracking />
          </CustomerRoute>
        }
      />

      {/* Customer Payment */}
      <Route
        path="/customer/payment"
        element={
          <CustomerRoute>
            <Payment />
          </CustomerRoute>
        }
      />

      {/* Customer Feedback */}
      <Route
        path="/customer/feedback"
        element={
          <CustomerRoute>
            <Feedback />
          </CustomerRoute>
        }
      />

      {/* =====================================================
          RESTAURANT ADMIN
      ===================================================== */}

      {/* Admin Login */}
      <Route path="/admin" element={<AdminLogin />} />

      {/* Admin Dashboard */}
      <Route
        path="/admin/dashboard"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />

      {/* Manage Menu */}
      <Route
        path="/admin/menu"
        element={
          <AdminRoute>
            <ManageMenu />
          </AdminRoute>
        }
      />

      {/* Manage Tables */}
      <Route
        path="/admin/tables"
        element={
          <AdminRoute>
            <ManageTables />
          </AdminRoute>
        }
      />

      {/* Manage Employees */}
      <Route
        path="/admin/employees"
        element={
          <AdminRoute>
            <ManageEmployees />
          </AdminRoute>
        }
      />

      {/* ⭐ Order Management */}
      <Route
        path="/admin/orders"
        element={
          <AdminRoute>
            <OrderManagement />
          </AdminRoute>
        }
      />

      {/* =====================================================
          EMPLOYEE
      ===================================================== */}

      {/* Employee Login */}
      <Route path="/employee" element={<EmployeeLogin />} />

      {/* Employee Dashboard */}
      <Route
        path="/employee/dashboard"
        element={
          <EmployeeRoute>
            <EmployeeDashboard />
          </EmployeeRoute>
        }
      />

      {/* =====================================================
          SUPER ADMIN
      ===================================================== */}

      {/* Super Admin Login */}
      <Route path="/superadmin" element={<SuperAdminLogin />} />

      {/* Super Admin Dashboard */}
      <Route
        path="/superadmin/dashboard"
        element={
          <SuperAdminRoute>
            <SuperAdminDashboard />
          </SuperAdminRoute>
        }
      />

      {/* Manage Restaurants */}
      <Route
        path="/superadmin/restaurants"
        element={
          <SuperAdminRoute>
            <ManageRestaurants />
          </SuperAdminRoute>
        }
      />

      {/* Manage Subscriptions */}
      <Route
        path="/superadmin/subscriptions"
        element={
          <SuperAdminRoute>
            <ManageSubscriptions />
          </SuperAdminRoute>
        }
      />

      {/* Restaurant Analytics */}
      <Route
        path="/superadmin/analytics"
        element={
          <SuperAdminRoute>
            <RestaurantAnalytics />
          </SuperAdminRoute>
        }
      />

      {/* =====================================================
          UNKNOWN ROUTE
      ===================================================== */}

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
