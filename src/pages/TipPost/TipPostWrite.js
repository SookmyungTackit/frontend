import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TipPostWrite.css';
import HomeBar from '../../components/layout/HomeBar';
import { toast } from 'react-toastify';
import api from '../../api/api';

function TipPostWrite() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.warn('제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      const payload = {
        title,
        content,
      };
      const { data } = await api.post('/api/tip-posts', payload);
      toast.success('글이 작성되었습니다!');
      navigate(`/tip/${data.postId}`);
    } catch (err) {
      toast.error('글 작성에 실패했습니다.');
      console.error(err);
    }
  };

  return (
    <>
      <HomeBar />

      <div className="qnapost-write-container">
        <h1 className="board-title" onClick={() => navigate('/tip')}>
          선임자의 Tip 게시판
        </h1>
        <form className="write-form" onSubmit={handleSubmit}>
          <button type="submit" className="write-submit-button">
            등록
          </button>

          <p className="write-label">글 제목</p>
          <input
            type="text"
            className="write-title-input"
            placeholder="글 제목은 내용을 대표할 수 있도록 간결하게 작성해 주세요."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <p className="write-label">내용</p>
          <textarea
            className="write-textarea"
            placeholder="팁을 자유롭게 작성해주세요."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </form>
      </div>
    </>
  );
}

export default TipPostWrite;
