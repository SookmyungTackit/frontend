import React, { useState } from 'react';
import HomeBar from '../../components/HomeBar';
import './EditForm.css';
import { toast } from 'react-toastify';
import api from '../../api/api';

const EditNicknamePage = () => {
  const [nickname, setNickname] = useState('');

  const handleChange = (e) => {
    setNickname(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nickname.trim()) {
      toast.warn('닉네임을 입력해주세요.');
      return;
    }

    try {
      const response = await api.patch('/members/nickname', { nickname });
      toast.success(`닉네임이 변경되었습니다: ${response.data.afterNickname}`);
    } catch (err) {
      toast.error('닉네임 변경에 실패했습니다.');
      console.error('닉네임 변경 에러:', err);
    }
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
