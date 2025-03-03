import React, { useState, useEffect } from "react";
import API_BASE_URL from "../Constant"; // تأكد من ضبط المسار الصحيح
import "../../Styles/ContactUs.css"; // ملف التنسيق الخاص بالمكون
import { FaWhatsapp, FaPhone, FaEnvelope } from "react-icons/fa";
import { Helmet } from "react-helmet";

export default function ContactUsCom() {
  const [adminInfo, setAdminInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        setAdminInfo(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAdminInfo();
  }, []);

  return (
    <div className="about-contact-container">
      <Helmet>
        <title>صفحه التواصل - سوق البلد </title>
        <meta
          name="description"
          content="صفحه التواصل لموقع سوق البلد حيث يمكن للعملاء التواصل مع مالكين سوق البلد للرد علي كل استفسارتهم"
        />
      </Helmet>
      <section className="contact-section">
        <h2 className="contact-title">تواصل معنا</h2>
        {loading ? (
          <div className="contact-loading">جاري التحميل...</div>
        ) : error ? (
          <div className="contact-error">خطأ: {error}</div>
        ) : (
          <div className="contact-cards">
            {adminInfo.map((info, index) => (
              <div key={index} className="contact-card">
                <p>
                  <strong>واتساب:</strong>{" "}
                  {info.whatsAppNumber ? (
                    <a
                      href={`https://wa.me/${info.whatsAppNumber.replace(
                        /[^0-9]/g,
                        ""
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="whatsapp-link"
                    >
                      <FaWhatsapp size={24} style={{ marginRight: "8px" }} />
                      ارسل لنا رساله
                    </a>
                  ) : (
                    "غير متوفر"
                  )}
                </p>
                <p>
                  <strong>هاتف:</strong>{" "}
                  {info.callNumber ? (
                    <a
                      href={`tel:${info.callNumber.replace(/[^0-9]/g, "")}`}
                      className="phone-link"
                    >
                      <FaPhone size={24} style={{ marginRight: "8px" }} />
                      اتصل الأن
                    </a>
                  ) : (
                    "غير متوفر"
                  )}
                </p>
                <p>
                  {info.email}
                  {info.email ? (
                    <a href={`mailto:${info.email}`} className="email-link">
                      <FaEnvelope
                        size={24}
                        style={{ marginRight: "8px", direction: "ltr" }}
                      />
                    </a>
                  ) : (
                    "غير متوفر"
                  )}
                  <strong style={{ direction: "ltr" }}>
                    :البريد الالكتروني
                  </strong>{" "}
                </p>
              </div>
            ))}
          </div>
        )}
        <footer className="contact-footer">
          حقوق النشر © 2025 - جميع الحقوق محفوظة
        </footer>
      </section>
    </div>
  );
}
