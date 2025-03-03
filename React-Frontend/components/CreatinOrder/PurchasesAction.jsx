import "../../styles/PurchaseOperationDetails.css"; // ✅ يخرج من مجلد Orders ثم من components ثم يدخل styles
export default function OrderActions({
  UserTransactionNum,
  SetUserTransactionNum,
  setTransactionImage,
}) {
  return (
    <div>
      <h2>إدخال صورة التحويل</h2>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setTransactionImage(e.target.files[0])}
      />{" "}
      <input
        type="number"
        value={UserTransactionNum}
        onChange={(e) => SetUserTransactionNum(parseInt(e.target.value) || 0)}
        min="0"
        required
        placeholder="رقم الهاتف المرسل منه"
      />
    </div>
  );
}
