import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './QnaPostWrite.css';
import HomeBar from '../../components/HomeBar';

function QnaPostWrite() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('Engineering');
  const [content, setContent] = useState('');

  const tagOptions = ['Product', 'Engineering', 'People', 'Sales'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    console.log('작성된 글:', { title, tag, content });
    alert('글이 작성되었습니다!');
    navigate('/freeboard');
  };

  return (
    <>
      <HomeBar />
      
      <div className="freepost-write-container">
        <h1 className="board-title" onClick={() => navigate('/qna')}>
            질문 게시판
        </h1>
        <form className="write-form" onSubmit={handleSubmit}>
         
          <button className="write-submit-button" onClick={handleSubmit}>등록</button>
          <p className="write-label">글 제목</p>
          <input
            type="text"
            className="write-title-input"
            placeholder="글 제목은 내용을 대표할 수 있도록 간결하게 작성해 주세요."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="tag-buttons">
            {tagOptions.map((t) => (
              <button
                key={t}
                type="button"
                className={`tag-button ${tag === t ? 'selected' : ''}`}
                onClick={() => setTag(t)}
              >
                #{t}
              </button>
            ))}
          </div>
          <p className="write-label">내용</p>
          <textarea
            className="write-textarea"
            placeholder="궁금한 내용을 작성해주세요."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </form>
      </div>
    </>
  );
}

export default QnaPostWrite;
