import React from "react";
import ReactDOM from "react-dom/client"; // تأكد من استخدام ReactDOM/client
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // استيراد Route أيضًا
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App";
import ForgotPassword from "../Components/Login&Register/ForgotPassword";
import Signup from "../Components/Login&Register/Signup";
import Home from "./Home/Home";
import Login from "../Components/Login&Register/Login";
import FindProducts from "../Components/Products/FindProducts";
import ProductDetails from "../Components/Products/ProductDetails";
import Cart from "./Cart/Cart";
import PurchaseDetailsOperation from "./CreateOrder/PurchaseDetailsOperation";
import MyPurchases from "./Clients/MyPurchases";
import PurchaseDetails from "./Clients/PurchaseDetails";
import MyProfile from "./Clients/MyProfile";
import Orders from "./AdminBar/Orders/Orders";
import OrderDetails from "./AdminBar/Orders/OrderDetails";
import ShippingInfo from "./AdminBar/Shipping/ShippingInfo";
import Managers from "./AdminBar/Managers/Managers";
import AddProduct from "./AdminBar/Products/AddProduct";
import AddProductDetails from "./AdminBar/Products/AddProductDetails";
import ProductForm from "./AdminBar/Products/UpdateProduct/ProductForm";
import Clients from "./Clients/Clients";
import UpdateAdminInfo from "./AdminBar/UpdateContactUs";
import ContactUsCom from "./Contact_About/ContactUsCom";
import AboutUs from "./Contact_About/AboutUs";
import PrivacyAndTerms from "./Privacy_Terms/PrivacyAndTerms";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <GoogleOAuthProvider clientId="1002692311708-dv44b5us60jlovbgdcv87rbuvgfs01vo.apps.googleusercontent.com">
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/FindProducts" element={<FindProducts />} />
        <Route path="/productDetails/:id" element={<ProductDetails />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/PurchaseDetails" element={<PurchaseDetailsOperation />} />
        <Route path="/MyPurchases" element={<MyPurchases />} />
        <Route path="/Admin/Orders" element={<Orders />} />
        <Route path="/Admin/shipping-prices" element={<ShippingInfo />} />
        <Route path="/admins/Managers" element={<Managers />} />
        <Route path="/admins/AddProduct" element={<AddProduct />} />
        <Route path="/admin/edit-product" element={<ProductForm />} />
        <Route path="/admin/Clients" element={<Clients />} />
        <Route path="/admin/UpdateAdminInfo" element={<UpdateAdminInfo />} />
        <Route path="/Contact" element={<ContactUsCom />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/terms" element={<PrivacyAndTerms />} />
        <Route
          path="/admins/AddProductDetails"
          element={<AddProductDetails />}
        />
        <Route
          path="/Admin/order-details/:orderId"
          element={<OrderDetails />}
        />
        <Route
          path="/Purchase-Details/:orderId"
          element={<PurchaseDetails />}
        />
        <Route path="/MyProfile" element={<MyProfile />} />
      </Routes>
    </Router>
  </GoogleOAuthProvider>
);
