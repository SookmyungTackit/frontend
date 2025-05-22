import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FreePostList.css';
import HomeBar from '../../components/HomeBar';
import { dummyFreePosts } from '../../data/dummyFreePosts';
import { useEffect } from 'react';
import axios from 'axios';


function FreePostList() {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTag, setSelectedTag] = useState(null); 
  const [posts, setPosts] = useState(dummyFreePosts); // 초기엔 더미 데이터로 세팅

useEffect(() => {
  axios.get('/free_post/list') // 백엔드에서 주는 URL 확인 필요
    .then(response => {
      setPosts(response.data); // 응답 데이터 형태 맞춰서 필요 시 수정
    })
    .catch(error => {
      console.error('API 호출 실패:', error);
      // 실패하면 더미 데이터 그대로 사용
    });
}, []);


  const postsPerPage = 5;
  const pageGroupSize = 5;

  const filteredPosts = posts
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

      <div className="freepost-banner">
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
        <h1>자유 게시판</h1>
        <p>Home &gt; 자유 게시판</p>
      </div>

      <div className="freepost-container">
        <div className="freepost-subtext-wrapper">
          <div className="freepost-subtext">
            “자유 게시판”은 신입과 선배 모두 자유롭게 게시글과 댓글을 작성할 수 있습니다.
          </div>
        </div>

        <div className="freepost-tags">
          {['#Product', '#Engineering', '#People', '#Sales'].map((tag, index) => (
            <button
              key={index}
              className={`tag-button ${selectedTag === tag.replace('#', '') ? 'active-tag' : ''}`}
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </button>
          ))}
          <button className="write-button" onClick={() => navigate('/free/write')}>
            글쓰기
          </button>
        </div>

        <div className="freepost-list">
          {currentPosts.map((post) => (
            <div
              key={post.id}
              className="freepost-card"
              onClick={() => navigate(`/free/${post.id}`)}
            >
              <div className="freepost-meta">
                <span className="nickname">{post.writer}</span>
                <span className="date">{new Date(post.created_at).toLocaleString('ko-KR')}</span>
                <span className="tag">{post.tag}</span>
              </div>

              <div className="freepost-title">{post.title}</div>
              <div className="freepost-content-preview">{post.content}...</div>
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

export default FreePostList;