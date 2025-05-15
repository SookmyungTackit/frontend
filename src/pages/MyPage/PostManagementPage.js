// PostManagementPage.jsx
import React, { useState } from 'react';
import HomeBar from '../../components/HomeBar';
import './PostManagementPage.css';
import reportedPosts from '../../data/reportedPosts';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const stats = {
  total: 2500,
  month: 600,
  week: 200
};

const joinData = [
  { name: 'Jan', count: 300 },
  { name: 'Feb', count: 250 },
  { name: 'Mar', count: 270 },
  { name: 'Apr', count: 230 },
  { name: 'May', count: 400 },
  { name: 'Jun', count: 280 },
  { name: 'Jul', count: 350 }
];

function formatTime(isoDate) {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now - date;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  return `${diffHours}h ago`;
}

const POSTS_PER_PAGE = 3;

export default function PostManagementPage() {
  const filteredPosts = reportedPosts.filter(post => post.reportCount >= 3);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);

  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

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
              <h3>{stats.total.toLocaleString()}</h3>
            </div>
            <div className="dashboard-card">
              <p>이번 달 가입자 수</p>
              <h3>{stats.month.toLocaleString()}</h3>
            </div>
            <div className="dashboard-card">
              <p>이번 주 가입자 수</p>
              <h3>{stats.week.toLocaleString()}</h3>
            </div>
          </div>

          <div className="chart-container">
            <p className="chart-title">회원가입</p>
            <p className="chart-subtitle">Jan 2024 ~ Jul 2024</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={joinData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#1f2d3d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

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
                  <button className="delete-btn">삭제</button>
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
