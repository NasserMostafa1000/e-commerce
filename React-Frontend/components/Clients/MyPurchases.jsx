import { useEffect, useState } from "react";
import API_BASE_URL from "../Constant";
import { Link } from "react-router-dom";
import "../../Styles/MyPurchases.css";
import { Helmet } from "react-helmet"; // استيراد Helmet

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await fetch(
          `${API_BASE_URL}Orders/GetOrdersByClientId`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("فشل في جلب الطلبات");
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);
  function getStatusClass(status) {
    switch (status) {
      case "قيد المعالجة":
        return "status-processing";
      case "تم التأكيد":
        return "status-confirmed";
      case "قيد الشحن":
        return "status-shipping";
      case "تم التوصيل":
        return "status-delivered";
      case "تم الرفض":
        return "status-rejected";
      case "تم الإرجاع":
        return "status-returned";
      default:
        return "status-default";
    }
  }
  if (loading) return <p className="loading">جارٍ تحميل الطلبات...</p>;
  if (error) return <p className="error">{error}</p>;
  if (orders.length === 0)
    return (
      <p
        className="no-orders"
        style={{ color: "red", textAlign: "center", marginTop: "100px" }}
      >
        لا يوجد طلبات حتى الآن
      </p>
    );
  return (
    <div className="orders-container">
      <Helmet>
        <title>طلباتي | سوق البلد</title>
        <meta
          name="description"
          content="طلباتي التي قمت بشرائها وطلبها من موقع سوق البلد"
        />
      </Helmet>
      <h2>طلباتي</h2>
      <div className="orders-list">
        {orders.map((order) => (
          <div className="order-card" key={order.orderId}>
            <h3>رقم الطلب: #{order.orderId}</h3>
            <p className="order-status">
              <strong>حالة الطلب:</strong>
              <span
                className={`status-badge ${getStatusClass(order.orderStatus)}`}
              >
                {order.orderStatus}
              </span>
            </p>
            <p>
              <strong>سعر الشحن:</strong> {order.shippingCoast} جنيه{" "}
            </p>
            <p>
              <strong>الإجمالي:</strong> {order.totalAmount} جنيه{" "}
            </p>
            <p>
              <strong>تاريخ الطلب:</strong>{" "}
              {new Date(order.orderDate).toLocaleDateString("ar-EG", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            {order.rejectionReason && (
              <p>
                <strong>سبب الرفض:</strong> {order.rejectionReason}
              </p>
            )}
            <Link
              to={`/Purchase-Details/${order.orderId}`}
              className="details-link"
            >
              عرض التفاصيل
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
