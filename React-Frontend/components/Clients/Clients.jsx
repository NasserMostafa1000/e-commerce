import React, { useState, useEffect } from "react";
import API_BASE_URL from "../Constant";
import "../../Styles/AdminOrders.css"; // تأكد من أن هذا الملف يحتوي على التنسيقات المناسبة

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      setError("");
      try {
        const token = sessionStorage.getItem("token");
        const response = await fetch(
          `${API_BASE_URL}Clients/GetClients?PageNum=${pageNumber}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message);
        }
        if (data.length === 0) {
          // إذا لم تعد هناك بيانات، إيقاف زر "التالي"
          setHasMore(false);
          // إذا كنا في الصفحة الأولى، نعيد تعيين القائمة إلى مصفوفة فارغة
          if (pageNumber === 1) {
            setClients([]);
          }
        } else {
          setClients(data);
          setHasMore(true);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [pageNumber]);

  const handlePrevPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    if (hasMore) {
      setPageNumber((prev) => prev + 1);
    }
  };

  return (
    <div style={{ padding: "20px", direction: "rtl" }}>
      <h2 style={{ textAlign: "center" }}>قائمة العملاء</h2>
      <h3 style={{ textAlign: "center" }}>عدد العملاء: {clients.length}</h3>

      {loading && (
        <div
          className="contact-loading"
          style={{
            textAlign: "center",
            fontSize: "1.5rem",
            color: "#d9534f",
            margin: "2rem 0",
          }}
        >
          جاري التحميل...
        </div>
      )}

      {error && (
        <div
          className="contact-error"
          style={{
            color: "red",
            textAlign: "center",
            fontSize: "1.25rem",
            margin: "2rem 0",
          }}
        >
          خطأ: {error}
        </div>
      )}

      {!loading && !error && clients.length > 0 && (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f2f2f2" }}>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                الاسم الكامل
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                رقم الهاتف
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                البريد الإلكتروني
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                كلمة السر المشفرة
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                مزود الخدمة
              </th>
            </tr>
          </thead>
          <tbody style={{ color: "black" }}>
            {clients.map((client, index) => (
              <tr key={index}>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "center",
                  }}
                >
                  {client.fullName}
                </td>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "center",
                  }}
                >
                  {client.phoneNumber || "غير متوفر"}
                </td>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "center",
                  }}
                >
                  {client.email || "غير متوفر"}
                </td>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "center",
                  }}
                >
                  {client.password || "غير متوفر"}
                </td>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "center",
                  }}
                >
                  {client.authProvider}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button
          onClick={handlePrevPage}
          disabled={pageNumber === 1}
          style={{ padding: "10px 15px", marginRight: "10px" }}
        >
          السابق
        </button>
        <span> الصفحة {pageNumber} </span>
        <button
          onClick={handleNextPage}
          disabled={!hasMore}
          style={{ padding: "10px 15px", marginLeft: "10px" }}
        >
          التالي
        </button>
      </div>

      <p
        style={{
          textAlign: "center",
          marginTop: "20px",
          fontSize: "0.9rem",
          color: "#777",
        }}
      >
        حقوق النشر © 2025 - جميع الحقوق محفوظة
      </p>
    </div>
  );
}
