import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LoginPage.css";
import api from "../../api/api";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

    // ✅ 로그아웃 함수
    const handleLogout = useCallback(() => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("accessTokenExpiresIn");
      localStorage.removeItem("grantType");
      localStorage.removeItem("role");
      navigate("/login");
    }, [navigate]); 

  // ✅ useEffect에서 handleLogout 사용 + 의존성 배열에 포함
  useEffect(() => {
    const tokenExpiresIn = parseInt(localStorage.getItem("accessTokenExpiresIn"));
    if (tokenExpiresIn) {
      const now = Date.now();
      const timeRemaining = tokenExpiresIn - now;
      const threshold = 3 * 60 * 1000;

      if (timeRemaining > 0 && timeRemaining <= threshold) {
        alert("세션이 곧 만료됩니다. 자동 연장되거나 다시 로그인해 주세요.");
      }

      if (timeRemaining <= 0) {
        alert("세션이 만료되었습니다. 다시 로그인해 주세요.");
        handleLogout(); // ✅ 안전하게 호출
      }
    }
  }, [handleLogout]); // ✅ 의존성 추가로 ESLint 경고 해결

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const checkRes = await api.get(`/auth/check-email-auth?email=${email}`);
      const checkMessage = checkRes.data;
    
      // 참고: 사용 가능한 이메일 or 이미 가입된 이메일도 여기로 올 수 있음
      console.log("✅ 이메일 확인 응답:", checkMessage);
    
      // 200이 오면 무조건 로그인 진행
    } catch (checkError) {
      const status = checkError.response?.status;
      const message = checkError.response?.data;
    
      if (status === 409 && message === "탈퇴 이력이 있는 이메일입니다.") {
        setErrorMessage("탈퇴한 이메일입니다. 다른 이메일로 회원가입해주세요.");
        return; // 🚫 로그인 중단
      }
    
      // ✅ 이미 가입된 이메일은 그냥 통과시켜서 로그인 시도
      if (status === 409 && message === "이미 가입된 이메일입니다.") {
        // 통과 → 로그인 진행
        console.log("⚠️ 이미 가입된 이메일: 로그인 진행");
      } else {
        console.error("❌ 이메일 확인 중 기타 오류:", checkError);
        setErrorMessage("이메일 확인 중 오류가 발생했습니다.");
        return;
      }
    }
    
  
    try {
      // ✅ 로그인 요청
      const response = await api.post("/auth/sign-in", { email, password });
      const {
        accessToken,
        refreshToken,
        accessTokenExpiresIn,
        grantType,
        role,
      } = response.data;
  
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("accessTokenExpiresIn", accessTokenExpiresIn);
      localStorage.setItem("grantType", grantType);
      localStorage.setItem("role", role);
  
      navigate("/main");
    } catch (error) {
      if (error.response?.status === 401) {
        setErrorMessage("이메일 또는 비밀번호가 올바르지 않습니다.");
      } else {
        setErrorMessage("로그인 중 오류가 발생했습니다.");
      }
    }
  };
  



  return (
    <div className="login-container">
      {/* 상단 회원가입 버튼 */}
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
          {/* 이메일(ID) 입력 */}
          <label htmlFor="username" className="label english-text">ID</label>
          <input
            type="text"
            id="username"
            placeholder="Email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* 비밀번호 입력 */}
          <label htmlFor="password" className="label english-text">Password</label>
          <div className="password-input-wrapper">
            <input
              type={passwordVisible ? "text" : "password"}
              id="password"
              placeholder="Password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {password.length > 0 && (
              <span
                className="toggle-password-icon"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </span>
            )}
          </div>

          {/* 에러 메시지 표시 */}
          {errorMessage && (
            <div className="error-message">{errorMessage}</div>
          )}

          {/* 로그인 버튼 */}
          <button type="submit" className="login-button english-text">
            Log in
          </button>

          {/* 임시 로그인 버튼 (테스트용) 
          <button
            type="button"
            className="temp-login-button english-text"
            onClick={() => {
              localStorage.setItem("accessToken", "TEMP_TOKEN");
              localStorage.setItem("refreshToken", "TEMP_REFRESH_TOKEN");
              localStorage.setItem("accessTokenExpiresIn", `${Date.now() + 3600000}`);
              localStorage.setItem("grantType", "Bearer");
              localStorage.setItem("role", "ADMIN");
              navigate("/main");
            }}
          >
            임시 로그인
          </button>*/}
        </form>

        {/* 하단 회원가입 링크 */}
        <div className="bottom-links">
          <Link to="/signup" className="help-link">
            회원 가입하기
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
