import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TipPostWrite.css';
import HomeBar from '../../components/HomeBar';

function TipPostWrite() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    console.log('작성된 글:', { title, content });
    alert('글이 작성되었습니다!');
    navigate('/tip');
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
