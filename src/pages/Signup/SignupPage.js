import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './SignupPage.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios'; // axios import 추가


function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [yearOfEmployment, setYearOfEmployment] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false); // 비밀번호 보임 여부 상태

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      email,
      password,
      nickname,
      yearOfEmployment,
    };

    try {
        // 백엔드로 POST 요청 보내기 백엔드 주소 입력하기
        const response = await axios.post('http://localhost:4000/api/signup', formData);
    
        console.log('서버 응답:', response.data);
        alert('회원가입이 완료되었습니다. 로그인해 주세요.');
    
        // 폼 초기화
        setEmail('');
        setPassword('');
        setNickname('');
        setYearOfEmployment('');
    
        navigate('/login');
      } catch (error) {
        console.error('회원가입 오류:', error);
        alert('회원가입 중 문제가 발생했습니다.');
      }
      
  };

  return (
    <div className="signup-container">
      <div className="signup-logo">
        <Link to="/login">
          <img src="/logo.png" alt="로고" style={{ cursor: 'pointer' }} />
        </Link>
      </div>

      <div className="signup-form-wrapper">
        <h2 className="signup-title">회원가입</h2>
        <p className="signup-info">
          <img src="/warning.svg" alt="경고 아이콘" className="warning-icon" />
          올해 입사자는 신입 사원으로 가입되고 이후는 선배 사원으로 가입됩니다.
        </p>
        <div className="signup-box">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">이메일</label>
              <input
                type="email"
                id="email"
                value={email}
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">비밀번호</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  id="password"
                  value={password}
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {/* 비밀번호 입력값이 있을 때만 아이콘 표시 */}
                {password && (
                  <button
                    type="button"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {passwordVisible ? (
                      <FaEyeSlash size={20} color="#3D4D5C" />
                    ) : (
                      <FaEye size={20} color="#3D4D5C" />
                    )}
                  </button>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="nickname">닉네임</label>
              <input
                type="text"
                id="nickname"
                value={nickname}
                placeholder="Nickname"
                onChange={(e) => setNickname(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="yearOfEmployment">입사년도</label>
              <input
                type="text"
                id="yearOfEmployment"
                value={yearOfEmployment}
                placeholder="Year of Employment"
                onChange={(e) => setYearOfEmployment(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="signup-submit">
              제출하기
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
