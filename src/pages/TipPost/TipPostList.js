import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TipPostList.css';
import HomeBar from '../../components/HomeBar';
import api from '../../api/api';
import useFetchUserInfo from '../../hooks/useFetchUserInfo';

// ✅ fallback 데이터
const fallbackResponse = {
  page: 0,
  content: [
    {
      id: 2,
      writer: '기본값',
      title: '본문1 33제목',
      content: '내용이이이이입니다5',
      createdAt: '2025-05-26T00:49:09.773772',
    },
    {
      id: 1,
      writer: 'test',
      title: '본문1 34제목',
      content: '내용이이이이입니다5',
      createdAt: '2025-05-26T00:47:58.054746',
    },
  ],
  size: 5,
  totalElements: 2,
  totalPages: 1,
};

function TipPostList() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const { userInfo } = useFetchUserInfo();

  const postsPerPage = 5;
  const pageGroupSize = 5;

  // ✅ 게시글 불러오기
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get("api/tip-posts");
        setPosts(res.data?.content || []);
        setTotalPages(res.data?.totalPages || 0);
      } catch (err) {
        console.error('❌ 게시글 불러오기 실패:', err);
        setPosts(fallbackResponse?.content || []);
        setTotalPages(fallbackResponse?.totalPages || 1);
      }
    };
    fetchPosts();
  }, [currentPage]);

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
    setCurrentPage(0);
  };

  const filteredPosts = posts.filter((post) => {
    const matchesKeyword =
      (post.title?.toLowerCase().includes(searchKeyword.toLowerCase()) ?? false) ||
      (post.content?.toLowerCase().includes(searchKeyword.toLowerCase()) ?? false);

    return matchesKeyword;
  });

  const currentGroup = Math.floor(currentPage / pageGroupSize);
  const startPage = currentGroup * pageGroupSize;
  const endPage = Math.min(startPage + pageGroupSize, totalPages);

  const goToPage = (page) => setCurrentPage(page);

  return (
    <>
      <HomeBar />
      <div className="freepost-banner">
        <div className="search-box">
          <input
            type="text"
            placeholder="게시판 내 검색"
            value={searchKeyword}
            onChange={handleSearchChange}
          />
          <button className="search-button">
            <img src="/search.svg" alt="검색" width="15" height="15" />
          </button>
        </div>
        <h1>선임자의 TIP</h1>
        <p>Home &gt; 선임자의 TIP</p>
      </div>

      <div className="freepost-container">
        <div className="freepost-subtext-wrapper">
          <div className="freepost-subtext">
            <img src="/warning.svg" alt="경고 아이콘" className="warning-icon" />
            "선임자의 TIP"은 선배 사원만 글을 작성할 수 있으며, 신입 사원은 열람만 가능합니다.
          </div>
        </div>

        <div className="freepost-tags">
          {userInfo?.yearsOfService >= 2 && (
            <button className="write-button" onClick={() => navigate('/tip/write')}>
              글쓰기
            </button>
          )}
        </div>

        <div className="freepost-list">
          {filteredPosts.length === 0 ? (
            <div className="no-result">게시글이 없습니다.</div>
          ) : (
            filteredPosts.map((post) => (
              <div
                key={post.id}
                className="post-card"
                onClick={() => navigate(`/tip/${post.id}`)}
              >
                <div className="post-meta">
                  <span className="nickname">{post.writer}</span>
                  <span className="date">{new Date(post.createdAt).toLocaleString('ko-KR')}</span>
                </div>
                <div className="post-title">{post.title}</div>
                <div className="post-content-preview">{post.content}...</div>
              </div>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button onClick={() => goToPage(startPage - 1)} disabled={startPage === 0} className="page-btn">
              &laquo;
            </button>
            {Array.from({ length: endPage - startPage }, (_, i) => startPage + i).map((pageNum) => (
              <button
                key={pageNum}
                className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
                onClick={() => goToPage(pageNum)}
              >
                {pageNum + 1}
              </button>
            ))}
            <button
              onClick={() => goToPage(endPage)}
              disabled={endPage >= totalPages}
              className="page-btn"
            >
              &raquo;
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default TipPostList;
