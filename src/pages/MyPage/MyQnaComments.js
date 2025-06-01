import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PostPageList.css';
import HomeBar from '../../components/HomeBar';
import api from '../../api/api';

const fallbackResponse = {
  page: 0,
  content: [
    {
      commentId: 2,
      postId: 1,
      content: "두 번째 댓글입니다.\n두 줄로 구성되어 있어요.",
      createdAt: "2025-05-26T01:33:16.108661",
      type: "QnA",
    },
    {
      commentId: 1,
      postId: 1,
      content: "첫 번째 댓글입니다.",
      createdAt: "2025-05-25T01:32:14.798548",
      type: "QnA",
    },
  ],
  size: 5,
  totalElements: 2,
  totalPages: 1,
};

function MyQnaComments() {
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const size = 5; // 고정된 페이지당 항목 수

  const fetchComments = async () => {
    try {
      const response = await api.get(
        `/api/mypage/qna-comments?page=${currentPage - 1}&size=${size}&sort=createdAt,${sortOrder}`
      );
      setComments(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('API 실패, fallback 사용', error);
      const sortedFallback = [...fallbackResponse.content].sort((a, b) =>
        sortOrder === 'desc'
          ? new Date(b.createdAt) - new Date(a.createdAt)
          : new Date(a.createdAt) - new Date(b.createdAt)
      );
      setComments(sortedFallback.slice((currentPage - 1) * size, currentPage * size));
      setTotalPages(Math.ceil(fallbackResponse.totalElements / size));
    }
  };

  useEffect(() => {
    fetchComments();
  }, [sortOrder, currentPage]);

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    setCurrentPage(1); // 정렬 바꾸면 첫 페이지로
  };

  return (
    <>
      <HomeBar />
      <div className="freepost-banner">
        <h1>질문게시판 내가 쓴 댓글</h1>
        <p>마이페이지 &gt; 질문게시판 내가 쓴 댓글 보기</p>
      </div>

      <div className="freepost-container">
        <div className="sort-dropdown-container">
          <label htmlFor="sortOrder" className="sort-label"> </label>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={handleSortChange}
            className="sort-select"
          >
            <option value="desc">최신순</option>
            <option value="asc">오래된순</option>
          </select>
        </div>

        <div className="freepost-list">
          {comments.length === 0 ? (
            <p>작성한 댓글이 없습니다.</p>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.commentId}
                className="post-card"
                onClick={() => navigate(`/qna/${comment.postId}`)}
              >
                <div className="post-meta">
                  <span className="date">
                    {new Date(comment.createdAt).toLocaleDateString('ko-KR')}
                  </span>
                </div>
                <div className="comment-preview">
                  💬{" "}
                  {comment.content.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* ✅ 페이징 */}
        <div className="pagination">
          <button onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))} disabled={currentPage === 1} className="page-btn">
            &laquo;
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
              onClick={() => setCurrentPage(pageNum)}
            >
              {pageNum}
            </button>
          ))}
          <button onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className="page-btn">
            &raquo;
          </button>
        </div>
      </div>
    </>
  );
}

export default MyQnaComments;
