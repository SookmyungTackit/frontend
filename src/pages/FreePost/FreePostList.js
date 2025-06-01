import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FreePostList.css';
import HomeBar from '../../components/HomeBar';
import api from '../../api/api';
import useFetchUserInfo from '../../hooks/useFetchUserInfo';

// ✅ fallback 데이터
const fallbackResponse = {
  page: 0,
  content: [
    {
      postId: 2,
      writer: '기본값',
      title: '요즘 날씨 너무 좋지 않나요?',
      content:
        '요즘 날씨가 정말 좋더라고요. 해가 길어지니까 퇴근하고도 밖에 나가 산책할 시간이 생겨서 기분이 좋아요. 어제는 집 근처 호수공원에 가서 커피 한 잔 마시며 걷고 왔어요. 바람도 선선하고 하늘도 맑아서 정말 힐링이었습니다. 특히 해 질 녘 노을이 너무 예뻐서 사진도 몇 장 찍었어요. 이런 날씨가 오래오래 계속됐으면 좋겠네요. 혹시 여러분은 요즘 어떻게 지내세요? 추천할 만한 산책 코스 있으시면 댓글로 알려주세요!',
      tags: ['일상', '산책', '추천'],
      createdAt: '2025-05-26T00:49:09.773772',
    },
    {
      postId: 1,
      writer: 'test',
      title: '프론트엔드 스터디 같이 하실 분!',
      content:"안녕하세요.\n오늘은 날씨가 정말 좋네요!\n\n내일은 비가 온다고 합니다.",
      tags: ['스터디', '프론트엔드', 'React', '모집'],
      createdAt: '2025-05-26T00:47:58.054746',
    },
  ],
  size: 5,
  totalElements: 2,
  totalPages: 1,
};



function FreePostList() {
  const navigate = useNavigate();
  const [tagList, setTagList] = useState([]);
  const [selectedTagId, setSelectedTagId] = useState(null);
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const { userInfo } = useFetchUserInfo();

  const postsPerPage = 5;
  const pageGroupSize = 5;

  // ✅ 태그 불러오기
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await api.get('/api/free_tags');
        const tagData = Array.isArray(res.data?.content)
          ? res.data.content
          : Array.isArray(res.data)
          ? res.data
          : [];

        setTagList(tagData);
      } catch (err) {
        console.error('❌ 태그 목록 불러오기 실패:', err);
        setTagList([
          { id: 2, tagName: '태그2' },
          { id: 3, tagName: '태그3' },
        ]);
      }
    };
    fetchTags();
  }, []);

  // ✅ 게시글 불러오기 (전체 또는 태그별)
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const url = selectedTagId
          ? `/api/free_tags/${selectedTagId}/posts?page=${currentPage}&size=5&sort=createdAt,desc`
          : `/api/free-posts?page=${currentPage}&size=5&sort=createdAt,desc`;

        const res = await api.get(url);
        setPosts(res.data?.content || []);
        setTotalPages(res.data?.totalPages || 0);
      } catch (err) {
        console.error('❌ 게시글 불러오기 실패:', err);
        setPosts(fallbackResponse?.content || []);
        setTotalPages(fallbackResponse?.totalPages || 1);
      }
    };
    fetchPosts();
  }, [currentPage, selectedTagId]);

  const handleTagClick = (clickedId) => {
    setSelectedTagId((prev) => (prev === clickedId ? null : clickedId));
    setCurrentPage(0);
  };

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
        <h1>자유 게시판</h1>
        <p>Home &gt; 자유 게시판</p>
      </div>

      <div className="freepost-container">
        <div className="freepost-subtext-wrapper">
          <div className="freepost-subtext">
            "자유 게시판"은 신입과 선배 모두 자유롭게 게시글과 댓글을 작성할 수 있습니다.
          </div>
        </div>

        <div className="freepost-tags">
          {tagList.map((tag) => (
            <button
              key={tag.id}
              className={`tag-button ${selectedTagId === tag.id ? 'active-tag' : ''}`}
              onClick={() => handleTagClick(tag.id)}
            >
              #{tag.tagName}
            </button>
          ))}

            <button className="write-button" onClick={() => navigate('/free/write')}>
              글쓰기
            </button>
        </div>

        <div className="freepost-list">
          {filteredPosts.length === 0 ? (
            <div className="no-result">게시글이 없습니다.</div>
          ) : (
            filteredPosts.map((post) => (
              <div
                key={post.postId}
                className="post-card"
                onClick={() => navigate(`/free/${post.postId}`)}
              >
                <div className="post-meta">
                  <span className="nickname">{post.writer}</span>
                  <span className="date">{new Date(post.createdAt).toLocaleString('ko-KR')}</span>
                  <span className="tags">
                    {Array.isArray(post.tags)
                      ? post.tags.map((tag, i) => `#${tag}`).join(' ')
                      : ''}
                  </span>
                </div>
                <div className="post-title">{post.title}</div>
                <div className="post-content-preview">
                {post.content.split('\n').map((line, i) => (
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

export default FreePostList;
