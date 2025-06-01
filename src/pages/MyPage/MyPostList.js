import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PostPageList.css';
import HomeBar from '../../components/HomeBar';
import { dummyMyPosts } from '../../data/dummyMyPosts';

function MyPostList() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTag, setSelectedTag] = useState(null); // ✅ 추가

  const postsPerPage = 5;
  const pageGroupSize = 5;

  const filteredPosts = dummyMyPosts
    .filter((post) => {
      const matchesTag = selectedTag ? post.tag === selectedTag : true;
      return matchesTag;
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
        <h1>내가 쓴 글</h1>
        <p>마이페이지 &gt; 내가 쓴 글 보기</p>
      </div>

      <div className="freepost-container">

        <div className="freepost-list">

        {currentPosts.map((post) => (
          <div
            key={post.id}
            className="post-card"
            onClick={() => {
              const boardPath = 
                post.type === 0 ? 'free' : 
                post.type === 1 ? 'qna' : 
                'tip';
                
              navigate(`/${boardPath}/${post.id}`, { state: { from: 'my-posts' } });
            }}            
          >
            <div className="post-meta">
              <span className="board-type">
                {post.type === 0 ? '자유게시판' : post.type === 1 ? '질문게시판' : 'TIP 게시판'}
              </span>
              <span className="date"> {new Date(post.created_at).toLocaleString('ko-KR')}</span>
              <span className="tag"> {post.tag}</span>
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

export default MyPostList;
