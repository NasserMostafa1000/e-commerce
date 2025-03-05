# Souq-Elbalad E-Commerce Platform

Souq-Elbalad is a **single-store e-commerce platform** designed for store owners to manage their products, control inventory, process customer orders, and configure shipping rates based on locations. The platform also allows the creation of manager accounts with specific access permissions, including full product control, but with restricted access to customer data and site settings.

---

## 🚀 Project Overview

- **Frontend**: Built using **React** for a responsive and dynamic user experience.
- **Backend**: Powered by **ASP.NET Core REST APIs** to handle data management and communication.
- **Admin Panel**: Provides an interface for store owners and managers to manage the store and products.

---

## 📋 Features

### For Customers:

- **Product Browsing**:  
  Customers can easily browse products by categories and search for specific items.

- **Shopping Cart**:  
  Add products to the cart and proceed to checkout.

- **Order History**:  
  Customers can view their past orders and track their current orders.

- **Account Management**:  
  Customers can create an account, manage their details, and save shipping information.

---

### For Store Owner:

#### **Product Management**:

- Add new products
- Edit product details (name, description, price, etc.)
- Manage product quantities (increase or decrease stock)
- Remove products

#### **Order Management**:

- View and manage customer orders
- Update order status (e.g., processing, shipped, delivered)
- Handle customer inquiries regarding orders

#### **Shipping Rates**:

- Set shipping rates based on the customer's location (province or city)
- Update shipping costs dynamically based on the selected shipping region

#### **Add Shipping Agent**:

- Add an email address for shipping agents who can only manage orders related to their cases and update the status of shipments.
- Shipping agents have access only to the orders they are assigned to, not to full order or customer data.

---

### For Manager:

#### **Product Control**:

- Managers can add, edit, and remove products
- They can manage inventory and update quantities

#### **Restricted Access**:

- Managers cannot modify site settings (e.g., "Contact Us", site emails, etc.)
- Managers cannot view customer information—this is limited to the **Admin** only.

---

### For Admin:

#### **Full Access Control**:

- Admin has complete control over the website settings, including modifying site details (e.g., "Contact Us", email addresses, etc.)
- Admin can view all customer data, manage store owners and managers, and perform site-wide configurations.

---


