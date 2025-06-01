import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PostPageList.css';
import HomeBar from '../../components/HomeBar';
import api from '../../api/api'; // ✅ API 호출용 axios 인스턴스

// ✅ fallback 더미 데이터
const fallbackResponse = {
  page: 0,
  content: [
    {
      commentId: 2,
      postId: 1,
      content: "댓글 내용입니다. ",
      createdAt: "2025-05-26T01:33:16.108661",
      type: "QnA",
    },
    {
      commentId: 1,
      postId: 1,
      content: "댓글 내용입니다. ",
      createdAt: "2025-05-26T01:32:14.798548",
      type: "QnA",
    },
  ],
  size: 10,
  totalElements: 2,
  totalPages: 1,
};

function MyQnaComments() {
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);

  // ✅ createdAt을 기준으로 최신순 정렬
  const sortByDate = (a, b) => new Date(b.createdAt) - new Date(a.createdAt);

  // ✅ 댓글 목록 가져오기
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await api.get('/api/mypage/qna-comments?page=0&size=10&sort=createdAt,asc');
        setComments(response.data.content.sort(sortByDate));
      } catch (error) {
        console.error('댓글 데이터를 불러오는 데 실패했습니다. fallback 데이터를 사용합니다.', error);
        setComments(fallbackResponse.content.sort(sortByDate));
      }
    };

    fetchComments();
  }, []);

  return (
    <>
      <HomeBar />

      <div className="freepost-banner">
        <h1>질문게시판 내가 쓴 댓글</h1>
        <p>마이페이지 &gt; 질문게시판 내가 쓴 댓글 보기</p>
      </div>

      <div className="freepost-container">
        <div className="freepost-list">
          {comments.length === 0 ? (
            <p>작성한 댓글이 없습니다.</p>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.commentId}
                className="post-card"
                onClick={() => navigate(`/free/${comment.postId}`)}
              >
                <div className="post-meta">
                  <span className="board-type">자유게시판</span>
                  <span className="date">
                    {new Date(comment.createdAt).toLocaleDateString('ko-KR')}
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
