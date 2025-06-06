import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './HomeBar.css';

function HomeBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  const isActive = (path) => location.pathname.startsWith(path) ? { color: '#4D77FF' } : {};

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

      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>

      {/* 데스크탑 메뉴 */}
      <div className="homebar-center desktop-menu">
        <Link to="/main" className="home-link" style={isActive('/main')}>홈</Link>
        <Link to="/tip" style={isActive('/tip')}>선임자의 TIP</Link>
        <Link to="/free" style={isActive('/free')}>자유 게시판</Link>
        <Link to="/qna" style={isActive('/qna')}>질문 게시판</Link>
      </div>

      <div className="homebar-right desktop-menu">
        <Link to="/mypage" style={isActive('/mypage')}>마이 페이지</Link>
        <button onClick={handleLogout} className="logout-button">로그아웃</button>
      </div>

      {/* 모바일 메뉴 */}
      <div className={`homebar-center mobile-menu ${menuOpen ? 'active' : ''}`}>
        <Link to="/main" className="home-link" style={isActive('/main')}>홈</Link>
        <Link to="/tip" style={isActive('/tip')}>선임자의 TIP</Link>
        <Link to="/free" style={isActive('/free')}>자유 게시판</Link>
        <Link to="/qna" style={isActive('/qna')}>질문 게시판</Link>
        <Link to="/userpage" style={isActive('/userpage')}>마이 페이지</Link>
        <button onClick={handleLogout} className="logout-button">로그아웃</button>
      </div>
    </div>
  );
}

export default HomeBar;
