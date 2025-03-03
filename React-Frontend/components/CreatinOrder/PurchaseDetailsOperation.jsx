import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet"; // استيراد Helmet لضبط SEO
import { useLocation, useNavigate } from "react-router-dom";
import API_BASE_URL from "../../Components/Constant.js";
import "../../Styles/PurchaseOperationDetails.css";
import getDeliveryDate from "../utils.js";
import AddressSelector from "./AddressSelector.jsx";
import PhoneNumberModal from "./PhoneModel.jsx";
import OrderSummary from "./PurchaseSummray.jsx";
import OrderActions from "./PurchasesAction.jsx";
import {
  fetchAddresses,
  fetchShipOrderInfo,
  fetchClientPhone,
  postOrder,
  postOrderDetails,
  PostListOfOrdersDetails,
} from "./api.js";
import ContactUs from "../../Components/Contact_About/ContactUsCom.jsx";
import WebSiteLogo from "../../../public/WebsiteLogo/WebsiteLogo.jsx";
import SuccessForm from "./SuccessForm.jsx"; // استيراد النموذج

export default function PurchaseOperationDetails() {
  const [addresses, setAddresses] = useState({});
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [AdminTransactionNum, SetAdminTransactionNum] = useState("");
  const [UserTransactionNum, SetUserTransactionNum] = useState("");
  const [ShipPrice, SetShiPrice] = useState(0);
  const [clientPhone, setClientPhone] = useState("");
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [transactionImage, setTransactionImage] = useState(null);
  const [newAddress, setNewAddress] = useState({
    governorate: "",
    city: "",
    street: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("online"); // "online" أو "cod"
  const [loading, setLoading] = useState(true);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [message, setMessage] = useState(""); // رسالة الحالة أو الخطأ
  const [showSuccessForm, setShowSuccessForm] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const Products = location.state?.Product;

  // التحقق من تعطيل زر الشراء
  const isBuyDisabled =
    (!UserTransactionNum && paymentMethod === "online") ||
    (!transactionImage && paymentMethod === "online") ||
    Object.keys(addresses).length === 0;

  useEffect(() => {
    const _fetchAddresses = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const Jsonresponse = await fetchAddresses(token);
        const fetchedAddresses = Jsonresponse.addresses;
        if (Object.keys(fetchedAddresses).length > 0) {
          setAddresses(fetchedAddresses);
          setSelectedAddressId(Object.keys(fetchedAddresses)[0]);
        }
      } catch (error) {
        console.error("Error fetching addresses:", error.message);
      }
    };
    _fetchAddresses();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [message]);

  useEffect(() => {
    const _fetchShipOrderInfo = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!addresses[selectedAddressId]) return;
        const Governorate = addresses[selectedAddressId].split("-")[0];
        const JsonResponse = await fetchShipOrderInfo(token, Governorate);
        SetAdminTransactionNum(JsonResponse.transactionNumber);
        SetShiPrice(JsonResponse.shipPrice);
      } catch (error) {
        console.error(error.message);
      }
    };
    _fetchShipOrderInfo();
  }, [selectedAddressId, addresses]);

  useEffect(() => {
    const _fetchClientPhone = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const JsonResponse = await fetchClientPhone(token);
        setClientPhone(JsonResponse.phoneNumber);
      } catch (error) {
        setShowPhoneModal(true);
      } finally {
        setLoading(false);
      }
    };
    _fetchClientPhone();
  }, []);

  function CreateOrderDetails(OrderId) {
    return {
      productDetailsId: Products.productDetailsId,
      quantity: Products.quantity,
      unitPrice: Products.unitPrice,
      orderId: OrderId,
    };
  }

  async function HandleBuyClick() {
    setPurchaseLoading(true);
    const token = sessionStorage.getItem("token");
    const totalPrice =
      Array.isArray(Products) && Products.length > 0
        ? Products.reduce(
            (sum, product) => sum + product.unitPrice * product.quantity,
            0
          )
        : Products.unitPrice * Products.quantity;

    const orderData = {
      address: addresses[selectedAddressId],
      totalPrice: totalPrice,
      ShippingCoast: ShipPrice,
      paymentMethodId: paymentMethod === "cod" ? 2 : 1,
      transactionNumber:
        paymentMethod === "online" ? UserTransactionNum.toString() : "",
    };

    try {
      const OrderId = await postOrder(token, orderData);
      if (Array.isArray(Products) && Products.length > 1) {
        await PostListOfOrdersDetails(OrderId, token, Products);
      } else {
        const orderDetails = CreateOrderDetails(OrderId);
        if (orderDetails) {
          await postOrderDetails(token, OrderId, orderDetails);
        }
      }
      setMessage(
        "✅ تم الطلب بنجاح! يمكنك متابعة طلبك في قسم طلباتي، ولأي خدمة أخرى يمكنك التواصل مع الدعم الفني من خلال قسم تواصل معنا"
      );
      // عرض نموذج النجاح
      setShowSuccessForm(true);
    } catch (error) {
      console.error("❌ خطأ أثناء إتمام الطلب:", error);
      setMessage("❌ حدث خطأ أثناء إتمام الطلب. الرجاء المحاولة مرة أخرى.");
    } finally {
      setPurchaseLoading(false);
    }
  }

  if (loading) return <div>جاري التحميل...</div>;

  return (
    <div className="container purchase-container" style={{ width: "100%" }}>
      <Helmet>
        <title>تفاصيل الطلب | سوق البلد</title>
        <meta
          name="description"
          content="تفاصيل الطلب في موقع سوق البلد. تابع طلبك وتواصل مع الدعم الفني."
        />
      </Helmet>

      {/* عرض نموذج النجاح إذا كانت الرسالة تظهر */}
      {showSuccessForm && (
        <SuccessForm
          message={message}
          onClose={() => setShowSuccessForm(false)}
        />
      )}

      {/* عرض رسالة الحالة أو الخطأ في أعلى الصفحة */}
      {message && !showSuccessForm && (
        <div
          className={`global-message ${
            message.startsWith("✅") ? "success" : "error"
          }`}
        >
          {message}
        </div>
      )}

      <h1 className="title" style={{ color: "black", textAlign: "center" }}>
        تفاصيل الطلب
      </h1>

      <AddressSelector
        addresses={addresses}
        selectedAddressId={selectedAddressId}
        setSelectedAddressId={setSelectedAddressId}
        setShowAddAddressModal={setShowAddAddressModal}
        showAddAddressModal={showAddAddressModal}
        newAddress={newAddress}
        setNewAddress={setNewAddress}
        setAddresses={setAddresses}
      />

      <a
        onClick={() => setShowPhoneModal(true)}
        style={{
          color: "white",
          textDecoration: "underline",
          cursor: "pointer",
        }}
      >
        هاتفك للاتصال: {clientPhone}
      </a>

      <h1 className="title" style={{ color: "black", textAlign: "center" }}>
        تفاصيل الشحنة
      </h1>
      <OrderSummary Products={Products} ShipPrice={ShipPrice} />

      <h4>شحن إلى: {addresses[selectedAddressId]}</h4>
      <h4>
        الموعد النهائي للاستلام: <strong>{getDeliveryDate()}</strong>
      </h4>

      <div className="payment-method-selection">
        <h3 className="payment-title">طرق الدفع</h3>
        <label>
          <input
            type="radio"
            style={{ direction: "ltr" }}
            value="online"
            checked={paymentMethod === "online"}
            onChange={() => setPaymentMethod("online")}
          />
          الدفع الإلكتروني
        </label>
        {paymentMethod === "online" && (
          <div className="payment-icons">
            <img
              src="/Icons\فودافون.ico"
              alt="Vodafone Cash"
              title="Vodafone Cash"
            />
            <img
              src="/Icons\ايقونه-اتصالات.ico"
              alt="Etisalat Cash"
              title="Etisalat Cash"
            />
            <img
              src="/Icons\ايقونه-اورانج.ico"
              alt="Orange Cash"
              title="Orange Cash"
            />
            <div className="transaction-info">
              <strong>
                يجب تحويل المبلغ المستحق هنا: {AdminTransactionNum}
              </strong>
            </div>
          </div>
        )}
        <label>
          <input
            style={{ direction: "ltr" }}
            type="radio"
            value="cod"
            checked={paymentMethod === "cod"}
            onChange={() => setPaymentMethod("cod")}
          />
          الدفع عند الاستلام
        </label>
        {paymentMethod === "cod" && (
          <div className="payment-icons">
            <img
              src="/Icons\الدفع-عند-الاستلام.ico"
              alt="Cash on Delivery"
              title="Cash on Delivery"
            />
          </div>
        )}
      </div>

      {paymentMethod === "online" && (
        <OrderActions
          UserTransactionNum={UserTransactionNum}
          SetUserTransactionNum={SetUserTransactionNum}
          setTransactionImage={setTransactionImage}
        />
      )}
      {paymentMethod === "online" && (
        <>
          <h2 style={{ color: "red" }}>ملحوظة</h2>
          <p>
            يجب تحويل المبلغ المستحق بالكامل إلى هذا الرقم قبل الضغط على زر شراء{" "}
            <span>
              <strong>" {AdminTransactionNum} "</strong>
            </span>{" "}
            وإن كان المبلغ المستحق أقل أو أكثر من المطلوب فسيتم رد الأموال
            تلقائيًا على نفس الرقم في غضون 24 ساعة.
          </p>
        </>
      )}

      {showPhoneModal && (
        <PhoneNumberModal
          setShowPhoneModal={setShowPhoneModal}
          setClientPhone={setClientPhone}
          newPhoneNumber={newPhoneNumber}
          setNewPhoneNumber={setNewPhoneNumber}
        />
      )}

      {!isBuyDisabled && (
        <button
          className="save-btn"
          onClick={HandleBuyClick}
          disabled={isBuyDisabled}
          style={{ background: isBuyDisabled ? "grey" : "green" }}
        >
          شراء
        </button>
      )}

      {purchaseLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
}
