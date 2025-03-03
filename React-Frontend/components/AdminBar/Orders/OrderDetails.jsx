import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import API_BASE_URL from "../../Constant";
import "../../../Styles/AdminOrders.css"; // استيراد التنسيق
import { BsDisplay } from "react-icons/bs";

export default function OrderDetails() {
  const { orderId } = useParams(); // ✅ استخراج orderId من الـ URL
  const [products, setProducts] = useState([]); // ✅ تخزين تفاصيل المنتجات
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = sessionStorage.getItem("token"); // or get it from context, state, etc.
        const response = await fetch(
          `${API_BASE_URL}Orders/GetOrderDetails?OrderId=${orderId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, // Send the token in the Authorization header
              "Content-Type": "application/json", // If needed, specify content type
            },
          }
        );

        if (!response.ok) throw new Error("لم يتم العثور على تفاصيل الطلب");

        const data = await response.json();

        setProducts(Array.isArray(data) ? data : [data]);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    };

    fetchOrderDetails();
  }, [orderId]);

  const fetchCurrentProduct = async (ProductName) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}Product/GetProductWithName?name=${ProductName}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data;
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  async function HandleProductClick(ProductName, ProductId) {
    const product = await fetchCurrentProduct(ProductName);
    navigate(`/productDetails/${Number(ProductId)}`, { state: { product } });
  }
  return (
    <div className="order-details-container">
      <button className="back-button" onClick={() => window.history.back()}>
        ⬅ العودة
      </button>

      <h2 style={{ textAlign: "center" }}>تفاصيل الطلب رقم {orderId}</h2>

      {loading && <p>جارٍ تحميل البيانات...</p>}
      {error && <p className="error">{error}</p>}

      {/* ✅ عرض تفاصيل المنتجات داخل الطلب */}
      {products.length > 0 ? (
        <table style={{ direction: "rtl" }}>
          <thead>
            <tr style={{ position: "sticky" }}>
              <th>اسم المنتج</th>
              <th> اللون</th>
              <th>مقاس </th>
              <th>الكمية</th>
              <th>سعر الوحدة</th>
              <th>السعر الإجمالي</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index} style={{ color: "black", direction: "rtl" }}>
                <td
                  style={{ textDecoration: "Underline", color: "blue" }}
                  onClick={() =>
                    HandleProductClick(product.productName, product.productId)
                  }
                >
                  {product.productName}
                </td>
                <td>{product.colorName}</td>
                <td>{product.sizeName}</td>

                <td>{product.quantity}</td>
                <td>{product.unitPrice.toFixed(2)}</td>
                <td>{product.totalPrice.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p>لا توجد منتجات في هذا الطلب.</p>
      )}
    </div>
  );
}
