import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Bookmarked.css';
import HomeBar from '../../components/HomeBar';
import api from '../../api/api';

function Bookmarked() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('tip');
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const pageGroupSize = 5;

  // ✅ fallback 더미 데이터 정의
  const fallbackData = {
    tip: {
      content: [
        {
          tipId: 1,
          title: '2025/05/26',
          contentPreview: '팁 ) 월요일 날씨 모름',
          authorName: '영영신',
          createdAt: '2025-05-26T16:55:22.233909',
          type: 'Tip',
        },
      ],
      totalPages: 1,
    },
    free: {
      content: [
        {
          freeId: 2,
          title: '2025/05/26',
          contentPreview: '자유 ) 월요일 날씨 모름',
          authorName: '영영신',
          createdAt: '2025-05-27T22:27:15.846678',
          type: 'Free',
          tags: ['태그1', '태그2'],
        },
      ],
      totalPages: 1,
    },
    qna: {
      content: [
        {
          postId: 1,
          title: '본문1 33제목',
          contentPreview: '내용이이5',
          writer: 'test1',
          createdAt: '2025-05-27T20:24:20.359041',
          type: 'QnA',
          tags: ['태그1', '태그3'],
        },
      ],
      totalPages: 1,
    },
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const pageParam = currentPage - 1;
        let url = '';
        if (activeTab === 'tip') {
          url = `/api/mypage/tip-scraps?page=${pageParam}`;
        } else if (activeTab === 'free') {
          url = `/api/mypage/free-scraps?page=${pageParam}`;
        } else if (activeTab === 'qna') {
          url = `/api/qna-post/scrap?page=${pageParam}`;
        }
        const res = await api.get(url);
        setPosts(res.data.content);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        setPosts(fallbackData[activeTab].content);
        setTotalPages(fallbackData[activeTab].totalPages);
      }
    };

    fetchPosts();
  }, [activeTab, currentPage]);

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

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const getBoardInfo = (post) => {
    if (activeTab === 'tip') {
      return {
        id: post.tipId,
        type: '선임자의 TIP',
        path: 'tip',
        writer: post.authorName,
      };
    } else if (activeTab === 'free') {
      return {
        id: post.freeId,
        type: '자유게시판',
        path: 'free',
        writer: post.authorName,
      };
    } else if (activeTab === 'qna') {
      return {
        id: post.postId,
        type: '질문게시판',
        path: 'qna',
        writer: post.writer,
      };
    }
  };
  

  return (
    <>
      <HomeBar />

      <div className="freepost-banner">
        <h1>찜한 글</h1>
        <p>마이페이지 &gt; 찜한 글 보기</p>
      </div>



      <div className="freepost-container">

       <div className="bookmark-tabs">
         <button onClick={() => handleTabClick('tip')} className={activeTab === 'tip' ? 'active' : ''}>TIP 게시판</button>
         <button onClick={() => handleTabClick('free')} className={activeTab === 'free' ? 'active' : ''}>자유게시판</button>
         <button onClick={() => handleTabClick('qna')} className={activeTab === 'qna' ? 'active' : ''}>질문게시판</button>
        </div>
        <div className="freepost-list">
          {posts.map((post) => {
            const { id, type, path } = getBoardInfo(post);

            return (
              <div
                key={id}
                className="post-card"
                onClick={() => navigate(`/${path}/${id}`)}
              >
                <div className="post-meta">
                  <span className="board-type">{type}</span>
                  <span className="writer"> {getBoardInfo(post).writer}</span>
                  <span className="date"> {new Date(post.createdAt).toLocaleString('ko-KR')}</span>
                  {post.tags && (
                    <span className="tags">
                      {post.tags.map((tag, i) => (
                        <span key={i} className="tag">#{tag} </span>
                      ))}
                    </span>
                  )}
                </div>
                <div className="post-title">{post.title}</div>
                <div className="post-content-preview">
                  {post.content
                    ? post.content.split('\n').map((line, i) => (
                        <React.Fragment key={i}>
                          {line}
                          <br />
                        </React.Fragment>
                      ))
                    : post.contentPreview // ✅ content가 없으면 preview 대체
                  }
                  {post.content && post.content.length >= 100 && '...'}
                </div>
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
