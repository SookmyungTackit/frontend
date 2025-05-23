import React, { useEffect, useState } from 'react';
import HomeBar from '../../components/layout/HomeBar';
import './PostManagementPage.css';
import api from '../../api/api';

const POSTS_PER_PAGE = 3;

function formatTime(isoDate) {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now - date;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  return `${diffHours}h ago`;
}

export default function PostManagementPage() {
  const [stats, setStats] = useState({
    totalCount: 0,
    monthlyCount: 0,
    weeklyCount: 0,
  });
  const [disabledPosts, setDisabledPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(disabledPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = disabledPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  // 📌 가입자 통계 불러오기
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await api.get('/api/admin/members/statistics', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(response.data);
      } catch (error) {
        console.error('통계 정보 불러오기 실패:', error);
      }
    };

    fetchStats();
  }, []);

  // 📌 비활성화된 게시글 불러오기
  useEffect(() => {
    const fetchDisabledPosts = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await api.get('/admin/free_post', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDisabledPosts(response.data);
      } catch (error) {
        console.error('비활성화된 게시글 불러오기 실패:', error);
      }
    };

    fetchDisabledPosts();
  }, []);

  const handleDeletePost = async (freePostId) => {
    try {
      const token = localStorage.getItem('accessToken');
      await api.delete(`/admin/free_post/${freePostId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('게시글이 삭제되었습니다.');
      window.location.reload();
    } catch (error) {
      console.error('게시글 삭제 실패:', error);
      alert('삭제에 실패했습니다.');
    }
  };

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <HomeBar />
      <div className="post-management-container">
        <div className="post-management-content">
          <h1 className="dashboard-title">Dashboard</h1>

          <div className="dashboard-cards">
            <div className="dashboard-card">
              <p>총 가입자 수</p>
              <h3>{stats.totalCount.toLocaleString()}</h3>
            </div>
            <div className="dashboard-card">
              <p>이번 달 가입자 수</p>
              <h3>{stats.monthlyCount.toLocaleString()}</h3>
            </div>
            <div className="dashboard-card">
              <p>이번 주 가입자 수</p>
              <h3>{stats.weeklyCount.toLocaleString()}</h3>
            </div>
          </div>

          {/* 📌 비활성화된 게시글 리스트 */}
          <h2>신고 3회 이상으로 비활성화된 게시글</h2>
          <ul className="post-management-list">
            {paginatedPosts.map((post, index) => (
              <li key={index} className="post-management-item">
                <div className="post-management-left">
                  <div className="post-management-icon">
                    <img src="/search.svg" alt="돋보기 아이콘" className="search-icon" />
                  </div>
                  <div className="post-management-texts">
                    <div className="post-management-title">{post.title}</div>
                    <div className="post-management-meta">
                      신고 수: {post.reportCount}회 Posted {formatTime(post.createdAt)}, by @{post.nickname}
                    </div>
                  </div>
                </div>
                <div className="post-management-actions">
                  <button className="activate-btn">활성화</button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeletePost(post.freePostId)}
                  >
                    삭제
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* Pagination */}
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
      </div>
    </>
  );
}
