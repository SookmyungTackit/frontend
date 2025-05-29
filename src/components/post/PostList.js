// ✅ PostList.js (공통 게시판 목록 컴포넌트)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import './PostList.css';
import HomeBar from '../layout/HomeBar';

function PostList({
  boardType,         // "free", "qna", "tip"
  title,             // 예: "자유 게시판"
  description,       // 페이지 설명 문구
  dummyData,         // API 실패 시 대체 데이터
  apiUrl,            // API 요청 URL
  tagList = [],      // 태그 필터링 (선택)
  extraContent       // 각 게시판마다 개별적으로 넣고 싶은 요소 (선택)
}) {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTag, setSelectedTag] = useState(null);
  const [posts, setPosts] = useState(dummyData);

  const postsPerPage = 5;
  const pageGroupSize = 5;

  useEffect(() => {
    api.get(apiUrl)
      .then((res) => setPosts(res.data))
      .catch((err) => {
        console.warn(`${title} API 실패, 더미 데이터 사용`);
        setPosts(dummyData);
      });
  }, [apiUrl]);

  const filteredPosts = Array.isArray(posts)
  ? posts
      .filter((post) => {
        const matchesSearch =
          post.title.includes(searchKeyword) ||
          post.content.includes(searchKeyword) ||
          post.writer?.includes(searchKeyword);
        const matchesTag = selectedTag ? post.tags?.includes(selectedTag) : true;
        return matchesSearch && matchesTag;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  : [];

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
    setSelectedTag((prev) => (prev === plainTag ? null : plainTag));
  };

  return (
    <>
      <HomeBar />

      <div className="post-banner">
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
        <h1>{title}</h1>
        <p>Home &gt; {title}</p>
      </div>

      <div className="post-container">
        {extraContent && <div className="extra">{extraContent}</div>}

        {description && (
          <div className="post-subtext-wrapper">
            <div className="post-subtext">{description}</div>
          </div>
        )}

        <div
        className="post-tags"
        style={boardType === 'tip' ? { marginBottom: '12px' } : {}}
        >
        {tagList.length > 0 ? (
            tagList.map((tag, index) => (
            <button
                key={index}
                className={`tag-button ${selectedTag === tag ? 'active-tag' : ''}`}
                onClick={() => handleTagClick(`#${tag}`)}
            >
                #{tag}
            </button>
            ))
        ) : (
            <div style={{ height: '8px' }} />
        )}

        <button className="write-button" onClick={() => navigate(`/${boardType}/write`)}>
            글쓰기
        </button>
        </div>


        <div className="post-list">
          {currentPosts.map((post) => (
            <div
              key={post.id}
              className="post-card"
              onClick={() => navigate(`/${boardType}/${post.id}`)}
            >
              <div className="post-meta">
                <span className="nickname">{post.writer}</span>
                <span className="date">{new Date(post.createdAt).toLocaleString('ko-KR')}</span>
                {post.tags && post.tags.map((tag, idx) => (
                  <span key={idx} className="tag">{tag}</span>
                ))}
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

export default PostList;
