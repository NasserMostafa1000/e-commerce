import API_BASE_URL from "../Constant";

export const fetchAddresses = async (token) => {
  const response = await fetch(`${API_BASE_URL}Clients/GetAddresses`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Failed to fetch addresses");
  return await response.json();
};

export const fetchShipOrderInfo = async (token, Governorate) => {
  const response = await fetch(
    `${API_BASE_URL}AdminInfo/GetShipPriceAndTransactionNumber?Governorate=${Governorate}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) throw new Error("Failed to fetch Ship Info");
  return await response.json();
};

export const fetchClientPhone = async (token) => {
  const response = await fetch(`${API_BASE_URL}Clients/GetClientPhone`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error("Failed to fetch client phone");
  return await response.json();
};

export const handleAddAddress = async (token, newAddress) => {
  const response = await fetch(`${API_BASE_URL}Clients/PostNewAddress`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(newAddress),
  });

  if (!response.ok) throw new Error("Failed to add new address");
  const data = await response.json();
  return data.addressId;
};

export const postClientPhone = async (token, phoneNumber) => {
  const response = await fetch(
    `${API_BASE_URL}Clients/PostClientPhone?PhoneNumber=${phoneNumber}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) throw new Error("Failed to save phone number");
  return response.json();
};

export const postOrder = async (token, orderData) => {
  const response = await fetch(`${API_BASE_URL}Orders/PostOrder`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) throw new Error("❌ فشل في إتمام الطلب!");
  const data = await response.json();
  return data.orderId;
};

export const postOrderDetails = async (token, orderId, orderDetails) => {
  const response = await fetch(`${API_BASE_URL}Orders/PostOrderDetails`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ orderId, ...orderDetails }),
  });

  if (!response.ok) throw new Error("❌ فشل في إرسال تفاصيل الطلب!");
  return await response.json();
};
export const PostListOfOrdersDetails = async (
  orderId,
  token,
  TheCurrentDetails
) => {
  try {
    const detailsResponse = await fetch(
      `${API_BASE_URL}Orders/PostListOfOrderDetails?OrderId=${orderId}`, // ✅ تصحيح الرابط
      {
        method: "POST",
        body: JSON.stringify(TheCurrentDetails), // ✅ إرسال قائمة المنتجات
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!detailsResponse.ok) {
      const errorData = await detailsResponse.json();
      throw new Error(errorData.message || "❌ فشل في إرسال تفاصيل الطلب!");
    }

    return true;
  } catch (error) {
    console.error("❌ خطأ أثناء إتمام الطلب:", error.message);
    alert(`⚠️ خطأ: ${error.message}`);
  }
};
