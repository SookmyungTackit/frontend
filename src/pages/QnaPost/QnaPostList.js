import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './QnaPostList.css';
import HomeBar from '../../components/HomeBar';
import { dummyQnaPosts } from '../../data/dummyQnaPosts';

function QnaPostList() {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTag, setSelectedTag] = useState(null); // ✅ 추가

  const postsPerPage = 5;
  const pageGroupSize = 5;

  const filteredPosts = dummyQnaPosts
    .filter((post) => {
      const matchesSearch =
        post.title.includes(searchKeyword) ||
        post.content.includes(searchKeyword) ||
        post.writer?.includes(searchKeyword);
      const matchesTag = selectedTag ? post.tag === selectedTag : true;
      return matchesSearch && matchesTag;
    })
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  const currentGroup = Math.floor((currentPage - 1) / pageGroupSize);
  const startPage = currentGroup * pageGroupSize + 1;
  const endPage = Math.min(startPage + pageGroupSize - 1, totalPages);

  const goToPage = (pageNum) => setCurrentPage(pageNum);
  const goToPrevGroup = () => {
    const prevGroupLastPage = startPage - 1;
    if (prevGroupLastPage > 0) setCurrentPage(prevGroupLastPage);
  };
  const goToNextGroup = () => {
    const nextGroupFirstPage = endPage + 1;
    if (nextGroupFirstPage <= totalPages) setCurrentPage(nextGroupFirstPage);
  };

  const handleTagClick = (tag) => {
    const plainTag = tag.replace('#', '');
    setCurrentPage(1);
    setSelectedTag(prev => prev === plainTag ? null : plainTag); // ✅ 토글
  };

  return (
    <>
      <HomeBar />

      <div className="qnapost-banner">
        <div className="search-box">
          <input
            type="text"
            placeholder="게시판 내 검색"
            value={searchKeyword}
            onChange={(e) => {
              setSearchKeyword(e.target.value);
              setCurrentPage(1);
            }}
          />
          <button className="search-button">
            <img src="/search.svg" alt="검색" width="15" height="15" />
          </button>
        </div>
        <h1>질문 게시판</h1>
        <p>Home &gt; 질문 게시판</p>
      </div>

      <div className="qnapost-container">
        <div className="qnapost-subtext-wrapper">
          <div className="qnapost-subtext">
            “질문 게시판”은 신입은 질문글만 작성할 수 있으며, 선배는 답글만 작성할 수 있습니다. 
          </div>
        </div>

        <div className="qnapost-tags">
          {['#Product', '#Engineering', '#People', '#Sales'].map((tag, index) => (
            <button
              key={index}
              className={`tag-button ${selectedTag === tag.replace('#', '') ? 'active-tag' : ''}`}
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </button>
          ))}
          <button className="write-button" onClick={() => navigate('/qna/write')}>
            글쓰기
          </button>
        </div>

        <div className="qnapost-list">
          {currentPosts.map((post) => (
            <div
              key={post.id}
              className="post-card"
              onClick={() => navigate(`/qna/${post.id}`)}
            >
              <div className="post-meta">
                <span className="nickname">{post.writer}</span>
                <span className="date">{new Date(post.created_at).toLocaleString('ko-KR')}</span>
                <span
                  className={`tag ${post.tag === selectedTag ? 'active-tag' : ''}`}
                >
                  {post.tag}
                </span>
              </div>
              <div className="post-title">{post.title}</div>
              <div className="post-content-preview">{post.content}...</div>
            </div>
          ))}
        </div>

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

export default QnaPostList;
