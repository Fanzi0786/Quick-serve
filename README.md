# QuickServe 🍽️

QuickServe is a restaurant management and digital ordering web application built with React.

It allows restaurants to manage their menu, tables, employees, orders, customers, subscriptions, and analytics while customers can scan a table QR code, view the digital menu, place orders, track orders, make payments, and provide feedback.

---

## 🚀 Features

### 👑 Super Admin

The Super Admin manages the complete QuickServe platform.

- Manage restaurants
- Add new restaurants
- Remove or deactivate restaurants
- Manage restaurant subscriptions
- Assign subscription plans
- Manage subscription duration
- Monitor subscription start and expiry dates
- View restaurant analytics
- Monitor restaurant activity and usage

### 🏪 Restaurant Admin

Each restaurant has its own admin panel.

- Restaurant dashboard
- Manage food menu
- Add, edit and remove menu items
- Manage restaurant tables
- Add and remove tables
- Generate table QR codes
- Manage restaurant employees
- Manage customer orders
- Update order status
- View customers
- View restaurant feedback
- Monitor subscription information
- View restaurant statistics

### 👨‍🍳 Employee

Employees can access the employee dashboard after authentication.

- Employee login
- View restaurant-related tasks
- Access employee dashboard

### 👤 Customer

Customers can order food without manually selecting a restaurant.

- Scan table QR code
- Automatically identify restaurant and table
- View digital menu
- View food details
- Add food to cart
- Increase/decrease quantity
- Place orders
- Track order status
- View order status
- View order tracking
- Make payment
- Provide feedback

---

## 📱 QR Code Ordering System

QuickServe uses table-based QR codes.

Each restaurant table has a unique QR code.

Example:

```text
Customer
   ↓
Scan Table QR
   ↓
Restaurant + Table Identified
   ↓
Digital Menu
   ↓
Add Food to Cart
   ↓
Place Order
   ↓
Restaurant Admin
   ↓
Order Management
   ↓
Update Order Status
   ↓
Customer Order Tracking
