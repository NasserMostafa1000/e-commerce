import React, { useState, useEffect } from "react";
import { FiTrash2 } from "react-icons/fi";
import API_BASE_URL from "../Constant.js";
import "../../Styles/Cart.css";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet"; // استيراد Helmet

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // دالة إنشاء كائن الطلب من عناصر السلة
  function CreateOrdersObj() {
    if (cartItems.length === 1) {
      const item = {
        productDetailsId: cartItems[0].productDetailsId,
        quantity: cartItems[0].quantity,
        unitPrice: cartItems[0].unitPriceAfterDiscount,
        orderId: 0,
      };
      return item;
    }
    const products = [];
    for (let i = 0; i < cartItems.length; i++) {
      products.push({
        productDetailsId: cartItems[i].productDetailsId,
        quantity: cartItems[i].quantity,
        unitPrice: cartItems[i].unitPriceAfterDiscount,
        orderId: 0,
      });
    }
    return products;
  }

  // دالة الانتقال إلى صفحة تفاصيل الشراء
  async function handleBuyAll() {
    setIsLoading(true);
    const Product = CreateOrdersObj();
    Product.totalPrice = totalCartPrice;
    navigate("/PurchaseDetails", { state: { Product } });
    setIsLoading(false);
  }

  // جلب تفاصيل السلة عند تحميل المكون
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const fetchCartDetails = async () => {
      if (!token) return;
      try {
        const response = await fetch(`${API_BASE_URL}Carts/GetCartDetails`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setCartItems(data);
      } catch (error) {
        console.error("Error fetching cart details:", error.message);
      }
    };
    fetchCartDetails();
  }, []);

  // دالة حذف منتج من السلة
  const handleDeleteProduct = async (cartDetailsId) => {
    const token = sessionStorage.getItem("token");
    try {
      const response = await fetch(
        `${API_BASE_URL}Carts/RemoveProduct/${cartDetailsId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete product");
      }
      // تحديث حالة السلة بعد الحذف
      setCartItems(
        cartItems.filter((item) => item.cartDetailsId !== cartDetailsId)
      );
    } catch (error) {
      console.error("Error deleting product:", error.message);
    }
  };

  // دالة حذف جميع المنتجات من السلة
  const handleDeleteAllCart = async () => {
    const token = sessionStorage.getItem("token");
    try {
      const response = await fetch(
        `${API_BASE_URL}Carts/RemoveCartDetails/${cartItems[0]?.cartId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete all items in cart");
      }
      setCartItems([]);
    } catch (error) {
      console.error("Error deleting all items:", error.message);
    }
  };

  // حساب إجمالي سعر السلة
  const totalCartPrice = cartItems.reduce(
    (acc, item) => acc + item.totalPrice,
    0
  );

  return (
    <div className="cart-container">
      <Helmet>
        <title>سلة التسوق | سوق البلد</title>
        <meta
          name="description"
          content="عرض تفاصيل السلة وإجمالي السعر للمنتجات المُختارة في الملف الشخصي"
        />
      </Helmet>
      <div className="cart-header">
        <h2 style={{ color: "black", textAlign: "center" }}>سلة التسوق</h2>
        {cartItems.length !== 0 && (
          <span className="total-cart-price" style={{ color: "black" }}>
            إجمالي السعر: {totalCartPrice.toFixed(2)} <span>جنيه</span>
          </span>
        )}
      </div>
      {cartItems.length === 0 ? (
        <p style={{ color: "black", textAlign: "center" }}>
          السلة فارغة. اذهب إلى المنتجات وأضف بعض المنتجات لشرائها.
        </p>
      ) : (
        <div>
          <button className="delete-all-btn" onClick={handleDeleteAllCart}>
            حذف جميع المنتجات
          </button>
          <div className="cart-items">
            {cartItems.map((item, index) => (
              <div className="cart-item" key={index}>
                <img
                  src={item.image}
                  alt={item.productName}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <h3>{item.productName}</h3>
                  <p>اللون: {item.color || "غير متوفر"}</p>
                  <p>المقاس: {item.size || "غير متوفر"}</p>
                  <p>
                    السعر الأصلي للقطعة:{" "}
                    {item.unitPriceBeforeDiscount.toFixed(2)}
                  </p>
                  <p>نسبة الخصم: {item.discountPercentage}%</p>
                  <p>
                    السعر بعد الخصم للقطعة:{" "}
                    {item.unitPriceAfterDiscount.toFixed(2)}
                  </p>
                  <p>الكمية: {item.quantity}</p>
                  <p>إجمالي السعر بعد الخصم: {item.totalPrice.toFixed(2)}</p>
                </div>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteProduct(item.cartDetailsId)}
                >
                  <FiTrash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      {cartItems.length >= 1 && (
        <button className="purchaseItem-btn" onClick={handleBuyAll}>
          شراء الكل
        </button>
      )}

      {/* طبقة التحميل لتغطية الشاشة وتعطيل التفاعل */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
}
