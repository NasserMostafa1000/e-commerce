import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API_BASE_URL from "../../../Constant";
import { colors, sizes } from "../../../utils"; // تأكد من استيراد sizes مع colors
import "../../../../Styles/ProductForm.css"; // استيراد التنسيق

export default function ProductForm() {
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(""); // رسالة الحالة أو الخطأ
  const navigate = useNavigate();
  const location = useLocation();
  const productId = location.state?.productId;

  useEffect(() => {
    fetchProduct();
    fetchCategories();
  }, [productId]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [message]);
  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}Product/GetFullProduct?ProductId=${productId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      setMessage("❌ خطأ في تحميل المنتج.");
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}Product/GetCategoriesNames`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("❌ خطأ في تحميل التصنيفات.");
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    setMessage("⏳ جاري التحديث... يمكن أن يأخذ هذا بعض الوقت.");
    try {
      const response = await fetch(
        `${API_BASE_URL}Product/UpdateProduct?id=${productId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(product),
        }
      );
      if (response.ok) {
        setMessage("✅ تم تحديث المنتج بنجاح!");
      } else {
        setMessage("❌ حدث خطأ أثناء التحديث.");
      }
    } catch (error) {
      setMessage("❌ حدث خطأ أثناء التحديث.");
    }
    setLoading(false);
  };

  const handleImageUpdate = async (productDetailId) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";

    fileInput.onchange = async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("imageFile", file);

      try {
        const response = await fetch(
          `${API_BASE_URL}Product/UpdateProductImage?ProductDetailsId=${productDetailId}`,
          {
            method: "PUT", // تعديل من PUT إلى POST
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
            body: formData,
          }
        );

        if (response.ok) {
          const data = await response.json();
          setProduct((prevProduct) => ({
            ...prevProduct,
            productDetails: prevProduct.productDetails.map((detail) =>
              detail.productDetailId === productDetailId
                ? { ...detail, productImage: data.fileUrl }
                : detail
            ),
          }));
          setMessage("✅ تم تحديث الصورة بنجاح!");
        } else {
          setMessage("❌ حدث خطأ أثناء تحديث الصورة.");
        }
      } catch (error) {
        setMessage("❌ حدث خطأ أثناء تحديث الصورة.");
      }
    };

    fileInput.click();
  };

  const handleAddDetails = () => {
    // التنقل إلى صفحة إضافة تفاصيل المنتج مع تمرير productId
    navigate("/admins/AddProductDetails", {
      state: { productId: product.productId },
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>⏳ جاري التحديث... يمكن أن يأخذ هذا بعض الوقت.</p>
      </div>
    );
  }
  if (!product) return <div className="error">⚠ المنتج غير متوفر</div>;

  return (
    <div className="product-form">
      {/* عرض رسالة الحالة أو الخطأ في الأعلى */}
      {message && <div className="message">{message}</div>}

      <h2 className="form-title">🛒 تحديث بيانات {product.productName}</h2>

      <label className="form-label">📌 اسم المنتج:</label>
      <input
        type="text"
        className="form-input"
        value={product.productName || ""}
        onChange={(e) =>
          setProduct({ ...product, productName: e.target.value })
        }
      />

      <label className="form-label">💰 السعر:</label>
      <input
        type="number"
        className="form-input"
        value={product.productPrice || ""}
        onChange={(e) =>
          setProduct({ ...product, productPrice: e.target.value })
        }
      />

      <label className="form-label">🏷️ التصنيف:</label>
      <select
        className="form-select"
        value={product.categoryName || ""}
        onChange={(e) =>
          setProduct({ ...product, categoryName: e.target.value })
        }
        style={{ backgroundColor: "white", color: "black" }}
      >
        {categories.map((cat, index) => (
          <option key={index} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <label className="form-label">📉 نسبة الخصم:</label>
      <input
        type="number"
        className="form-input"
        value={product.discountPercentage || ""}
        onChange={(e) =>
          setProduct({ ...product, discountPercentage: e.target.value })
        }
      />

      <label className="form-label">📜 التفاصيل الإضافية:</label>
      <textarea
        className="form-textarea"
        value={product.moreDetails || ""}
        onChange={(e) =>
          setProduct({ ...product, moreDetails: e.target.value })
        }
      />

      {/* عرض تفاصيل المنتج */}
      <h3 className="details-title">🎨 تفاصيل المنتج</h3>

      {/* زر لإضافة تفاصيل إضافية */}
      <div className="add-details-container">
        <p className="add-details-text">أضف تفاصيل إضافية ثم قم بذلك:</p>
        <button className="add-details-button" onClick={handleAddDetails}>
          ➕ إضافة تفاصيل إضافية
        </button>
      </div>

      {product.productDetails.map((detail, index) => (
        <div key={detail.productDetailId} className="detail-item">
          <p className="detail-summary" style={{ color: "black" }}>
            لديك {detail.quantity} قطعة من {product.productName} بلون{" "}
            {detail.colorName}
            {detail.sizeName !== "غير محدد" && ` بمقاس ${detail.sizeName}`}
          </p>

          <div className="product-image-container">
            {detail.productImage ? (
              <img
                src={
                  "https://souqelbald-001-site1.ptempurl.com/" +
                  detail.productImage
                }
                alt={`${product.productName}`}
                className="product-image"
              />
            ) : (
              <p>🚫 لا توجد صورة متاحة</p>
            )}
            <button
              className="update-image-button"
              onClick={() => handleImageUpdate(detail.productDetailId)}
            >
              تحديث الصورة
            </button>
          </div>

          <label className="form-label">🎨 اللون:</label>
          <select
            className="form-select"
            value={detail.colorName || ""}
            style={{ color: "black" }}
            onChange={(e) =>
              setProduct({
                ...product,
                productDetails: product.productDetails.map((d, i) =>
                  i === index ? { ...d, colorName: e.target.value } : d
                ),
              })
            }
          >
            {colors.map((color) => (
              <option key={color.ColorId} value={color.ColorName}>
                {color.ColorName}
              </option>
            ))}
          </select>

          {detail.sizeName !== "غير محدد" && (
            <div>
              <label>📏 المقاس:</label>
              <select
                value={detail.sizeName || ""}
                style={{ color: "black" }}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    productDetails: product.productDetails.map((d, i) =>
                      i === index ? { ...d, sizeName: e.target.value } : d
                    ),
                  })
                }
              >
                {/** استخدام القائمة من sizes الموجودة في utils */}
                {/** تأكد من استيراد sizes مع colors */}
                {/** sizes يجب أن تكون مصفوفة تحتوي على الكائنات مع SizeId و SizeName */}
                {sizes.map((size) => (
                  <option key={size.SizeId} value={size.SizeName}>
                    {size.SizeName}
                  </option>
                ))}
              </select>
            </div>
          )}

          <label className="form-label">📦 الكمية:</label>
          <input
            type="number"
            className="form-input"
            value={detail.quantity || ""}
            onChange={(e) =>
              setProduct({
                ...product,
                productDetails: product.productDetails.map((d, i) =>
                  i === index ? { ...d, quantity: e.target.value } : d
                ),
              })
            }
          />
        </div>
      ))}

      <button
        className="update-button"
        onClick={handleUpdate}
        disabled={loading}
      >
        {loading ? "⏳ جاري التحديث..." : "💾 حفظ التعديلات"}
      </button>

      {message && <p className="message">{message}</p>}
    </div>
  );
}
