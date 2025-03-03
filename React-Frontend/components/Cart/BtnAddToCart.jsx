import "../../Styles/BtnAddToCart.css";
import API_BASE_URL from "../Constant";
import { FaShoppingCart } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddToCart({ productDetailsId, Quantity }) {
  const [buttonText, setButtonText] = useState("أضف إلى السلة");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleCartClick = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      setMessage("يجب تسجيل الدخول لمتابعة عملية الاضافه الي السله.");
      setTimeout(() => {
        navigate("/login");
      }, 5000);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}Carts/PostCartDetails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productDetailsId: Number(productDetailsId),
          quantity: Number(Quantity),
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log(data);
      setButtonText("تمت الإضافة بنجاح");

      // إعادة النص الأصلي بعد فترة زمنية قصيرة
      setTimeout(() => {
        setButtonText("أضف إلى السلة");
      }, 2000);
    } catch (error) {
      console.error("Error adding product to cart:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* طبقة التحميل تغطي الشاشة وتعطل التفاعل أثناء انتظار الرد */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
      {/* عرض الرسالة في أعلى الصفحة ثابتة */}
      {message && (
        <div className="fixed-message" style={{ backgroundColor: "red" }}>
          {message}
        </div>
      )}
      <div className="add-to-cart-btn">
        <span onClick={handleCartClick}>{buttonText}</span>
        <FaShoppingCart className="cart-icon" />
      </div>
    </>
  );
}
