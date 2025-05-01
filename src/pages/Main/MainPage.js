import React from 'react';
import HomeBar from '../../components/HomeBar';
import './MainPage.css';

function MainPage() {
  return (
    <>
      <HomeBar />
      <div className="main-container">
        <h1>환영합니다! 🎉</h1>
        <p>자유게시판과 질문게시판에서 자유롭게 소통해보세요.</p>
      </div>
    </>
  );
}

export default MainPage;
