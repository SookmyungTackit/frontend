import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LoginPage.css";
import api from "../../api/api";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); 
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ 토큰 만료 임박 시 사용자에게 알림 (예: 3분 전)
    const tokenExpiresIn = parseInt(localStorage.getItem("accessTokenExpiresIn"));
    if (tokenExpiresIn) {
      const now = Date.now();
      const timeRemaining = tokenExpiresIn - now;
      const threshold = 3 * 60 * 1000; // 3분

      if (timeRemaining > 0 && timeRemaining <= threshold) {
        alert("세션이 곧 만료됩니다. 자동 연장되거나 다시 로그인해 주세요.");
      }

      // ✅ 세션이 만료된 경우 자동 로그아웃 처리
      if (timeRemaining <= 0) {
        alert("세션이 만료되었습니다. 다시 로그인해 주세요.");
        handleLogout();
      }
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    //로그인 Api 사용 (url : /auth/sign-in, Post)
    try {
      const response = await api.post("/auth/sign-in", {
        email,
        password,
      });

      const { accessToken, refreshToken, accessTokenExpiresIn, grantType } = response.data;

      // ✅ 모든 응답 정보 저장
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("accessTokenExpiresIn", accessTokenExpiresIn);
      localStorage.setItem("grantType", grantType);

      navigate("/main");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setErrorMessage("이메일 또는 비밀번호가 올바르지 않습니다.");
      } else {
        setErrorMessage("로그인 중 오류가 발생했습니다.");
      }
    }
  };

  // ✅ 로그아웃 함수 (사용자 요청 시 또는 토큰 만료 시 호출)
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessTokenExpiresIn");
    localStorage.removeItem("grantType");
    navigate("/login");
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

          {/* ✅ 임시 로그인 기능 - 나중에 삭제 */}
          <button
            type="button"
            className="temp-login-button english-text"
            onClick={() => {
              localStorage.setItem("accessToken", "TEMP_TOKEN");
              localStorage.setItem("refreshToken", "TEMP_REFRESH_TOKEN");
              localStorage.setItem("accessTokenExpiresIn", `${Date.now() + 3600000}`);
              localStorage.setItem("grantType", "Bearer");
              navigate("/main");
            }}
          >
            임시 로그인
          </button>
          {/* ✅ 임시 로그인 끝 */}
        </form>
        <div className="bottom-links">
          <Link to="/signup" className="help-link">회원 가입하기</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
