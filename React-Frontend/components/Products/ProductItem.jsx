import React from "react";
import "../../Styles/ProductItem.css";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../Constant";

export default function ProductItem({ product, CurrentRole }) {
  const {
    productId,
    productName,
    productPrice,
    priceAfterDiscount,
    discountPercentage,
    productImage,
  } = product;

  // 🔵 الانتقال إلى صفحة تعديل المنتج
  const navigate = useNavigate(); // ✅ يجب أن يكون هنا
  const MoveToUpdateProductPage = (event) => {
    event.stopPropagation(); // 🚀 منع تنفيذ الحدث الأساسي (عدم فتح صفحة المنتج عند الضغط على التعديل)
    navigate("/admin/edit-product", { state: { productId } });
  };

  // 🔵 الانتقال إلى صفحة تفاصيل المنتج
  const handleProductClick = () => {
    navigate("/ProductDetails", { state: { product } });
  };

  return (
    <div className="product-item" onClick={handleProductClick}>
      {(CurrentRole === "Admin" || CurrentRole === "Manager") && (
        <div className="edit-icon" style={{ maxHeight: "50px" }}>
          <FaEdit onClick={MoveToUpdateProductPage} />{" "}
          {/* ✅ الآن الضغط لا يؤثر على العنصر الأساسي */}
        </div>
      )}

      {productImage && (
        <img
          src={"https://souqelbald-001-site1.ptempurl.com/" + productImage}
          alt={productName}
          className="product-image"
        />
      )}

      {/* اسم المنتج */}
      <div className="product-name">{productName}</div>

      {/* عرض السعر */}
      <div className="product-price">
        {discountPercentage > 0 && (
          <span className="original-price">{productPrice} جنيه مصري</span>
        )}
        <h5 className="discounted-price">جنيه مصري {priceAfterDiscount}</h5>
      </div>

      {discountPercentage > 0 && (
        <div className="discount-badge" style={{ color: "red" }}>
          % {discountPercentage}-
        </div>
      )}
    </div>
  );
}
