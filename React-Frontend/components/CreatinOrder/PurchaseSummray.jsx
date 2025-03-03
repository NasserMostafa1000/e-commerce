import "../../styles/PurchaseOperationDetails.css"; // ✅ يخرج من مجلد Orders ثم من components ثم يدخل styles

export default function OrderSummary({ Products, ShipPrice }) {
  return (
    <div>
      <h4 style={{ color: "white" }}>سعر الشحنة: {Products.totalPrice}</h4>
      <h4 style={{ color: ShipPrice === 0 ? "red" : "white" }}>
        سعر الشحن:
        {ShipPrice !== 0 ? `${ShipPrice}` : "يرجى اختيار العنوان أولاً"}
      </h4>

      <h4 style={{ color: ShipPrice === 0 ? "red" : "white" }}>
        {ShipPrice === 0
          ? "يرجى اختيار العنوان لحساب السعر النهائي"
          : `السعر النهائي: ${Products.totalPrice + ShipPrice}`}
      </h4>
    </div>
  );
}
