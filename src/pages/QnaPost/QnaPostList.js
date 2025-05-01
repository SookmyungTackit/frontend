import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './QnaPostList.css';
import HomeBar from '../../components/HomeBar';

const dummyPosts = [
  {
    id: 1,
    nickname: '닉네임',
    date: '2022년 10월 14일 오전 9시 30분',
    tag: 'Engineering',
    title: '처음이라 많이 떨리네요! 😂 신입 인사드립니다.',
    content:
      '첫 직장에서의 인사라 설렘과 긴장이 공존합니다. 함께할 팀원들과 협업을 통해 즐겁고 뜻깊은 시간을 보내고 싶습니다.',
  },
  {
    id: 2,
    nickname: '선배1',
    date: '2022년 11월 02일 오후 2시 15분',
    tag: 'Product',
    title: '프로덕트 팀에서 협업 잘하는 팁!',
    content:
      '신입분들과의 소통을 잘 하기 위해선 일일 체크인과 주간 회고가 정말 도움이 됩니다. 자유롭게 질문해주세요 :)',
  },
  {
    id: 3,
    nickname: '사원2',
    date: '2023년 1월 10일 오전 11시 00분',
    tag: 'People',
    title: '다들 점심 뭐 드시나요?',
    content: '요즘 구내식당 메뉴가 살짝 질리네요. 근처 추천 식당 있으신가요?',
  },
  {
    id: 4,
    nickname: '신입3',
    date: '2023년 3월 7일 오후 4시 45분',
    tag: 'Sales',
    title: '첫 미팅 후기 공유드려요!',
    content:
      '오늘 처음으로 고객사 미팅 다녀왔습니다. 긴장했지만 팀장님 덕분에 잘 마무리했어요. 배운 점 간단히 정리해봅니다.',
  },
];

function QnaPostList() {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTag, setSelectedTag] = useState(null); // ✅ 추가

  const postsPerPage = 5;
  const pageGroupSize = 5;

  const filteredPosts = dummyPosts
    .filter((post) => {
      const matchesSearch =
        post.title.includes(searchKeyword) ||
        post.content.includes(searchKeyword) ||
        post.nickname.includes(searchKeyword);
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
        <h1>질문 게시판</h1>
        <p>Home &gt; 질문 게시판</p>
      </div>

      <div className="freepost-container">
        <div className="freepost-subtext-wrapper">
          <div className="freepost-subtext">
            “질문 게시판”은 신입은 질문글만 작성할 수 있으며, 선배는 답글만 작성할 수 있습니다. 
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
          <button className="write-button" onClick={() => navigate('/qna/write')}>
            글쓰기
          </button>
        </div>

        <div className="freepost-list">
          {currentPosts.map((post) => (
            <div
              key={post.id}
              className="post-card"
              onClick={() => navigate(`/qna/${post.id}`)}
            >
              <div className="post-meta">
                <span className="nickname">{post.nickname}</span>
                <span className="date">{new Date(post.created_at).toLocaleString('ko-KR')}</span>
                <span className="tag">{post.tag}</span>
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
