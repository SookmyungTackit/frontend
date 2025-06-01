import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TipPostWrite.css'; // ✅ 파일명도 수정해야 함
import HomeBar from '../../components/HomeBar';
import api from '../../api/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
      const res = await api.post('/api/tip-posts', {
        title,
        content,
      });
      toast.success('글이 작성되었습니다!');
      console.log('작성된 글:', res.data);
      navigate('/tip'); // ✅ 라우팅 경로도 수정
    } catch (err) {
      console.error('글 작성 실패:', err);
      toast.error('글 작성에 실패했습니다.');
    }
  };

  return (
    <>
      <HomeBar />
      <div className="tippost-write-container">
        <h1 className="board-title" onClick={() => navigate('/tip')}>
          선임자의 TIP
        </h1>
        <form className="write-form" onSubmit={handleSubmit}>
          <button className="write-submit-button" type="submit">등록</button>

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
            placeholder="신입사원에게 도움이 될 회사 생활 팁이나 조언을 작성해 주세요."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </form>
      </div>
    </>
  );
}

export default TipPostWrite;