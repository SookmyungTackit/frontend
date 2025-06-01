import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PostPageList.css';
import HomeBar from '../../components/HomeBar';
import api from '../../api/api';

function MyQnaPostList() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const postsPerPage = 10;
  const pageGroupSize = 5;

  // ✅ fallback 데이터
  const fallbackResponse = {
    page: 0,
    content: [
      {
        postId: 1,
        title: "본문1 33제목",
        content: "내용이이이이입니다5",
        createdAt: "2025-05-26T01:31:23.129942",
        tags: ["태그3"],
        type: "QnA",
      },
    ],
    size: 5,
    totalElements: 1,
    totalPages: 1,
  };

  // ✅ 게시글 불러오기
  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('No token found');

      const response = await api.get(
        `/api/mypage/qna-posts?page=${currentPage - 1}&size=${postsPerPage}&sort=createdAt,asc`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { content, totalPages } = response.data;
      setPosts(content);
      setTotalPages(totalPages);
    } catch (error) {
      console.warn('✅ API 실패 또는 토큰 없음, fallback 데이터 사용');
      const { content, totalPages } = fallbackResponse;
      setPosts(content);
      setTotalPages(totalPages);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [currentPage]);

  // ✅ 페이지네이션 계산
  const currentGroup = Math.floor((currentPage - 1) / pageGroupSize);
  const startPage = currentGroup * pageGroupSize + 1;
  const endPage = Math.min(startPage + pageGroupSize - 1, totalPages);

  const goToPage = (pageNum) => setCurrentPage(pageNum);
  const goToPrevGroup = () => {
    const prev = startPage - 1;
    if (prev > 0) setCurrentPage(prev);
  };
  const goToNextGroup = () => {
    const next = endPage + 1;
    if (next <= totalPages) setCurrentPage(next);
  };

  return (
    <>
      <HomeBar />

      <div className="freepost-banner">
        <h1>질문게시판 내가 쓴 글</h1>
        <p>마이페이지 &gt; 질문게시판 내가 쓴 글 보기</p>
      </div>

      <div className="freepost-container">
        <div className="freepost-list">
          {posts.map((post) => (
            <div
              key={post.postId}
              className="post-card"
              onClick={() => navigate(`/qna/${post.postId}`, { state: { from: 'my-posts' } })}
            >
              <div className="post-meta">
                <span className="board-type">질문게시판</span>
                <span className="date">
                  {new Date(post.createdAt).toLocaleString('ko-KR')}
                </span>
              </div>
              <div className="post-title">{post.title}</div>
              <div className="post-content-preview">{post.content}...</div>
            </div>
          ))}
        </div>

        {/* 페이지네이션 */}
        <div className="pagination">
          <button onClick={goToPrevGroup} disabled={startPage === 1} className="page-btn">
            &laquo;
          </button>
          {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((pageNum) => (
            <button
              key={pageNum}
              className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
              onClick={() => goToPage(pageNum)}
            >
              {pageNum}
            </button>
          ))}
          <button onClick={goToNextGroup} disabled={endPage === totalPages} className="page-btn">
            &raquo;
          </button>
        </div>
      </div>
    </>
  );
}

export default MyQnaPostList;
