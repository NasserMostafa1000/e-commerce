import { useState, useEffect } from "react";
import "../../Styles/MyProfile.css";
import API_BASE_URL from "../Constant";
import PhoneModal from "../../Components/CreateOrder/PhoneModel";
import { Helmet } from "react-helmet";
import {
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaLock,
  FaEnvelope,
} from "react-icons/fa";

export default function MyProfile() {
  const [client, setClient] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordUpdated, setPasswordUpdated] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");

  // جلب بيانات العميل
  useEffect(() => {
    fetch(`${API_BASE_URL}Clients/GetClientById`, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setClient(data);
        if (
          data.clientAddresses &&
          Object.keys(data.clientAddresses).length > 0
        ) {
          setSelectedAddress(Object.values(data.clientAddresses)[0]);
        }
      })
      .catch((err) => console.error("Error fetching client data:", err));
  }, []);

  // جلب بيانات المستخدم لمعرفة حالة كلمة المرور
  useEffect(() => {
    fetch(`${API_BASE_URL}Users/GetUserInfo`, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => setUserInfo(data))
      .catch((err) => console.error("Error fetching user data:", err));
  }, []);

  // تحديث الاسم في API
  const updateName = () => {
    fetch(
      `${API_BASE_URL}Clients/PutClientName?FirstName=${newFirstName}&LastName=${newLastName}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    )
      .then((res) => {
        if (res.ok) {
          setClient({
            ...client,
            firstName: newFirstName,
            lastName: newLastName,
          });
          setIsEditingName(false);
        } else {
          alert("حدث خطأ أثناء تحديث الاسم ❌");
        }
      })
      .catch(() => alert("حدث خطأ أثناء تحديث الاسم ❌"));
  };

  // تحديث كلمة المرور
  const updatePassword = () => {
    fetch(`${API_BASE_URL}Users/ChangePassword`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        email: userInfo.userName,
        currentPassword: userInfo.hashedPassword ? currentPassword : null,
        newPassword: newPassword,
      }),
    })
      .then(async (res) => {
        let jsonRes;
        try {
          const text = await res.text();
          jsonRes = text ? JSON.parse(text) : {};
        } catch (error) {
          console.error("Error parsing response:", error);
          jsonRes = {};
        }

        if (res.ok) {
          setPasswordUpdated("تم تغيير كلمة المرور بنجاح ✅");
          setCurrentPassword("");
          setNewPassword("");
          setTimeout(() => {
            setShowSecurityModal(false);
            setPasswordUpdated(null);
          }, 2000);
        } else {
          setPasswordUpdated(
            jsonRes.message || "حدث خطأ أثناء تحديث كلمة المرور ❌"
          );
        }
      })
      .catch((err) => {
        setPasswordUpdated("حدث خطأ أثناء تحديث كلمة المرور ❌");
      });
  };

  if (!client || !userInfo) return <p>Loading...</p>;

  return (
    <div className="container">
      <Helmet>
        <title>الملف الشخصي | سوق البلد</title>
        <meta
          name="description"
          content="عرض المعلومات الشخصية في موقع سوق البلد"
        />
      </Helmet>
      <h1 className="profile-title">الملف الشخصي</h1>

      {/* بطاقة المعلومات الشخصية */}
      <div className="card">
        <h3 className="card-title">
          <FaUser style={{ marginRight: "8px" }} />
          معلوماتك الشخصية
        </h3>
        <div className="card-content">
          <p>
            <strong className="label" onClick={() => setIsEditingName(true)}>
              الاسم:
            </strong>{" "}
            {isEditingName ? (
              <div className="edit-name-container">
                <input
                  type="text"
                  value={newFirstName}
                  onChange={(e) => setNewFirstName(e.target.value)}
                  placeholder="الاسم الأول"
                  className="edit-input"
                />
                <input
                  type="text"
                  value={newLastName}
                  onChange={(e) => setNewLastName(e.target.value)}
                  placeholder="اسم العائلة"
                  className="edit-input"
                />
                <div className="edit-buttons">
                  <button onClick={updateName} className="save-btn">
                    حفظ
                  </button>
                  <button
                    onClick={() => setIsEditingName(false)}
                    className="cancel-btn"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            ) : (
              <span
                className="clickable"
                onClick={() => {
                  setNewFirstName(client.firstName);
                  setNewLastName(client.lastName);
                  setIsEditingName(true);
                }}
              >
                {client.firstName} {client.lastName}
              </span>
            )}
          </p>
          <p>
            <strong className="label" onClick={() => setShowPhoneModal(true)}>
              <FaPhone style={{ marginRight: "8px" }} />
              رقم الهاتف:
            </strong>{" "}
            {client.phoneNumber ? (
              <span
                className="clickable"
                onClick={() => setShowPhoneModal(true)}
              >
                {client.phoneNumber}
              </span>
            ) : (
              <span
                className="clickable alert-text"
                onClick={() => setShowPhoneModal(true)}
              >
                لم تضع رقم هاتفك، سيتم طلبه عند الشراء.
              </span>
            )}
          </p>
        </div>
      </div>

      {/* بطاقة العناوين */}
      <div className="card">
        <h3 className="card-title">
          <FaMapMarkerAlt style={{ marginRight: "8px" }} />
          عناوينك
        </h3>
        <div className="card-content">
          {client.clientAddresses &&
          Object.keys(client.clientAddresses).length > 0 ? (
            <div className="address-selector">
              <select
                id="addressSelect"
                value={selectedAddress}
                onChange={(e) => setSelectedAddress(e.target.value)}
              >
                {Object.entries(client.clientAddresses).map(([id, address]) => (
                  <option key={id} value={address}>
                    {address}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <p className="info-text">
              لا يوجد عناوين متاحة لديك. سيتم طلب العنوان عند الشراء.
            </p>
          )}
        </div>
      </div>

      {/* بطاقة الأمان والخصوصية */}
      <div className="card">
        <h3 className="card-title">
          <FaLock style={{ marginRight: "8px" }} />
          الأمان والخصوصية
        </h3>
        <div className="card-content">
          <p>
            <FaEnvelope style={{ marginRight: "8px" }} />
            البريد الإلكتروني: {userInfo.userName}
          </p>
          <button
            onClick={() => setShowSecurityModal(true)}
            className="action-btn"
          >
            تغيير كلمة المرور
          </button>
        </div>
      </div>

      {showSecurityModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>تغيير كلمة المرور</h3>
            {userInfo.hashedPassword ? (
              <>
                <input
                  type="password"
                  placeholder="كلمة المرور الحالية"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </>
            ) : (
              <p className="alert-text">
                لم تقم بتعيين كلمة مرور، الرجاء إدخال كلمة مرور جديدة.
              </p>
            )}
            <input
              type="password"
              placeholder="كلمة المرور الجديدة"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button className="save-btn" onClick={updatePassword}>
              حفظ كلمة المرور
            </button>
            <button
              className="close-btn"
              onClick={() => setShowSecurityModal(false)}
            >
              إغلاق
            </button>
            {passwordUpdated && <p>{passwordUpdated}</p>}
          </div>
        </div>
      )}

      {showPhoneModal && (
        <PhoneModal
          newPhoneNumber={newPhoneNumber}
          setNewPhoneNumber={setNewPhoneNumber}
          setShowPhoneModal={setShowPhoneModal}
          setClientPhone={(phone) =>
            setClient({ ...client, phoneNumber: phone })
          }
        />
      )}
    </div>
  );
}
