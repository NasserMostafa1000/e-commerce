import React, { useEffect, useState } from "react";
import API_BASE_URL from "../../Constant";

const ShippingInfo = () => {
  const [shippingData, setShippingData] = useState([]);
  const [selectedGovernorate, setSelectedGovernorate] = useState("");
  const [newPrice, setNewPrice] = useState("");

  // جلب بيانات الشحن من API باستخدام fetch
  useEffect(() => {
    const fetchShippingData = async () => {
      try {
        const token = sessionStorage.getItem("token"); // جلب التوكن من التخزين المحلي

        const response = await fetch(
          `${API_BASE_URL}ShippingInfo/GetShippingInfo`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // ⬅️ إرسال التوكن هنا
            },
          }
        );

        if (!response.ok) throw new Error("فشل جلب البيانات");

        const data = await response.json();
        setShippingData(data);
      } catch (error) {
        console.error("حدث خطأ أثناء جلب البيانات:", error);
      }
    };

    fetchShippingData();
  }, []);

  // تحديث السعر باستخدام fetch
  const handleUpdatePrice = async () => {
    if (!selectedGovernorate || newPrice.trim() === "" || isNaN(newPrice)) {
      alert("يرجى اختيار المحافظة وإدخال سعر صالح!");
      return;
    }

    const priceValue = parseFloat(newPrice);

    if (priceValue <= 0) {
      alert("يجب أن يكون السعر أكبر من 0!");
      return;
    }

    const token = sessionStorage.getItem("token"); // جلب التوكن من التخزين المحلي

    try {
      const response = await fetch(
        `${API_BASE_URL}ShippingInfo/UpdateShippingPrice/?Governorate=${selectedGovernorate}&NewPrice=${Number(
          priceValue
        )}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: `Bearer ${token}`, // ⬅️ إرسال التوكن هنا
          },
        }
      );

      const responseData = await response.json();
      console.log("✅ استجابة API:", responseData);

      if (!response.ok) throw new Error("فشل تحديث السعر");

      // تحديث البيانات بعد التعديل
      setShippingData((prevData) =>
        prevData.map((item) =>
          item.governorate === selectedGovernorate
            ? { ...item, price: priceValue }
            : item
        )
      );

      alert("تم تحديث السعر بنجاح!");
    } catch (error) {
      console.error("❌ خطأ أثناء تحديث السعر:", error);
      alert("فشل التحديث، حاول مرة أخرى!");
    }
  };

  return (
    <div className="shipping-container">
      <h2 style={{ textAlign: "center" }}>🛒 أسعار الشحن</h2>
      <h3>✏️ تحديث السعر</h3>
      <select
        value={selectedGovernorate}
        onChange={(e) => setSelectedGovernorate(e.target.value)}
      >
        <option value="">اختر المحافظة</option>
        {shippingData.map((item) => (
          <option key={item.id} value={item.governorate}>
            {item.governorate}
          </option>
        ))}
      </select>
      <input
        type="number"
        placeholder="أدخل السعر الجديد"
        value={newPrice}
        onChange={(e) => setNewPrice(e.target.value)}
      />
      <button onClick={handleUpdatePrice}>تحديث السعر</button>
      <table>
        <thead>
          <tr>
            <th>السعر (جنيه)</th>
            <th>المحافظة</th>
          </tr>
        </thead>
        <tbody>
          {shippingData.map((item) => (
            <tr key={item.id} style={{ color: "black" }}>
              <td>{item.price} جنيه</td>
              <td>{item.governorate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShippingInfo;
