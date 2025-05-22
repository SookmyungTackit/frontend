import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './SignupPage.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';


function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [organization, setOrganization] = useState('');
  const [yearOfEmployment, setYearOfEmployment] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false); // 비밀번호 보이기 토글 상태

  // 중복 검사 결과 메시지 상태 관리
  const [emailCheckMessage, setEmailCheckMessage] = useState('');
  const [nicknameCheckMessage, setNicknameCheckMessage] = useState('');

 // 페이지 이동을 위한 navigate 훅
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      email,
      password,
      nickname,
      joinedYear: yearOfEmployment,
      organization,
    };

    try {
      const response = await axios.post("auth/sign-up", formData);
      toast.success('회원가입이 완료되었습니다. 로그인해 주세요.');
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

  const checkEmailDuplicate = async () => {
    try {
      const response = await axios.get(` https://5a19-61-40-226-235.ngrok-free.app/auth/check-email-auth?email=${email}`);
  
      if (response.status === 200) {
        setEmailCheckMessage('사용 가능한 이메일입니다.');
      }
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data;
  
        if (status === 409 && message === '이미 가입된 이메일입니다.') {
          setEmailCheckMessage('이미 사용 중인 이메일입니다.');
        } 
        else if (status === 409 && message === '탈퇴 이력이 있는 이메일입니다.') {
          const wantsToRejoin = window.confirm('탈퇴 이력이 있는 이메일입니다. 재가입하시겠습니까?');
          if (wantsToRejoin) {
            await rejoinDeletedUser();  // ✅ 재가입 처리 API 호출
          } else {
            setEmail('');
            setEmailCheckMessage('다른 이메일을 입력해주세요.');
          }
        } 
        else {
          setEmailCheckMessage('이메일 확인 중 오류 발생');
        }
      } else {
        setEmailCheckMessage('서버와 통신 중 오류 발생');
      }
    }
  };
  
  const rejoinDeletedUser = async () => {
    try {
      const response = await axios.delete(` https://5a19-61-40-226-235.ngrok-free.app/auth/rejoin?email=${email}`);
      if (response.status === 200) {
        setEmailCheckMessage('재가입 처리가 완료되었습니다. 계속 진행해주세요.');
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        alert('삭제할 탈퇴 이력의 이메일이 없습니다.');
      } else {
        alert('재가입 처리 중 오류가 발생했습니다.');
      }
    }
  };  

  const checkNicknameDuplicate = async () => {
    try {
      await axios.get(`/auth/check-nickname?nickname=${nickname}`);
      setNicknameCheckMessage('사용 가능한 닉네임입니다.');
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setNicknameCheckMessage('이미 사용 중인 닉네임입니다.');
      } else {
        setNicknameCheckMessage('닉네임 확인 중 오류 발생');
      }
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
                onBlur={checkEmailDuplicate}
                required
              />
              <div className="check-message">{emailCheckMessage}</div>
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
                onBlur={checkNicknameDuplicate}
                required
              />
              <div className="check-message">{nicknameCheckMessage}</div>
            </div>


            <div className="form-group">
              <label htmlFor="organization">소속</label>
              <input
                type="text"
                id="organization"
                value={organization}
                placeholder="Organization"
                onChange={(e) => setOrganization(e.target.value)}
                required
              />
            </div>
            

            <div className="form-group">
              <label htmlFor="yearOfEmployment">입사년도</label>
              <select
                id="yearOfEmployment"
                value={yearOfEmployment}
                onChange={(e) => setYearOfEmployment(e.target.value)}
                required
                className="year-select"
              >
                <option value="">Year of Employment</option>
                {Array.from({ length: 10 }, (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
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
