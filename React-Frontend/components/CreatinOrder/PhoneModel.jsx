import "../../styles/PurchaseOperationDetails.css"; // ✅ يخرج من مجلد Orders ثم من components ثم يدخل styles
import { postClientPhone } from "./api.js";

export default function PhoneModal({
  newPhoneNumber,
  setNewPhoneNumber,
  setShowPhoneModal,
  setClientPhone,
}) {
  const handleSavePhoneNumber = async () => {
    setClientPhone(newPhoneNumber);

    setShowPhoneModal(false);
    const Token = sessionStorage.getItem("token");
    await postClientPhone(Token, newPhoneNumber);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>إدخال رقم الهاتف</h3>
        <input
          type="text"
          placeholder="أدخل رقم هاتفك"
          value={newPhoneNumber}
          onChange={(e) => setNewPhoneNumber(e.target.value)}
        />
        <button className="save-btn" onClick={handleSavePhoneNumber}>
          حفظ الرقم
        </button>
      </div>
    </div>
  );
}
