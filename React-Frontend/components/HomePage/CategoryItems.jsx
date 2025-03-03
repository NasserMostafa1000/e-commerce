import React from "react";
import "../../Styles/CategoryItem.css";
import { useNavigate } from "react-router-dom";

export default function Categories() {
  const navigate = useNavigate();
  const handleSearch = (query) => {
    navigate("/FindProducts", { state: { searchQuery: query } });
  };
  return (
    <div className="Categories-container">
      <h1 className="Categories-title">ماذا تبحث عن؟</h1>
      <div className="Categories-items">
        {/* العنصر الأول */}
        <div className="Category-item" onClick={() => handleSearch("أحذية")}>
          <div className="Category-name">تسوق أحدث موديلات الأحذية</div>
          <img
            className="Category-image"
            src="/ProjectImages/shoes.jpg"
            alt="Shoes"
          />
        </div>
        {/* العنصر الثاني */}
        <div className="Category-item" onClick={() => handleSearch("مطبخ")}>
          <div className="Category-name">أدوات المطبخ</div>
          <img
            className="Category-image"
            src="/ProjectImages\Kitchen tools.jpg"
            alt="Kitchen Tools"
          />
        </div>
        {/* يمكنك إضافة المزيد من العناصر بنفس النمط */}
      </div>
    </div>
  );
}
