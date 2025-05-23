import React from 'react';
import api from '../../api/api';

function CommentReportButton({ commentId, apiUrl = '/api/comment-report' }) {
  const buttonStyle = {
    background: 'none',
    border: 'none',
    color: '#888',
    fontSize: '13px',
    cursor: 'pointer',
    padding: 0,
  };

  const handleReport = async () => {
    try {
      await api.post(apiUrl, { commentId });
      alert('신고 되었습니다.');
    } catch (err) {
      alert('신고에 실패했습니다.');
      console.error(err);
    }
  };

  return (
    <button style={buttonStyle} onClick={handleReport}>
      신고
    </button>
  );
}

export default CommentReportButton;
