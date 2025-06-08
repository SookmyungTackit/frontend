import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminHeader.css'; 

function AdminHeader() {
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
        />
      </div>

      <div className="homebar-right desktop-menu">
        <button onClick={handleLogout} className="logout-button">로그아웃</button>
      </div>
    </div>
  );
}

export default AdminHeader;
