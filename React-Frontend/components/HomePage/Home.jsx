import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "./Nav";
import ProductItem from "../Products/ProductItem.jsx";
import API_BASE_URL from "../Constant.js";
import CategoryItems from "./CategoryItems.jsx";
import "../../Styles/Home.css";
import { getRoleFromToken } from "../utils.js";
import ContactUs from "./ContactUs.jsx";
import WebSiteLogo from "../../../public/WebsiteLogo/WebsiteLogo.jsx";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [clothesProducts, setClothesProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingClothes, setLoadingClothes] = useState(false);
  const [clothesLoaded, setClothesLoaded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // جلب المنتجات مع خصومات
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}Product/GetDiscountProducts`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching discount products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (location.state && location.state.scrollToBottom) {
      location.state = null;
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [location]);

  // دالة جلب منتجات الملابس
  const fetchClothesProducts = () => {
    // التحقق من أن الطلب لم يتم بالفعل
    if (clothesLoaded) return;
    setClothesLoaded(true);
    setLoadingClothes(true);
    fetch(`${API_BASE_URL}Product/GetProductsWhereInClothesCategory`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        setClothesProducts(data);
      })
      .catch((error) => {
        console.error("Error fetching clothes products:", error);
      })
      .finally(() => {
        setLoadingClothes(false);
      });
  };

  // استخدام onScroll على النافذة للتأكد من وصول المستخدم إلى نهاية الصفحة
  useEffect(() => {
    const handleScroll = () => {
      // يمكن تعديل القيمة حسب الحاجة
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 100
      ) {
        fetchClothesProducts();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [clothesLoaded]);

  function handleProductClick(product) {
    navigate(`/productDetails/${product.productId}`, { state: { product } });
  }

  if (loading) {
    return (
      <div
        style={{
          backgroundColor: "grey",
          height: "100vh",
          display: "flex",
          flexDirection: "column", // ترتيب عمودي
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h2
          style={{
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            fontSize: "36px",
            color: "black",
            margin: "0 0 20px", // هامش سفلي للفصل بين النص واللوجو
          }}
        >
          سوق البلد يرحب بكم
        </h2>
        <WebSiteLogo width={200} height={100} />
      </div>
    );
  }

  return (
    <div>
      <Helmet>
        <title>الصفحه الرئيسيه - سوق البلد</title>
        <meta
          name="description"
          content="في سوق البلد يمكنك تسوق منتجات بأفضل جوده وأفضل ماركات عالميه يتحدث عنها البشر , مع خصومات تصل الي خمسون بالمائة"
        />
      </Helmet>
      <NavBar />
      <img
        src="/ProjectImages/Discounts.jpeg"
        alt="Discounts"
        style={{ width: "100%", height: "40vh" }}
      />

      <h1 className="discount-title">
        <span>%60</span> تسوق منتجات مع خصومات تصل إلى
      </h1>
      {/* قائمة المنتجات ذات الخصومات */}
      <div className="products-container">
        {products.map((product) => (
          <div
            onClick={() => handleProductClick(product)}
            key={product.productId}
          >
            <ProductItem
              product={product}
              CurrentRole={getRoleFromToken(sessionStorage.getItem("token"))}
            />
          </div>
        ))}
      </div>

      {/* يمكن عرض الأصناف هنا إن رغبت */}
      <CategoryItems />
      <h1 className="discount-title">تسوق احدث موديلات الملابس</h1>
      {/* عرض منتجات الملابس عند جلبها */}
      <div className="products-container">
        {loadingClothes ? (
          <p style={{ textAlign: "center" }}>جارٍ تحميل منتجات الملابس...</p>
        ) : clothesProducts.length > 0 ? (
          clothesProducts.map((product) => (
            <div
              onClick={() => handleProductClick(product)}
              key={product.productId}
            >
              <ProductItem
                product={product}
                CurrentRole={getRoleFromToken(sessionStorage.getItem("token"))}
              />
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center" }}>لا توجد منتجات للملابس حاليا.</p>
        )}
      </div>

      <ContactUs />
    </div>
  );
}
