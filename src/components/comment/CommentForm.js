// components/comment/CommentForm.js
import React, { useRef, useState } from 'react';
import api from '../../api/api'; // ✅ 직접 import!
import './CommentList.css';

function CommentForm({ postId, apiUrl, currentUser, onCommentSuccess }) {
  const textareaRef = useRef(null);
  const [comment, setComment] = useState('');

  const handleChange = (e) => {
    setComment(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleSubmit = async () => {
    if (!comment.trim()) {
      alert('댓글을 입력해주세요.');
      return;
    }

    try {
      // 게시판별 요청 body를 자동으로 맞춤
      let reqBody;
      if (apiUrl.includes('free')) {
        reqBody = { freePostId: postId, content: comment.trim() };
      } else if (apiUrl.includes('qna')) {
        reqBody = { qnaPostId: postId, content: comment.trim() };
      } else {
        reqBody = { postId, content: comment.trim() };
      }

      const { data } = await api.post(apiUrl, reqBody);

      onCommentSuccess(data); // 댓글 객체 전달
    } catch (error) {
      console.error('댓글 작성 실패. 더미 댓글을 추가합니다.', error);
      // 입력 내용 + 유저를 반영한 더미 댓글
      const dummyComment = {
        id: Date.now(),
        writer: currentUser || '더미유저',
        content: comment.trim() + ' (더미 댓글)',
        createdAt: new Date().toISOString(),
      };
      onCommentSuccess(dummyComment);
    }

    setComment('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  return (
    <div className="comment-wrapper">
      <div className="textarea-wrapper">
        <textarea
          ref={textareaRef}
          value={comment}
          onChange={handleChange}
          placeholder="자유롭게 답변을 작성해주세요."
          className="floating-textarea"
        />
        <div className="button-float-layer">
          <button className="floating-button" onClick={handleSubmit}>
            답글 등록
          </button>
        </div>
      </div>
    </div>
  );
}

export default CommentForm;
