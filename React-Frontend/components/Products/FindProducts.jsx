import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useNavigate, useLocation } from "react-router-dom";
import NavBar from "../Home/Nav.jsx";
import "../../Styles/FindProducts.css";
import API_BASE_URL from "../Constant.js";
import { FaEdit } from "react-icons/fa";
import { getRoleFromToken } from "../utils.js";

export default function FindProducts() {
  const location = useLocation();
  const Name = location.state?.searchQuery || ""; // الوصول إلى query من state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}Product/GetProductsByName?Name=${Name}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // إيقاف مؤشر التحميل بعد الانتهاء
      }
    };
    if (Name) fetchProducts(); // التأكد من وجود اسم المنتج قبل تنفيذ الدالة
  }, [Name]);

  const MoveToUpdateProductPage = (productId) => {
    navigate("/admin/edit-product", { state: { productId } });
  };

  // الانتقال إلى صفحة تفاصيل المنتج
  const handleProductClick = (product) => {
    navigate(`/ProductDetails/${product.productId}`, { state: { product } });
  };

  const CurrentRole = getRoleFromToken(sessionStorage.getItem("token"));

  return (
    <div>
      <Helmet>
        <title>نتائج البحث عن '{Name}' | سوق البلد </title>
        <meta
          name="description"
          content={`استكشف نتائج البحث لكلمة '${Name}' والعروض الحصرية في موقعنا.`}
        />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <NavBar />
      <h1 style={{ color: "black", textAlign: "center" }}>
        نتائج البحث عن : {Name}
      </h1>
      {loading ? (
        <p style={{ textAlign: "center" }}>جارٍ التحميل...</p>
      ) : (
        <div className="find-product-container">
          {products.map((product) => (
            <div
              key={product.productId}
              onClick={() => handleProductClick(product)}
              className="find-product-item"
            >
              {(CurrentRole === "Admin" || CurrentRole === "Manager") && (
                <div className="edit-icon-container">
                  <FaEdit
                    onClick={(e) => {
                      e.stopPropagation(); // منع التفاعل مع العنصر الأساسي عند الضغط على زر التعديل
                      MoveToUpdateProductPage(product.productId);
                    }}
                  />
                </div>
              )}
              <img
                src={
                  "https://souqelbald-001-site1.ptempurl.com" +
                  product.productImage
                }
                alt={product.productName}
                className="find-product-image"
              />
              <div className="find-product-info">
                <p className="find-product-name">{product.productName}</p>
                <div className="find-product-price">
                  {product.discountPercentage ? (
                    <>
                      <span className="find-product-original-price">
                        {product.productPrice}
                      </span>
                      <span className="find-product-discounted-price">
                        {product.priceAfterDiscount}
                        <span> جنيه</span>
                      </span>
                    </>
                  ) : (
                    <span className="find-product-discounted-price">
                      {product.productPrice}
                      <span> جنيه</span>
                    </span>
                  )}
                </div>
                {product.discountPercentage !== 0 && (
                  <span className="find-product-discount-badge">
                    % {product.discountPercentage}-
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
