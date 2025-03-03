import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API_BASE_URL from "../Constant";
import "../../Styles/PurchaseDetail.css"; // تأكد من أن المسار صحيح لملف CSS
import { Helmet } from "react-helmet"; // استيراد Helmet

export default function OrderDetail() {
  const { orderId } = useParams(); // استخراج معرف الطلب من الرابط
  const [orderDetails, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await fetch(
          `${API_BASE_URL}Orders/GetOrderDetailsInSpecificOrder?OrderId=${orderId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("فشل في جلب تفاصيل الطلب");
        }

        const data = await response.json();
        setOrderDetails(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);
  // دالة لتحديد لون حسب حالة الطلب

  function GetProductName(name = " ") {
    if (!name.includes(" ")) return name;
    return name.split(" ")[0] + " " + name.split(" ")[1];
  }
  if (loading) return <p className="loading">جارٍ تحميل تفاصيل الطلب...</p>;
  if (error) return <p className="error">{error}</p>;
  if (orderDetails.length === 0)
    return <p className="no-orders">لا توجد تفاصيل لهذا الطلب</p>;

  return (
    <div className="order-detail-container">
      <Helmet>
        <title>تفاصيل الطلب رقم {orderId} | سوق البلد</title>
        <meta
          name="description"
          content="طلباتي التي قمت بشرائها وطلبها من موقع سوق البلد"
        />
      </Helmet>
      <h2 className="title">تفاصيل الطلب رقم #{orderId}</h2>
      <div className="order-details-list">
        {orderDetails.map((detail, index) => (
          <div className="order-detail-card" key={index}>
            <img
              src={
                "https://souqelbald-001-site1.ptempurl.com/" + detail.imagePath
              }
              alt={detail.productName}
              className="product-image"
            />
            <div className="detail-info">
              <h3 className="product-name">
                {GetProductName(detail.productName)}
              </h3>
              <p>
                <strong>سعر الوحدة:</strong>
                <span className="value">{detail.unitPrice} جنيه</span>
              </p>
              <p>
                <strong>اللون :</strong>
                <span className="value">{detail.colorName} </span>
              </p>
              {detail.sizeName && (
                <p>
                  <strong>المقاس :</strong>
                  <span className="value">{detail.sizeName} </span>
                </p>
              )}
              <p>
                <strong>الكمية:</strong>
                <span className="value">{detail.quantity} قطعة</span>
              </p>
              <p>
                <strong>الإجمالي:</strong>
                <span className="value total-amount">
                  {detail.totalAmount} جنيه
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
      <Link to="/MyPurchases" className="back-link">
        العودة إلى طلباتي
      </Link>
    </div>
  );
}
