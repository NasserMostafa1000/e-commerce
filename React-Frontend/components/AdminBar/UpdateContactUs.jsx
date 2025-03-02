import React, { useState, useEffect } from "react";
import API_BASE_URL from "../Constant"; // تأكد من ضبط المسار الصحيح
import { useNavigate } from "react-router-dom";

export default function UpdateAdminInfo() {
  const [adminInfo, setAdminInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchAdminInfo() {
      try {
        const token = sessionStorage.getItem("token");
        const response = await fetch(
          `${API_BASE_URL}AdminInfo/get-admin-info`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("فشل في جلب بيانات الإدارة");
        }
        const data = await response.json();
        // نفترض أن هناك سجل واحد، لذا نأخذ أول عنصر
        setAdminInfo(data[0]);
      } catch (err) {
        setMessage(`خطأ: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }
    fetchAdminInfo();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("⏳ جاري التحديث...");
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}AdminInfo/UpdateAdminInfo`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(adminInfo),
      });
      if (response.ok) {
        setMessage("✅ تم تحديث معلومات الإدارة بنجاح!");
      } else {
        setMessage("❌ فشل تحديث معلومات الإدارة.");
      }
    } catch (err) {
      setMessage(`❌ حدث خطأ: ${err.message}`);
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="update-admin-loading">⏳ جاري التحميل...</div>;
  }

  if (!adminInfo) {
    return (
      <div className="update-admin-error">⚠ معلومات الإدارة غير متوفرة.</div>
    );
  }

  return (
    <div className="update-admin-container">
      <h2 className="update-admin-title">تحديث معلومات الإدارة</h2>
      {message && <p className="update-admin-message">{message}</p>}
      <form
        onSubmit={handleSubmit}
        className="update-admin-form"
        style={{ direction: "rtl" }}
      >
        <label style={{ color: "white" }}>رقم التحويل:</label>
        <input
          style={{ color: "white" }}
          type="text"
          value={adminInfo.transactionNumber}
          onChange={(e) =>
            setAdminInfo({ ...adminInfo, transactionNumber: e.target.value })
          }
          required
        />

        <label style={{ color: "white" }}>رقم الواتساب:</label>
        <input
          style={{ color: "white" }}
          type="text"
          value={adminInfo.whatsAppNumber || ""}
          onChange={(e) =>
            setAdminInfo({ ...adminInfo, whatsAppNumber: e.target.value })
          }
        />

        <label style={{ color: "white" }}>رقم الاتصال:</label>
        <input
          style={{ color: "white" }}
          type="text"
          value={adminInfo.callNumber || ""}
          onChange={(e) =>
            setAdminInfo({ ...adminInfo, callNumber: e.target.value })
          }
        />

        <label style={{ color: "white" }}>البريد الإلكتروني:</label>
        <input
          style={{ color: "white" }}
          type="email"
          value={adminInfo.email || ""}
          onChange={(e) =>
            setAdminInfo({ ...adminInfo, email: e.target.value })
          }
        />

        <button type="submit" className="update-admin-button">
          تحديث المعلومات
        </button>
      </form>
    </div>
  );
}
