import React, { useEffect, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet"; // تأكد من تثبيت react-helmet
import "../../Styles/Login.css";
import API_BASE_URL from "../Constant.js";

export default function Login() {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [message]);
  const handleLogin = async ({
    email = null,
    password = null,
    token = null,
    authProvider,
  }) => {
    try {
      const res = await fetch(`${API_BASE_URL}Users/Login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          token: token,
          authProvider: authProvider,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        sessionStorage.setItem("token", data.token);
        navigate("/");
        setMessage("تم تسجيل الدخول بنجاح!");
        setMessageType("success");
      } else {
        setMessage(data.message || "فشل تسجيل الدخول. الرجاء المحاولة مجدداً.");
        setMessageType("error");
      }
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin({
      email: Email,
      password: Password,
      authProvider: "Online Store",
    });
  };

  // ✅ تسجيل الدخول باستخدام Google
  const handleGoogleLoginSuccess = (response) => {
    const token = response.credential;
    handleLogin({ token, authProvider: "Google" });
  };

  const handleGoogleLoginFailure = () => {
    setMessage("فشل تسجيل الدخول باستخدام Google.");
    setMessageType("error");
  };

  return (
    <div className="login-container">
      <Helmet>
        <title>تسجيل الدخول |سوق البلد</title>
        <meta
          name="description"
          content="تسجيل الدخول إلى سوق البلد للتمتع بتجربة تسوق مميزة."
        />
      </Helmet>
      <h1>🛒</h1>
      <h1> سوق البلد</h1>

      {message && <p className={`message ${messageType}`}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="email"
            style={{ display: "block", marginBottom: "5px" }}
          >
            البريد الإلكتروني
          </label>
          <input
            style={{ backgroundColor: "darkgray" }}
            type="email"
            id="email"
            name="email"
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="أدخل بريدك الإلكتروني"
            required
            autoComplete="email" // السماح باللصق والنسخ
          />
        </div>

        <div style={{ marginTop: "2rem" }}>
          <label
            htmlFor="password"
            style={{ display: "block", marginBottom: "5px" }}
          >
            كلمة المرور
          </label>
          <input
            style={{ backgroundColor: "darkgray" }}
            type="password"
            id="password"
            name="password"
            value={Password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="أدخل كلمة المرور"
            required
            autoComplete="current-password"
          />
          <p>
            <Link to="/forgot-password">هل نسيت كلمة المرور؟</Link>
          </p>
        </div>

        <button type="submit" style={{ marginTop: "2rem" }}>
          تسجيل الدخول
        </button>

        <div className="login-links">
          <p>
            لا تملك حسابًا؟{" "}
            <Link to="/register" style={{ color: "blue" }}>
              سجل الآن
            </Link>
          </p>
        </div>
      </form>

      <h4>👇أو تسجيل بنقرة واحدة👇</h4>

      <div className="social-buttons-container">
        <GoogleLogin
          onSuccess={handleGoogleLoginSuccess}
          onError={handleGoogleLoginFailure}
          useOneTap
        />
      </div>
    </div>
  );
}
