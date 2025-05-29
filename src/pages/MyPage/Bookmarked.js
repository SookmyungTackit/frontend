import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PostPageList.css';
import HomeBar from '../../components/layout/HomeBar';
import api from '../../api/api'; // axios 인스턴스

function Bookmarked({ boardType = 'free' }) {
  const navigate = useNavigate();
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTag, setSelectedTag] = useState(null);

  const postsPerPage = 5;
  const pageGroupSize = 5;

  useEffect(() => {
    const fetchBookmarked = async () => {
      try {
        let url = '';
        if (boardType === 'free') url = '/api/mypage/free-scraps';
        else if (boardType === 'tip') url = '/api/mypage/tip-scraps';
        else if (boardType === 'qna') url = '/qna_post/scrap';

        const response = await api.get(url);
        const data = response.data;

        const normalized = data.map((post) => ({
          id: post.freeId ?? post.postId, // 자유, 팁: freeId / 질문: postId
          title: post.title,
          content: post.contentPreview ?? '', // 질문글은 contentPreview 없음
          writer: post.writer ?? post.authorName,
          created_at: post.createdAt,
          type: boardType === 'free' ? 0 : boardType === 'qna' ? 1 : 2,
        }));

        setBookmarkedPosts(normalized);
      } catch (error) {
        console.error('스크랩한 글 불러오기 실패:', error);
      }
    };

    fetchBookmarked();
  }, [boardType]);

  const filteredPosts = bookmarkedPosts
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
    setSelectedTag((prev) => (prev === plainTag ? null : plainTag));
  };

  return (
    <>
      <HomeBar />

      <div className="freepost-banner">
        <h1>찜한 글</h1>
        <p>마이페이지 &gt; 찜한 글 보기</p>
      </div>

      <div className="freepost-container">
        <div className="freepost-list">
          {currentPosts.map((post) => {
            const boardPath =
              post.type === 0 ? 'free' :
              post.type === 1 ? 'qna' :
              'tip';

            const boardName =
              post.type === 0 ? '자유게시판' :
              post.type === 1 ? '질문게시판' :
              'TIP 게시판';

            return (
              <div
                key={post.id}
                className="post-card"
                onClick={() => navigate(`/${boardPath}/${post.id}`)}
              >
                <div className="post-meta">
                  <span className="board-type">{boardName}</span>
                  <span className="writer"> {post.writer}</span>
                  <span className="date"> {new Date(post.created_at).toLocaleString('ko-KR')}</span>
                </div>

                <div className="post-title">{post.title}</div>
                {post.content && <div className="post-content-preview">{post.content}...</div>}
              </div>
            );
          })}
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

export default Bookmarked;
