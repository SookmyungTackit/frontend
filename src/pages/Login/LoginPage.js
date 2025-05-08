import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LoginPage.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleFakeLogin = (e) => {
    e.preventDefault();
    // 👉 개발용 임시 로그인 처리
    localStorage.setItem("accessToken", "TEMP_TOKEN");
    localStorage.setItem("nickname", "테스트유저");
    navigate("/main");
  };

  return (
    <div className="login-container">
      <header className="login-header">
        <Link to="/signup" className="signup-button english-text">
          sign up
        </Link>
      </header>

      <div className="login-box">
        <h2 className="login-title">
          <img src="/logo.png" alt="logo" className="login-logo" />
        </h2>
        <form className="login-form" onSubmit={handleFakeLogin}>
          <label htmlFor="email" className="label english-text">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="password" className="label english-text">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="login-button english-text">
            Log in (임시)
          </button>
        </form>
        <div className="bottom-links">
          <Link to="/signup" className="help-link">회원 가입하기</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
