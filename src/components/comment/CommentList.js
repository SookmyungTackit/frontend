// components/comment/CommentList.js
import React, { useEffect, useState } from 'react';
import api from '../../api/api';        // ✅ 여기!
import './CommentList.css';

const dummyComments = [
  {
    id: 1,
    writer: 'ㅇㅇ',
    content: '댓글 내용',
    createdAt: '2025-05-17T14:27:16.363248',
  },
  {
    id: 2,
    writer: 'ㅁㅁ',
    content: '댓글 내용임다',
    createdAt: '2025-05-17T14:40:54.793352',
  },
];

function CommentList({ postId, apiUrl }) {   // ✅ apiUrl도 prop으로 받아서 게시판별로 재사용
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const loadComments = async () => {
      try {
        // ✅ api 인스턴스 직접 사용!
        const { data } = await api.get(`${apiUrl}/${postId}`);
        setComments(data);
      } catch (error) {
        console.error('댓글 불러오기 실패. 더미 데이터로 대체합니다.', error);
        setComments(dummyComments);
      }
    };

    if (postId) loadComments();
  }, [postId, apiUrl]);

  return (
    <div className="comment-wrapper">
      <h3 className="comment-title">댓글</h3>
      <div className="comment-list">
        {comments.map((comment) => (
          <div key={comment.id} className="comment-item">
            <div className="comment-meta">
              <strong>{comment.writer}</strong> ·{' '}
              {new Date(comment.createdAt).toLocaleString()}
            </div>
            <div className="comment-text">{comment.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CommentList;
