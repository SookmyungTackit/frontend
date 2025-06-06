import React, { useState, useEffect } from 'react';
import HomeBar from '../../components/HomeBar';
import './EditForm.css';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const EditNicknamePage = () => {
  const [nickname, setNickname] = useState('');
  const [isAvailable, setIsAvailable] = useState(null);
  const [checkMessage, setCheckMessage] = useState('');
  const navigate = useNavigate();

  // ✅ 닉네임이 바뀔 때마다 자동으로 중복 확인
  useEffect(() => {
    const checkNickname = async () => {
      if (!nickname.trim()) {
        setCheckMessage('');
        setIsAvailable(null);
        return;
      }

      try {
        const response = await api.get(`/auth/check-nickname?nickname=${nickname}`);
        // 서버가 200 OK 응답 시 → 사용 가능한 닉네임
        setIsAvailable(true);
        setCheckMessage('사용 가능한 닉네임입니다.');
      } catch (err) {
        // 서버가 409 Conflict 응답 시 → 중복된 닉네임
        if (err.response?.status === 409) {
          setIsAvailable(false);
          setCheckMessage('이미 사용 중인 닉네임입니다.');
        } else {
          // 예기치 못한 오류
          setIsAvailable(false);
          setCheckMessage('중복 확인 중 오류가 발생했습니다.');
          console.error(err);
        }
      }
    };

    // ✅ 300ms 디바운싱: 입력 후 일정 시간 대기하고 요청
    const delayCheck = setTimeout(() => {
      checkNickname();
    }, 300);

    // 입력이 바뀔 때마다 이전 요청 취소
    return () => clearTimeout(delayCheck);
  }, [nickname]);

  // ✅ 닉네임 변경 PATCH 요청
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nickname.trim()) {
      setCheckMessage('닉네임을 입력해주세요.');
      return;
    }

    if (isAvailable !== true) {
      setCheckMessage('닉네임 중복을 확인해주세요.');
      return;
    }

    try {
      // accessToken 가져오기 (인증 필요)
      const accessToken = localStorage.getItem('accessToken');

      // 닉네임 변경 PATCH 요청
      const response = await api.patch(
        '/api/members/nickname',       
        { nickname },               
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // ✅ 인증 토큰
            'Content-Type': 'application/json',     // ✅ JSON 타입 명시
          },
        }
      );

      // 성공 시 변경 완료 메시지 출력
      toast.success('닉네임이 변경되었습니다.');
      navigate('/mypage'); 
    } catch (err) {
      toast.error('닉네임 변경에 실패했습니다.');
      console.error(err);
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
            onChange={(e) => setNickname(e.target.value)}
            placeholder="변경할 닉네임"
            className="edit-input"
          />

          {/* ✅ 중복 확인 결과 메시지 출력 */}
          <div className={`nickname-message ${isAvailable === false ? 'error' : 'success'}`}>
            {checkMessage}
          </div>

          {/* ✅ 중복 확인 결과가 true일 때만 버튼 활성화 */}
          <button
            type="submit"
            className="edit-submit-btn"
            disabled={isAvailable !== true}
          >
            닉네임 변경하기
          </button>
        </form>
      </div>
    </>
  );
};

export default EditNicknamePage;
