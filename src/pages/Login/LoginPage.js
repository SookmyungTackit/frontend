import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LoginPage.css";
import axios from "axios"; // ✅ axios 추가

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); 
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(" https://0c7a-61-40-226-235.ngrok-free.app/auth/sign-in", {
        email,
        password,
      });

      const { accessToken, refreshToken } = response.data;

      // ✅ 토큰 저장
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      navigate("/main");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setErrorMessage("이메일 또는 비밀번호가 올바르지 않습니다.");
      } else {
        setErrorMessage("로그인 중 오류가 발생했습니다.");
      }
    }
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
        <form className="login-form" onSubmit={handleLogin}>
          <label htmlFor="email" className="label english-text">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password" className="label english-text">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* ✅ 에러 메시지 표시 */}
            {errorMessage && (
              <div className="error-message">{errorMessage}</div>
          )}

          <button type="submit" className="login-button english-text">
            Log in
          </button>
          <button
            type="button"
            className="temp-login-button english-text"
            onClick={() => {
              // 임시 토큰 강제로 넣기 (테스트용)
              localStorage.setItem("accessToken", "TEMP_TOKEN");
              localStorage.setItem("refreshToken", "TEMP_REFRESH_TOKEN");
              navigate("/main");
            }}
          >
            임시 로그인
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
