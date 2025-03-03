import React, { useState, useEffect } from "react";
import {
  FiShoppingCart,
  FiMenu,
  FiX,
  FiChevronDown,
  FiPhone,
  FiInfo,
  FiChevronUp,
  // لإيقونة "شروط الاستخدام"
  FiUser, // لإيقونة الملف الشخصي
  FiBox, // لإيقونة المنتجات
  FiClipboard, // لإيقونة الطلبات
  FiUsers, // لإيقونة العملاء
  FiTruck, // لإيقونة أسعار الشحن
  FiTool, // لإيقونة المديرين
  FiSettings, // لإيقونة معلومات الموقع
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar.jsx";
import "../../Styles/NavBar.css";
import { getRoleFromToken } from "../utils.js";
import API_BASE_URL from "../Constant.js";
import WebSiteLogo from "../../../public/WebsiteLogo/WebsiteLogo.jsx";

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
}

export default function NavBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(true);
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const currentRole = getRoleFromToken(token);

  // دالة البحث عن الأقسام
  const HandleSearhOn = (query) => {
    navigate("/FindProducts", { state: { searchQuery: query } });
  };

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
    }

    const fetchCartDetails = async () => {
      if (!token) return;
      try {
        const response = await fetch(`${API_BASE_URL}Carts/GetCartCount`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        if (data) {
          setCartCount(data);
        }
      } catch (error) {
        console.error("Error fetching cart details:", error.message);
      }
    };

    if (currentRole === "User") {
      fetchCartDetails();
    }
  }, [token, currentRole]);

  const HandleCartClick = () => {
    if (sessionStorage.getItem("token")) {
      navigate("/Cart");
    } else {
      navigate("/login");
    }
  };

  const handleLoginLogout = () => {
    if (isLoggedIn) {
      sessionStorage.removeItem("token");
      setIsLoggedIn(false);
      window.location.reload();
    } else {
      navigate("/login");
    }
  };

  return (
    <nav className="bg-gray-900 text-white p-4 shadow-lg">
      <div
        className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4"
        style={{ backgroundColor: "inherit" }}
      >
        <div className="flex justify-between items-center w-full md:w-auto gap-4 flex-shrink-0">
          <div className="top-bar">
            <div>
              <WebSiteLogo width={200} height={70} />
            </div>
            <div className="logo" onClick={() => navigate("/")}>
              سوق البلد
            </div>
            {currentRole === "User" && (
              <div className="cart-icon" onClick={HandleCartClick}>
                <FiShoppingCart size={24} />
                {cartCount > 0 && (
                  <span className="cart-count">{cartCount}</span>
                )}
              </div>
            )}
            <div className="text-lg font-bold" style={{ float: "right" }}>
              <button
                onClick={handleLoginLogout}
                className="px-3 py-1 text-sm rounded text-white bg-blue-500"
                style={{ backgroundColor: isLoggedIn ? "red" : "green" }}
              >
                {isLoggedIn ? "تسجيل خروج" : "تسجيل دخول"}
              </button>
            </div>
            <div className="menu-button" onClick={() => setMenuOpen(!menuOpen)}>
              <FiMenu size={24} />
            </div>
          </div>
        </div>
        <SearchBar onSearch={HandleSearhOn} searchType="products" />
      </div>

      {menuOpen && (
        <div className={`sidebar ${menuOpen ? "open" : ""}`}>
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => setMenuOpen(false)}
              style={{ backgroundColor: "red" }}
            >
              <FiX size={24} />
            </button>
          </div>

          <ul className="sidebar-links" style={{ direction: "rtl" }}>
            {currentRole === "Admin" && (
              <>
                <li>
                  <Link
                    to="/MyProfile"
                    className="sidebar-link"
                    onClick={() => setMenuOpen(false)}
                  >
                    <FiUser size={18} style={{ marginLeft: "5px" }} />
                    الملف الشخصي
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admins/AddProduct"
                    className="sidebar-link"
                    onClick={() => setMenuOpen(false)}
                  >
                    <FiBox size={18} style={{ marginLeft: "5px" }} />
                    المنتجات
                  </Link>
                </li>
                <li>
                  <Link
                    to="/Admin/Orders"
                    className="sidebar-link"
                    onClick={() => setMenuOpen(false)}
                  >
                    <FiClipboard size={18} style={{ marginLeft: "5px" }} />
                    الطلبات
                  </Link>
                </li>
                <li>
                  <Link
                    to="/Admin/Clients"
                    className="sidebar-link"
                    onClick={() => setMenuOpen(false)}
                  >
                    <FiUsers size={18} style={{ marginLeft: "5px" }} />
                    العملاء
                  </Link>
                </li>
                <li>
                  <Link
                    to="/Admin/shipping-prices"
                    className="sidebar-link"
                    onClick={() => setMenuOpen(false)}
                  >
                    <FiTruck size={18} style={{ marginLeft: "5px" }} />
                    أسعار الشحن
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admins/Managers"
                    className="sidebar-link"
                    onClick={() => setMenuOpen(false)}
                  >
                    <FiTool size={18} style={{ marginLeft: "5px" }} />
                    المديرين
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/UpdateAdminInfo"
                    className="sidebar-link"
                    onClick={() => setMenuOpen(false)}
                  >
                    <FiSettings size={18} style={{ marginLeft: "5px" }} />
                    معلومات الموقع
                  </Link>
                </li>
              </>
            )}

            {isLoggedIn ? (
              <>
                {/* روابط للمستخدم العادي */}
                {currentRole === "User" && (
                  <>
                    <li>
                      <Link
                        to="/MyProfile"
                        className="sidebar-link"
                        onClick={() => setMenuOpen(false)}
                      >
                        <FiUser size={18} style={{ marginLeft: "5px" }} />
                        الملف الشخصي
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/MyPurchases"
                        className="sidebar-link"
                        onClick={() => setMenuOpen(false)}
                      >
                        <FiClipboard size={18} style={{ marginLeft: "5px" }} />
                        طلباتي
                      </Link>
                    </li>
                    <li>
                      <div
                        onClick={() => setIsSubMenuOpen(!isSubMenuOpen)}
                        className="sidebar-link flex justify-between items-center cursor-pointer"
                      >
                        <span>
                          <FiBox size={18} style={{ marginLeft: "5px" }} />
                          الاقسام
                        </span>
                        {isSubMenuOpen ? (
                          <FiChevronUp size={18} />
                        ) : (
                          <FiChevronDown size={18} />
                        )}
                      </div>
                      {isSubMenuOpen && (
                        <ul className="submenu">
                          <li>
                            <a
                              onClick={() => HandleSearhOn("ملابس")}
                              className="sidebar-link"
                            >
                              ملابس
                            </a>
                          </li>
                          <li>
                            <a
                              onClick={() => HandleSearhOn("أحذية")}
                              className="sidebar-link"
                            >
                              أحذية
                            </a>
                          </li>
                          <li>
                            <a
                              onClick={() => HandleSearhOn("ساعات")}
                              className="sidebar-link"
                            >
                              ساعات
                            </a>
                          </li>
                          <li>
                            <a
                              onClick={() => HandleSearhOn("مطبخ")}
                              className="sidebar-link"
                            >
                              مطبخ
                            </a>
                          </li>
                          <li>
                            <a
                              onClick={() => HandleSearhOn("سيارات")}
                              className="sidebar-link"
                            >
                              سيارات
                            </a>
                          </li>
                        </ul>
                      )}
                    </li>
                  </>
                )}

                {/* روابط خاصة بالإدارة بناءً على الدور */}

                {currentRole === "Manager" && (
                  <>
                    <li>
                      <Link
                        to="/admins/AddProduct"
                        className="sidebar-link"
                        onClick={() => setMenuOpen(false)}
                      >
                        <FiBox size={18} style={{ marginLeft: "5px" }} />
                        المنتجات
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/Admin/Orders"
                        className="sidebar-link"
                        onClick={() => setMenuOpen(false)}
                      >
                        <FiClipboard size={18} style={{ marginLeft: "5px" }} />
                        الطلبات
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/Admin/shipping-prices"
                        className="sidebar-link"
                        onClick={() => setMenuOpen(false)}
                      >
                        <FiTruck size={18} style={{ marginLeft: "5px" }} />
                        أسعار الشحن
                      </Link>
                    </li>
                  </>
                )}

                {currentRole === "Shipping Manager" && (
                  <>
                    <li>
                      <Link
                        to="/Admin/Orders"
                        className="sidebar-link"
                        onClick={() => setMenuOpen(false)}
                      >
                        <FiClipboard size={18} style={{ marginLeft: "5px" }} />
                        الطلبات
                      </Link>
                    </li>
                  </>
                )}
              </>
            ) : (
              <>
                <li>
                  <div
                    onClick={() => setIsSubMenuOpen(!isSubMenuOpen)}
                    className="sidebar-link flex justify-between items-center cursor-pointer"
                  >
                    <span>
                      <FiBox size={18} style={{ marginLeft: "5px" }} />
                      الاقسام
                    </span>
                    {isSubMenuOpen ? (
                      <FiChevronUp size={18} />
                    ) : (
                      <FiChevronDown size={18} />
                    )}
                  </div>
                  {isSubMenuOpen && (
                    <ul className="submenu">
                      <li>
                        <a
                          onClick={() => HandleSearhOn("ملابس")}
                          className="sidebar-link"
                        >
                          ملابس
                        </a>
                      </li>
                      <li>
                        <a
                          onClick={() => HandleSearhOn("أحذية")}
                          className="sidebar-link"
                        >
                          أحذية
                        </a>
                      </li>
                      <li>
                        <a
                          onClick={() => HandleSearhOn("ساعات")}
                          className="sidebar-link"
                        >
                          ساعات
                        </a>
                      </li>
                      <li>
                        <a
                          onClick={() => HandleSearhOn("مطبخ")}
                          className="sidebar-link"
                        >
                          مطبخ
                        </a>
                      </li>
                      <li>
                        <a
                          onClick={() => HandleSearhOn("سيارات")}
                          className="sidebar-link"
                        >
                          سيارات
                        </a>
                      </li>
                    </ul>
                  )}
                </li>
              </>
            )}
            <li>
              <Link
                to={{
                  pathname: "/about-us",
                }}
                state={{ scrollToBottom: true }}
                className="sidebar-link"
                onClick={() => setMenuOpen(false)}
              >
                <FiInfo size={18} style={{ marginLeft: "5px" }} />
                من نحن
              </Link>
            </li>
            <li>
              <Link
                to={{
                  pathname: "/contact",
                }}
                state={{ scrollToBottom: true }}
                className="sidebar-link"
                onClick={() => setMenuOpen(false)}
              >
                <FiPhone size={18} style={{ marginLeft: "5px" }} /> التواصل
              </Link>
            </li>
            <li>
              <Link
                to={{
                  pathname: "/",
                }}
                state={{ scrollToBottom: true }}
                className="sidebar-link"
                onClick={() => setMenuOpen(false)}
              >
                تكلم معنا الأن
              </Link>
            </li>
            <li>
              <Link
                to="/terms"
                className="sidebar-link"
                onClick={() => setMenuOpen(false)}
              >
                <FiInfo size={18} style={{ marginLeft: "5px" }} />
                سياسه الخصوصيه والشروط
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
