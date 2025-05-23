import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PostPageList.css';
import HomeBar from '../../components/layout/HomeBar';
import api from '../../api/api';

function MyPostList() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTag, setSelectedTag] = useState(null);
  const [myNickname, setMyNickname] = useState('');
  const [yearsOfService, setYearsOfService] = useState(0);

  const postsPerPage = 5;
  const pageGroupSize = 5;

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const token = localStorage.getItem('accessToken');

        // 1. 내 정보 가져오기
        const meRes = await api.get('/members/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { nickname, yearsOfService } = meRes.data;
        setMyNickname(nickname);
        setYearsOfService(yearsOfService);

        // 2. 자유게시판 글 (writer 필터)
        const freeRes = await api.get('/api/free-posts', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const freePosts = freeRes.data
          .filter((post) => post.writer === nickname)
          .map((post) => ({ ...post, type: 0 }));

        // 3. 질문게시판 글 (필터 없음)
        const qnaRes = await api.get('/mypage/qna_posts', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const qnaPosts = qnaRes.data.map((post) => ({ ...post, type: 1 }));

        // 4. TIP 게시판 글 (연차 2년 이상 & writer 필터)
        let tipPosts = [];
        if (yearsOfService >= 2) {
          const tipRes = await api.get('/api/tip/tip-posts', {
            headers: { Authorization: `Bearer ${token}` },
          });
          tipPosts = tipRes.data
            .filter((post) => post.writer === nickname)
            .map((post) => ({ ...post, type: 2, tags: [] })); // tags 없어도 빈 배열로
        }

        // 5. 통합
        setPosts([...freePosts, ...qnaPosts, ...tipPosts]);
      } catch (error) {
        console.error('데이터 불러오기 실패:', error);
        setPosts([]);
      }
    };

    fetchAllPosts();
  }, []);

  const filteredPosts = posts
    .filter((post) => {
      if (!selectedTag) return true;
      return post.tags?.includes(selectedTag);
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

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
    setCurrentPage(1);
    setSelectedTag((prev) => (prev === tag ? null : tag));
  };

  return (
    <>
      <HomeBar />

      <div className="freepost-banner">
        <h1>내가 쓴 글</h1>
        <p>마이페이지 &gt; 내가 쓴 글 보기</p>
      </div>

      <div className="freepost-container">
        {currentPosts.length === 0 ? (
          <p>작성한 글이 없습니다.</p>
        ) : (
          <div className="freepost-list">
            {currentPosts.map((post) => (
              <div
                key={`${post.type}-${post.postId || post.id}`}
                className="post-card"
                onClick={() =>
                  navigate(
                    post.type === 0
                      ? `/free/${post.postId}`
                      : post.type === 1
                      ? `/qna/${post.postId}`
                      : `/tip/${post.id}`, // TIP 게시판은 id 사용
                    { state: { from: 'my-posts' } }
                  )
                }
              >
                <div className="post-meta">
                  <span className="board-type">
                    {post.type === 0
                      ? '자유게시판'
                      : post.type === 1
                      ? '질문게시판'
                      : 'TIP 게시판'}
                  </span>
                  <span className="date">
                    {new Date(post.createdAt).toLocaleString('ko-KR')}
                  </span>
                  {(post.tags || []).map((tag, idx) => (
                    <span
                      key={idx}
                      className={`tag ${tag === selectedTag ? 'selected-tag' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTagClick(tag);
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="post-title">{post.title}</div>
                <div className="post-content-preview">{post.content}...</div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="pagination">
          <button onClick={goToPrevGroup} disabled={startPage === 1} className="page-btn">
            &laquo;
          </button>

          {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(
            (pageNum) => (
              <button
                key={pageNum}
                className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
                onClick={() => goToPage(pageNum)}
              >
                {pageNum}
              </button>
            )
          )}

          <button onClick={goToNextGroup} disabled={endPage === totalPages} className="page-btn">
            &raquo;
          </button>
        </div>
      </div>
    </>
  );
}

export default MyPostList;
