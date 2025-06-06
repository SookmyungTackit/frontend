// components/comment/MyCommentActions.js
import React, { useState, useRef } from 'react';
import api from '../../api/api';
import './CommentList.css';

function MyCommentActions({
  comment,
  apiUrl,
  currentUser,
  onUpdateLocal,
  onDeleteLocal
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const textareaRef = useRef(null);

  const handleEditClick = () => {
    setIsEditing(true);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    }, 0);
  };

  const handleEditSubmit = async () => {
    if (!editedContent.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    try {
      let reqBody = { content: editedContent.trim() };
      const { data } = await api.patch(`${apiUrl}/${comment.id}`, reqBody);
      onUpdateLocal(data);
      setIsEditing(false);
    } catch (error) {
      alert('댓글 수정 실패. (더미 처리)');
      console.error(error);
      const dummyUpdated = {
        ...comment,
        content: editedContent.trim() + ' (더미 수정됨)',
      };
      onUpdateLocal(dummyUpdated);
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) return;

    try {
      await api.delete(`${apiUrl}/${comment.id}`);
      onDeleteLocal(comment.id);
    } catch (error) {
      alert('댓글 삭제 실패. (더미 처리)');
      console.error(error);
      onDeleteLocal(comment.id);
    }
  };

  const handleCancel = () => {
    setEditedContent(comment.content);
    setIsEditing(false);
  };

  return (
    <div className="comment-item">
      <div className="comment-meta">
        <strong>{comment.writer}</strong> ·{' '}
        <span>{new Date(comment.createdAt).toLocaleString()}</span>
      </div>
      {isEditing ? (
        <>
          <textarea
            ref={textareaRef}
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="floating-textarea"
          />
          <div className="button-float-layer" style={{ display: 'flex', gap: '8px' }}>
            <button className="floating-button" onClick={handleEditSubmit}>저장</button>
            <button className="floating-button" onClick={handleCancel}>취소</button>
          </div>
        </>
      ) : (
        <p className="comment-text">{comment.content}</p>
      )}
      {currentUser === comment.writer && !isEditing && (
        <div className="tippost-header">
          <div className="tippost-actions">
            <button className="tippost-actions-button" onClick={handleEditClick}>수정하기</button>
            <button className="tippost-actions-button" onClick={handleDelete}>삭제하기</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyCommentActions;
