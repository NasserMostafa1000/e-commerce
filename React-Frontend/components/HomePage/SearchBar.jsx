import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import "../../Styles/NavBar.css";

export default function SearchBar({ onSearch, searchType = "products" }) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="search-bar-container">
      {/* حقل الإدخال */}
      <input
        type="text"
        placeholder={
          searchType === "products" ? " ماذا تبحث عن " : "ابحث برقم الطلب"
        }
        className="search-input"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <FiSearch
        size={22}
        className="search-icon"
        onClick={() => onSearch(searchQuery)}
      />
    </div>
  );
}
