import React from "react";
import { useNavigate } from "react-router-dom";
import "../../Styles/SuccessForm.css"; // تأكد من إنشاء ملف CSS للتنسيق

const SuccessForm = ({ message, onClose }) => {
  const navigate = useNavigate();

  const goToOrders = () => {
    navigate("/MyPurchases");
  };

  return (
    <div className="success-form-overlay">
      <div className="success-form-container">
        <p className="success-message">{message}</p>
        <div className="success-form-buttons">
          <button onClick={goToOrders} className="btn orders-btn">
            الذهاب إلى طلباتي
          </button>
          <button onClick={onClose} className="btn cancel-btn">
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessForm;
