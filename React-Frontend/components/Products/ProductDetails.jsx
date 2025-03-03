import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import API_BASE_URL from "../../Components/Constant.js";
import "../../Styles/productDetails.css";
import BtnAddToCart from "../Cart/BtnAddToCart.jsx";
import getDeliveryDate from "../utils.js";

export default function ProductDetails() {
  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();

  // إذا تم تمرير المنتج عبر state نستخدمه، وإلا نبدأ بـ null
  const [product, setProduct] = useState(location.state?.product || null);
  const [Img, setImg] = useState("");
  const [loading, setLoading] = useState(!product);
  const [Colors, setColors] = useState([]);
  const [DetailsId, setDetailsId] = useState(0);
  const [CurrentColor, setCurrentColor] = useState("");
  const [Sizes, setSizes] = useState([]);
  const [CurrentSize, setCurrentSize] = useState("");
  const [availableQuantity, setAvailableQuantity] = useState(0);
  const [Quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  // جلب بيانات المنتج إذا لم يتم تمريرها عبر location.state
  useEffect(() => {
    if (!product) {
      const fetchProduct = async () => {
        setLoading(true);
        try {
          const response = await fetch(
            `${API_BASE_URL}Product/GetProductById?ID=${Number(id)}`
          );
          if (!response.ok) throw new Error("Network response was not ok");
          const data = await response.json();
          setProduct(data);
          setAvailableQuantity(data.quantity);
          setDetailsId(data.productDetailsId);
          setImg(data.productImage);
        } catch (error) {
          console.error("Error fetching product:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    } else {
      setImg(product?.productImage || "");
      setLoading(false);
    }
  }, [id, product]);

  const GetDetailsOfCurrentSizeAndColor = async () => {
    if (!product) return;
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}Product/GetDetailsBy?ProductId=${Number(
          product?.productId
        )}&ColorName=${CurrentColor}&SizeName=${CurrentSize}`
      );
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setAvailableQuantity(data.quantity);
      setDetailsId(data.productDetailsId);
      setImg(data.image);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [message]);

  function CurrentProduct() {
    const Price =
      product?.discountPercentage === 0
        ? product?.productPrice
        : product?.priceAfterDiscount;
    return {
      productDetailsId: DetailsId,
      quantity: Quantity,
      unitPrice: Price,
      totalPrice: Price * Quantity,
    };
  }

  const handlBuyClick = () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      setMessage("يجب تسجيل الدخول لمتابعة عملية الشراء.");
      setRedirecting(true);
      setTimeout(() => {
        navigate("/login");
      }, 5000);
      return;
    }
    const Product = CurrentProduct();
    navigate("/PurchaseDetails", { state: { Product } });
  };

  useEffect(() => {
    if (!product) return;

    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}Product/GetProductDetailsById?Id=${product?.productId}`
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setCurrentColor(data.color);
        setDetailsId(data.productDetailsId);
        setCurrentSize(data.size);
        setAvailableQuantity(data.quantity);
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchColorsAndSizes = async () => {
      try {
        const sizesResponse = await fetch(
          `${API_BASE_URL}Product/GetSizesByProductId?productId=${product?.productId}`
        );
        if (!sizesResponse.ok) throw new Error("Network response was not ok");
        const sizesData = await sizesResponse.json();
        setSizes(sizesData);
        if (sizesData.length === 1) setCurrentSize(sizesData[0]);

        const colorsResponse = await fetch(
          `${API_BASE_URL}Product/GetColorsByProductId?productId=${product?.productId}`
        );
        if (!colorsResponse.ok) throw new Error("Network response was not ok");
        const colorsData = await colorsResponse.json();
        setColors(colorsData);
        if (colorsData.length === 1) setCurrentColor(colorsData[0]);
      } catch (error) {
        console.error("Error fetching colors and sizes:", error);
      }
    };

    fetchProducts();
    fetchColorsAndSizes();
  }, [product]);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!CurrentSize) return;
      setLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}Product/GetColorsBelongsToSpecificSize?ProductId=${product?.productId}&SizeName=${CurrentSize}`
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setColors(data);
        if (data.length === 1) setCurrentColor(data[0]);
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [CurrentSize]);

  useEffect(() => {
    if (CurrentColor) {
      GetDetailsOfCurrentSizeAndColor();
    }
  }, [CurrentSize, CurrentColor]);
  const handleBackToHome = () => {
    navigate("/"); // يقوم بالانتقال إلى الصفحة الرئيسية مباشرة
  };
  if (loading) return <div>جاري التحميل...</div>;

  const availability = (
    <div className={availableQuantity === 0 ? "out-of-stock" : "in-stock"}>
      {availableQuantity === 0 ? (
        <span style={{ color: "red" }}>غير متوفر حالياً</span>
      ) : (
        <>
          <span style={{ color: "green" }}>متوفر</span>
          <span style={{ color: availableQuantity < 10 ? "red" : "green" }}>
            ({availableQuantity} قطعة)
          </span>
        </>
      )}
    </div>
  );

  return (
    <div className="product-details-wrapper">
      <Helmet>
        <title>{product?.productName || "منتج"} | سوق البلد</title>
        <meta
          name="description"
          content={`تفاصيل المنتج ${
            product?.productName || ""
          } مع معلومات الكمية والتفاصيل الأخرى.`}
        />
        {/* Open Graph meta tags */}
        <meta property="og:title" content={product?.productName || "منتج"} />
        <meta
          property="og:description"
          content={`تفاصيل المنتج ${
            product?.productName || ""
          } مع معلومات الكمية والتفاصيل الأخرى.`}
        />
        <meta
          property="og:image"
          content={`https://souqelbald-001-site1.ptempurl.com${Img}`} // تأكد من أن الرابط صحيح للصورة
        />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="product" />

        {/* Twitter meta tags */}
        <meta name="twitter:title" content={product?.productName || "منتج"} />
        <meta
          name="twitter:description"
          content={`تفاصيل المنتج ${
            product?.productName || ""
          } مع معلومات الكمية والتفاصيل الأخرى.`}
        />
        <meta
          name="twitter:image"
          content={`https://souqelbald-001-site1.ptempurl.com/${Img}`} // تأكد من أن الرابط صحيح للصورة
        />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {availableQuantity > 0 && (
        <>
          <div>
            {/* زر للرجوع إلى الصفحة الرئيسية */}
            <button onClick={handleBackToHome}>
              الرجوع إلى الصفحة الرئيسية
            </button>
          </div>
          <BtnAddToCart productDetailsId={DetailsId} Quantity={Quantity} />
          {message && (
            <div
              className="fixed-message"
              style={{ backgroundColor: "red", color: "black" }}
            >
              {message}
            </div>
          )}
        </>
      )}

      <div className="image-container">
        <img
          src={`https://souqelbald-001-site1.ptempurl.com/${Img}`}
          alt={product?.productName}
          className="product-img"
        />
      </div>

      <div className="product-info-wrapper">
        <h2>اسم المنتج: {product?.productName}</h2>
        <span style={{ color: "black" }}>
          سعر المنتج:{" "}
          {product?.discountPercentage === 0
            ? product?.productPrice
            : product?.priceAfterDiscount}{" "}
          جنيه
        </span>
        {availability}
        <div className="product-info-text">
          <div>
            اللون:
            {Colors.length === 1 ? (
              <span style={{ fontWeight: "bold", marginLeft: "5px" }}>
                {CurrentColor}
              </span>
            ) : (
              <select
                value={CurrentColor}
                onChange={(e) => setCurrentColor(e.target.value)}
              >
                {Colors.map((color, index) => (
                  <option key={index} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            )}
          </div>
          {Sizes.length > 0 && (
            <div>
              المقاس:
              {Sizes.length === 1 ? (
                <span style={{ fontWeight: "bold", marginLeft: "5px" }}>
                  {CurrentSize}
                </span>
              ) : (
                <select
                  value={CurrentSize}
                  onChange={(e) => setCurrentSize(e.target.value)}
                >
                  {Sizes.map((size, index) => (
                    <option key={index} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}
          <div>
            الكمية:
            <input
              type="number"
              min="1"
              max={availableQuantity}
              value={Quantity}
              onChange={(e) =>
                setQuantity(Math.min(e.target.value, availableQuantity))
              }
            />
          </div>
          <div>تفاصيل: {product?.moreDetails || "لا توجد تفاصيل إضافية"}</div>
        </div>
      </div>

      {availableQuantity > 0 && (
        <div className="cart-actions">
          <button className="buy-now-button" onClick={handlBuyClick}>
            شراء الآن
          </button>
        </div>
      )}
    </div>
  );
}
