 // src/pages/LoginPage/LoginPage.js
 import React, { useState } from "react";
 import axios from "axios";
 import { Link } from "react-router-dom"; // Link 컴포넌트 임포트
 import "./LoginPage.css"; // 기존의 스타일 파일
 
 function LoginPage() {
   // 상태 변수: email, password, 에러 메시지, 그리고 로딩 상태(옵션)
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [successMessage, setSuccessMessage] = useState("");
   const [error, setError] = useState("");
   const [loading, setLoading] = useState(false);
 
   // 폼 제출 핸들러
   const handleSubmit = async (event) => {
     event.preventDefault(); // 기본 폼 제출 동작 방지
     setError("");
     setLoading(true);
 
     try {
       // 백엔드 로그인 API 호출 (여기서는 예시 URL 사용 - 실제 URL로 변경해야 함)
       const response = await axios.post("http://localhost:8080/auth/sign-in", {
         email,
         password,
       });
 
       // 로그인 성공 시 처리 (예: 토큰 저장, 리다이렉트 등)
       console.log("로그인 성공:", response.data);
       // 예를 들어, localStorage에 토큰 저장하기
       localStorage.setItem("token", response.data.token);
       // 이후 dashboard나 홈 페이지로 이동할 수도 있습니다.
       // 예: history.push("/dashboard");
       setSuccessMessage("로그인 성공!");
       setError("");
 
     } catch (err) {
       console.error("로그인 실패:", err);
       // 에러 메시지 처리 (백엔드에서 반환된 에러 메시지가 있다면 사용)
       setError(err.response?.data?.message || "로그인에 실패했습니다. 아이디 또는 비밀번호를 확인해주세요.");
       setSuccessMessage(""); // 성공 메시지 초기화
     
      } finally {
       setLoading(false);
     }
   };
 
   return (
     <div className="login-container">
       <header className="login-header">
         {/* 오른쪽 상단의 sign up 버튼을 Link 컴포넌트로 수정하여 /signup으로 이동하도록 변경 */}
         <Link to="/signup" className="signup-button english-text">sign up</Link>
       </header>
 
       <div className="login-box">
         <h2 className="login-title">
           <img src="/logo.png" alt="logo" className="login-logo" />
           </h2>
         <form className="login-form" onSubmit={handleSubmit}>
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

            {successMessage && (
              <p className="success-message">{successMessage}</p>
            )}

           {error && <p className="error-message">{error}</p>}
           
           <button type="submit" className="login-button english-text" disabled={loading}>
             {loading ? "로그인 중..." : "Log in"}
           </button>
         </form>
         <div className="bottom-links">
           {/* 이미 회원가입 링크가 아래쪽에 존재 */}
           <Link to="/signup" className="help-link">회원 가입하기</Link>
         </div>
       </div>
     </div>
   );
 }
 
 export default LoginPage; 
 