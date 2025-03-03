import { useEffect, useState } from "react";
import "../../../Styles/AdminOrders.css"; // استيراد التنسيق
import API_BASE_URL from "../../Constant";
import SearchBar from "../../Home/SearchBar";
import { Link } from "react-router-dom";

export default function Orders() {
  const [orders, setOrders] = useState([]); // تخزين الطلبات المعروضة
  const [allOrders, setAllOrders] = useState([]); // الاحتفاظ بجميع الطلبات الأصلية
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchMode, setSearchMode] = useState(false);

  // حالات النافذة الخاصة بإدخال سبب الرفض
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  // قائمة حالات الطلب المتاحة
  const orderStatuses = [
    "قيد المعالجة",
    "تم التأكيد",
    "قيد الشحن",
    "تم التوصيل",
    "تم الرفض",
    "تم الإرجاع",
  ];
  function getSelectorStyle(status) {
    switch (status) {
      case "قيد المعالجة":
        return { backgroundColor: "#f8f8f8", color: "black" };
      case "تم التأكيد":
        return { backgroundColor: "#d1e7dd", color: "black" }; // أخضر فاتح
      case "قيد الشحن":
        return { backgroundColor: "#fff3cd", color: "black" }; // أصفر فاتح
      case "تم التوصيل":
        return { backgroundColor: "#cfe2ff", color: "black" }; // أزرق فاتح
      case "تم الرفض":
        return { backgroundColor: "#f8d7da", color: "black" }; // أحمر فاتح
      case "تم الإرجاع":
        return { backgroundColor: "#e2e3e5", color: "black" }; // رمادي فاتح
      default:
        return {};
    }
  }

  // دالة لتحديد نمط الـ select بناءً على حالة الطلب
  function getSelectorStyle(status) {
    switch (status) {
      case "قيد المعالجة":
        return { backgroundColor: "#f8f8f8", color: "black" };
      case "تم التأكيد":
        return { backgroundColor: "#d1e7dd", color: "black" }; // أخضر فاتح
      case "قيد الشحن":
        return { backgroundColor: "#fff3cd", color: "black" }; // أصفر فاتح
      case "تم التوصيل":
        return { backgroundColor: "#cfe2ff", color: "black" }; // أزرق فاتح
      case "تم الرفض":
        return { backgroundColor: "#f8d7da", color: "black" }; // أحمر فاتح
      case "تم الإرجاع":
        return { backgroundColor: "#e2e3e5", color: "black" }; // رمادي فاتح
      default:
        return {};
    }
  }

  // البحث عن طلب معين
  const FindOrder = async (OrderId) => {
    if (!OrderId) {
      setSearchMode(false);
      setOrders(allOrders); // استرجاع الطلبات الأصلية عند مسح البحث
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_BASE_URL}Orders/FindOrder?OrderId=${OrderId}`
      );
      if (!response.ok) throw new Error("لم يتم العثور على الطلب");
      const data = await response.json();
      setOrders([data]); // عرض الطلب المحدد فقط
      setSearchMode(true);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // جلب الطلبات
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = sessionStorage.getItem("token"); // جلب التوكن من Session Storage

      const response = await fetch(
        `${API_BASE_URL}Orders/GetOrders?PageNum=${pageNumber}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // إرسال التوكن في الهيدر
          },
        }
      );

      if (!response.ok) throw new Error("حدث خطأ أثناء تحميل البيانات");

      const data = await response.json();
      setOrders(data);
      setAllOrders(data); // حفظ جميع الطلبات الأصلية
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!searchMode) {
      fetchOrders();
    }
  }, [pageNumber, searchMode]);

  // دالة لتحديث حالة الطلب (ما عدا سبب الرفض)
  const updateOrderStatus = async (orderId, newStatus) => {
    if (newStatus === "تم الرفض") {
      // عند اختيار "تم الرفض" نعرض نافذة إدخال سبب الرفض
      setCurrentOrderId(orderId);
      setRejectionReason("");
      setShowRejectionModal(true);
    } else {
      try {
        const response = await fetch(
          `${API_BASE_URL}Orders/UpdateOrderStatues?OrderId=${orderId}&StatusName=${newStatus}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (!response.ok) throw new Error("فشل تحديث حالة الطلب");
        // تحديث الطلب في قائمة الطلبات المعروضة
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.orderId === orderId
              ? { ...order, orderStatus: newStatus }
              : order
          )
        );
        // تحديث الطلب في allOrders للحفاظ على البيانات محدثة
        setAllOrders((prevAllOrders) =>
          prevAllOrders.map((order) =>
            order.orderId === orderId
              ? { ...order, orderStatus: newStatus }
              : order
          )
        );
      } catch (err) {
        alert(`خطأ: ${err.message}`);
      }
    }
  };

  // دالة تحديث سبب الرفض (طلب منفصل)
  const updateRejectionReason = async (orderId, reason) => {
    try {
      const url = `${API_BASE_URL}Orders/UpdateOrderStatues?OrderId=${orderId}&StatusName=تم الرفض&rejectionreason=${encodeURIComponent(
        reason
      )}`;
      const response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("فشل تحديث سبب الرفض");
      // تحديث البيانات في الواجهة
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === orderId
            ? { ...order, orderStatus: "تم الرفض", rejectionReason: reason }
            : order
        )
      );
      setAllOrders((prevAllOrders) =>
        prevAllOrders.map((order) =>
          order.orderId === orderId
            ? { ...order, orderStatus: "تم الرفض", rejectionReason: reason }
            : order
        )
      );
    } catch (err) {
      alert(`خطأ في تحديث سبب الرفض: ${err.message}`);
    }
  };

  // دالة تأكيد سبب الرفض من النافذة
  const confirmRejection = async () => {
    if (!rejectionReason) {
      alert("يرجى إدخال سبب الرفض.");
      return;
    }
    // أولاً تحديث حالة الطلب إلى "تم الرفض" (بدون سبب) في قاعدة البيانات
    try {
      const response = await fetch(
        `${API_BASE_URL}Orders/UpdateOrderStatues?OrderId=${currentOrderId}&StatusName=تم الرفض`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) throw new Error("فشل تحديث حالة الطلب");
    } catch (err) {
      alert(`خطأ: ${err.message}`);
      return;
    }
    // ثم إرسال سبب الرفض في طلب منفصل
    await updateRejectionReason(currentOrderId, rejectionReason);
    setShowRejectionModal(false);
    setCurrentOrderId(null);
    setRejectionReason("");
  };

  return (
    <div className="orders-container">
      {/* نافذة إدخال سبب الرفض */}
      {showRejectionModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "400px" }}>
            <h3 style={{ textAlign: "center", marginBottom: "1rem" }}>
              سبب الرفض
            </h3>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="أدخل سبب الرفض هنا..."
              style={{
                width: "100%",
                minHeight: "100px",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                fontSize: "1rem",
              }}
            ></textarea>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "1rem",
              }}
            >
              <button
                onClick={() => setShowRejectionModal(false)}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                إلغاء
              </button>
              <button
                onClick={confirmRejection}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "green",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                تأكيد
              </button>
            </div>
          </div>
        </div>
      )}

      {/* زر العودة إلى الرئيسية */}
      <button
        className="back-button"
        onClick={() => (window.location.href = "/")}
      >
        ⬅ العودة إلى الرئيسية
      </button>

      <SearchBar searchType="Orders" onSearch={(id) => FindOrder(id)} />
      <h2>قائمة الطلبات</h2>

      {/* عرض حالة التحميل */}
      {loading && <p>جارٍ تحميل الطلبات...</p>}

      {/* عرض الخطأ إذا وجد */}
      {error && <p className="error">{error}</p>}

      {/* عرض الطلبات */}
      {!loading && !error && orders.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>اسم العميل</th>
              <th>عنوان العميل</th>
              <th>رقم العميل</th>
              <th>سعر الشحن</th>
              <th>المبلغ الكلي</th>
              <th>طريقة الدفع</th>
              <th>الرقم المحول منه</th>
              <th>الحالة</th>
              <th>سبب الرفض</th>
              <th>التاريخ</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.orderId} style={{ color: "black" }}>
                {/* جعل معرف الطلب قابلًا للنقر */}
                <td>
                  <Link to={`/Admin/order-details/${order.orderId}`}>
                    {order.orderId}
                  </Link>
                </td>
                <td>{order.fullName}</td>
                <td>{order.address}</td>
                <td>{order.clientPhone}</td>
                <td>{order.shippingCoast}</td>
                <td>{order.totalAmount + order.shippingCoast}</td>
                <td>{order.paymentMethod}</td>
                <td>
                  {order.transactionNumber
                    ? `${order.transactionNumber}`
                    : "لا يوجد"}
                </td>
                <td>
                  <select
                    style={getSelectorStyle(order.orderStatus)}
                    value={
                      orderStatuses.includes(order.orderStatus)
                        ? order.orderStatus
                        : "قيد المعالجة"
                    }
                    onChange={(e) =>
                      updateOrderStatus(order.orderId, e.target.value)
                    }
                  >
                    {orderStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  {order.rejectionReason
                    ? `${order.rejectionReason}`
                    : "لا يوجد"}
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* عرض رسالة في حالة عدم وجود طلبات */}
      {!loading && !error && orders.length === 0 && (
        <p>لا توجد طلبات حاليًا.</p>
      )}

      {/* أزرار التصفح بين الصفحات (تظهر فقط عند عدم البحث) */}
      {!searchMode && (
        <div className="pagination">
          <button
            onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
            disabled={pageNumber === 1}
          >
            السابق
          </button>
          <span> الصفحة {pageNumber} </span>
          <button onClick={() => setPageNumber((prev) => prev + 1)}>
            التالي
          </button>
        </div>
      )}
    </div>
  );
}

// دالة لتحديد نمط الـ select بناءً على حالة الطلب
