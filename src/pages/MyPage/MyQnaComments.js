import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import './PostPageList.css';
import HomeBar from '../../components/layout/HomeBar';

import { dummyMyQnaComments } from '../../data/dummyMyQnaComments';
import { dummyQnaPosts } from '../../data/dummyQnaPosts';

function MyQnaComments() {
  const navigate = useNavigate();
  const [qnaComments, setQnaComments] = useState([]);
  const [isEligible, setIsEligible] = useState(null); // null → 확인 전 / true → 가능 / false → 불가

  // 최신순 정렬 함수
  const sortByDate = (a, b) => new Date(b.createdAt) - new Date(a.createdAt);

  useEffect(() => {
    const checkEligibilityAndFetchComments = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        
        // 🧩 1. 선배 여부 확인
        const meRes = await api.get('/members/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { yearsOfService } = meRes.data;
        if (yearsOfService < 2) {
          setIsEligible(false);
          return;
        }

        setIsEligible(true);

        // 🧩 2. 조건 만족 시 댓글 목록 불러오기
        const commentRes = await api.get('/mypage/qna_comments', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQnaComments(commentRes.data);
      } catch (err) {
        console.warn('API 실패, 더미 데이터로 대체', err);
        setIsEligible(true);
        setQnaComments(dummyMyQnaComments);
      }
    };

    checkEligibilityAndFetchComments();
  }, []);

  const mappedComments = qnaComments
    .map((comment) => {
      const post = dummyQnaPosts.find((p) => p.id === comment.postId);
      return {
        ...comment,
        postTitle: post?.title,
        postContent: post?.content,
      };
    })
    .sort(sortByDate);

  return (
    <>
      <HomeBar />

      <div className="freepost-banner">
        <h1>질문게시판 내가 쓴 댓글</h1>
        <p>마이페이지 &gt; 질문게시판 내가 쓴 댓글 보기</p>
      </div>

      <div className="freepost-container">
        <div className="freepost-list">
          {isEligible === null ? (
            <p>정보를 불러오는 중입니다...</p>
          ) : !isEligible ? (
            <p className="unauthorized-message">
              🛑 2년차 이상 선배만 댓글을 작성할 수 있습니다.
            </p>
          ) : mappedComments.length === 0 ? (
            <p>작성한 댓글이 없습니다.</p>
          ) : (
            mappedComments.map((comment) => (
              <div
                key={comment.commentId}
                className="post-card"
                onClick={() => navigate(`/qna/${comment.postId}`)}
              >
                <div className="post-meta">
                  <span className="board-type">질문게시판</span>
                  <span className="date">
                    {new Date(comment.createdAt).toLocaleString('ko-KR')}
                  </span>
                </div>
                <div className="comment-preview">💬 {comment.content}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default MyQnaComments;
