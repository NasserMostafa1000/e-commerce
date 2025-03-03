import React, { useState, useEffect } from "react";
import API_BASE_URL from "../Constant"; // تأكد من ضبط المسار الصحيح
import "../../Styles/ContactUs.css"; // ملف التنسيق الخاص بالمكون
import { FaWhatsapp, FaPhone, FaEnvelope } from "react-icons/fa";

export default function ContactUs() {
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
      {/* قسم "من نحن" */}
      <section className="about-section">
        <h2 className="about-title">من نحن</h2>
        <p className="about-description">
          مرحباً بكم في موقعنا الإلكتروني، المنصة الرائدة للتجارة الإلكترونية
          التي تجمع بين الجودة والابتكار لتلبية كافة احتياجاتكم. نهدف إلى تقديم
          تجربة تسوق متكاملة ومميزة من خلال توفير منتجات عالية الجودة، خدمة
          عملاء احترافية، وخيارات دفع متعددة. انضموا إلينا واكتشفوا عالم التسوق
          الإلكتروني كما لم تعرفوه من قبل!
        </p>
      </section>

      {/* قسم "تواصل معنا" */}
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
