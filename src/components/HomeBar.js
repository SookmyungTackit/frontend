import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './HomeBar.css';

function HomeBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  return (
    <div className="homebar">
      <div className="homebar-left">
        <img
          src="/logo.png"
          alt="logo"
          className="homebar-logo"
          onClick={() => navigate('/main')}
          style={{ cursor: 'pointer' }}
        />
      </div>
      <div className="homebar-center">
        <Link to="/main" className="home-link">홈</Link>
        <Link to="/tip">선임자의 TIP</Link>
        <Link to="/freeboard">자유 게시판</Link>
        <Link to="/qna">질문 게시판</Link>
      </div>
      <div className="homebar-right">
        <Link to="/profile">마이 페이지</Link>
        <button onClick={handleLogout} className="logout-button">로그아웃</button>
      </div>
    </div>
  );
}

export default HomeBar;
