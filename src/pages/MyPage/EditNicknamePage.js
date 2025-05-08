import React, { useState } from 'react';
import HomeBar from '../../components/HomeBar';
import './EditForm.css';


const EditNicknamePage = () => {
  const [nickname, setNickname] = useState('');

  const handleChange = (e) => {
    setNickname(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: API 요청 또는 로직 처리
    console.log('변경할 닉네임:', nickname);
  };

  return (
    <>
      <HomeBar />
      <div className="edit-container">
        <form className="edit-box" onSubmit={handleSubmit}>
          <h2>닉네임 변경</h2>

          <label htmlFor="nickname">닉네임</label>
          <input
            type="text"
            id="nickname"
            value={nickname}
            onChange={handleChange}
            placeholder="변경할 닉네임"
            className="edit-input"
          />

          <button type="submit" className="edit-submit-btn">닉네임 변경하기</button>
        </form>
      </div>
    </>
  );
};

export default EditNicknamePage;
