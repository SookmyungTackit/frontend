import React from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';

function MyPostActions({ post, boardType, postId, currentUser, from, deleteApiPath }) {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/${boardType}/edit/${postId}`);
  };

  const handleDelete = async () => {
    const confirmed = window.confirm('이 글을 삭제하시겠습니까?');
    if (!confirmed) return;

    try {
      await api.delete(deleteApiPath);
      alert('삭제가 완료되었습니다.');
      if (from === 'my-posts') {
        navigate('/mypage/mypostpage');
      } else {
        navigate(`/${boardType}`);
      }
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('삭제에 실패했습니다.');
    }
  };

  if (post.writer !== currentUser) return null;

  const containerStyle = {
    display: 'flex',
    gap: '10px',
  };

  const buttonStyle = {
    background: 'none',
    border: 'none',
    color: '#888',
    fontSize: '13px',
    cursor: 'pointer',
    padding: 0,
  };

  return (
    <div style={containerStyle}>
      <button style={buttonStyle} onClick={handleEdit}>수정하기</button>
      <button style={buttonStyle} onClick={handleDelete}>삭제하기</button>
    </div>
  );
}

export default MyPostActions;
