import React, { useState } from 'react';
import HomeBar from '../../components/HomeBar';
import './EditForm.css';

const EditPasswordPage = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    // TODO: API 연동
    console.log('현재 비번:', currentPassword);
    console.log('새 비번:', newPassword);
  };

  return (
    <>
      <HomeBar />
      <div className="edit-container">
        <form className="edit-box" onSubmit={handleSubmit}>
          <h2>비밀번호 변경</h2>

          <label htmlFor="current-password">현재 비밀번호</label>
          <input
            type="password"
            id="current-password"
            className="edit-input"
            placeholder="현재 비밀번호"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />

          <label htmlFor="new-password">새 비밀번호</label>
          <input
            type="password"
            id="new-password"
            className="edit-input"
            placeholder="새 비밀번호"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <input
            type="password"
            className="edit-input"
            placeholder="새 비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button type="submit" className="edit-submit-btn">비밀번호 변경하기</button>
        </form>
      </div>
    </>
  );
};

export default EditPasswordPage;
