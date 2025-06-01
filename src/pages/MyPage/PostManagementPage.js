import React, { useEffect, useState } from 'react';
import HomeBar from '../../components/HomeBar';
import './PostManagementPage.css';
import api from '../../api/api';
import { useParams } from 'react-router-dom';

const POSTS_PER_PAGE = 5;

function formatTime(isoDate) {
  return new Date(isoDate).toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

// ✅ API 실패 시 사용할 더미 데이터
const fallbackData = {
  page: 0,
  content: [
    {
      title: "신고예시글제목",
      nickname: "ㅇㅇ",
      organization: "시종설",
      createdAt: "2025-05-28T22:08:21.369846",
      reportCount: 3
    }
  ],
  size: 5,
  totalElements: 1,
  totalPages: 1
};

export default function PostManagementPage() {
  const { postType } = useParams();
  const [disabledPosts, setDisabledPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const boardNameMap = {
    free: '자유게시판',
    qna: '질문게시판',
    tip: '선임자의 TIP',
  };

  const boardName = boardNameMap[postType] || '알 수 없는 게시판';

  useEffect(() => {
    const fetchDisabledPosts = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await api.get(`/api/admin/report/${postType}/posts`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { page: currentPage - 1, size: POSTS_PER_PAGE },
        });

        setDisabledPosts(response.data.content);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('신고 게시글 불러오기 실패:', error);
        // ✅ API 실패 시 fallback 사용
        setDisabledPosts(fallbackData.content);
        setTotalPages(fallbackData.totalPages);
      }
    };

    fetchDisabledPosts();
  }, [postType, currentPage]);

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <HomeBar />
      <div className="post-management-container">
        <h2>신고 3회 이상 비활성화된 게시글</h2>
        <ul className="post-management-list">
          {disabledPosts.map((post, index) => (
            <li key={index} className="post-management-item">
              <div className="post-management-left">
                <div className="post-management-icon">
                  <img src="/search.svg" alt="돋보기 아이콘" className="search-icon" />
                </div>
                <div className="post-management-texts">
                <div className="post-management-board">{boardName}</div>
                <div className="post-management-title">
                  {post.title}
                </div>
                  <div className="post-management-meta">
                    신고 수: {post.reportCount}회 Posted {formatTime(post.createdAt)}, by @{post.nickname}
                  </div>
                </div>
              </div>
              <div className="post-management-actions">
                <button className="activate-btn">활성화</button>
                <button className="delete-btn" disabled>
                  삭제
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className="pagination">
          <button
            className="page-button"
            onClick={() => handlePageClick(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ←
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              className={`page-button ${currentPage === pageNum ? 'active' : ''}`}
              onClick={() => handlePageClick(pageNum)}
            >
              {pageNum}
            </button>
          ))}
          <button
            className="page-button"
            onClick={() => handlePageClick(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            →
          </button>
        </div>
      </div>
    </>
  );
}
