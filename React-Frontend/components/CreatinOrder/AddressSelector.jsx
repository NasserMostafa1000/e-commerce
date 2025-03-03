import "../../styles/PurchaseOperationDetails.css"; // ✅ يخرج من مجلد Orders ثم من components ثم يدخل styles
import { egyptianGovernorates } from "../../Components/utils";
import { handleAddAddress } from "./api.js";

export default function AddressSelector({
  addresses,
  selectedAddressId,
  setSelectedAddressId,
  setShowAddAddressModal,
  showAddAddressModal,
  newAddress,
  setNewAddress,
  setAddresses,
}) {
  const HandleSaveClick = async () => {
    const token = sessionStorage.getItem("token"); // ✅ اجلب التوكن بشكل منفصل
    if (!token) {
      alert("لم يتم العثور على التوكن، الرجاء تسجيل الدخول."); // ✅ تحقق من وجود التوكن
      return;
    }
    try {
      const addressId = await handleAddAddress(token, {
        governorate: newAddress.governorate,
        city: newAddress.city,
        street: newAddress.street,
      });

      if (!addressId)
        throw new Error("❌ فشل في الحصول على ID العنوان الجديد!");
      setAddresses((prevAddresses) => ({
        ...prevAddresses,
        [addressId]: `${newAddress.governorate}- مدينه ${newAddress.city} شارع ${newAddress.street}`,
      }));

      setSelectedAddressId(addressId);

      setShowAddAddressModal(false);
      setNewAddress({ governorate: "", city: "", street: "" });
    } catch (error) {
      console.error("❌ خطأ أثناء إضافة العنوان:", error.message);
      alert(`⚠️ خطأ: ${error.message}`);
    }
  };

  return (
    <>
      <h4>العنوان المختار</h4>

      {Object.keys(addresses).length > 0 ? (
        <select
          className="select-box"
          value={selectedAddressId}
          onChange={(e) => setSelectedAddressId(e.target.value)}
        >
          {Object.entries(addresses).map(([id, address]) => (
            <option key={id} value={id}>
              {address}
            </option>
          ))}
        </select>
      ) : (
        <p className="error-message">
          👇لا توجد عنواين متاحة، قم بوضع عنوان الآن👇
        </p>
      )}

      {/* ✅ زر إضافة عنوان جديد */}
      <div>
        <a
          href="#"
          className="add-address-link"
          style={{ color: "white" }}
          onClick={(e) => {
            e.preventDefault();
            setShowAddAddressModal(true);
          }}
        >
          + أضف عنوانًا جديدًا
        </a>
      </div>

      {/* ✅ المودال يظهر هنا عند showAddAddressModal === true */}
      {showAddAddressModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>إضافة عنوان جديد</h3>

            <label>المحافظة:</label>
            <select
              value={newAddress.governorate}
              onChange={(e) =>
                setNewAddress({
                  ...newAddress,
                  governorate: e.target.value,
                })
              }
            >
              <option value="">اختر محافظة</option>
              {egyptianGovernorates.map((governorate, index) => (
                <option key={index} value={governorate}>
                  {governorate}
                </option>
              ))}
            </select>

            <label>المدينة:</label>
            <input
              type="text"
              value={newAddress.city}
              onChange={(e) =>
                setNewAddress({ ...newAddress, city: e.target.value })
              }
            />

            <label>الشارع:</label>
            <input
              type="text"
              value={newAddress.street}
              onChange={(e) =>
                setNewAddress({ ...newAddress, street: e.target.value })
              }
            />

            <div className="modal-actions">
              <button className="save-btn" onClick={HandleSaveClick}>
                حفظ العنوان
              </button>

              <button
                className="cancel-btn"
                onClick={() => setShowAddAddressModal(false)}
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
