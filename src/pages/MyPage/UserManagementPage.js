import React, { useEffect, useState } from 'react';
import HomeBar from '../../components/layout/HomeBar';
import './UserManagementPage.css';
import api from '../../api/api'; // ✅ axios 인스턴스

const USERS_PER_PAGE = 5;

export default function UserManagementPage() {
  const [filter, setFilter] = useState('ACTIVE');
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState([]);

  // ✅ 회원 목록 불러오기
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await api.get('/api/admin/members', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error('회원 목록 불러오기 실패:', error);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users
    .filter((user) => user.status === filter)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="user-page-container">
      <HomeBar />
      <div className="user-content">
        <h2 className="user-title">회원 정보</h2>

        <div className="user-tab-buttons">
          <button
            onClick={() => {
              setFilter('ACTIVE');
              setCurrentPage(1);
            }}
            className={`user-tab-button ${
              filter === 'ACTIVE' ? 'active-tab' : 'inactive-tab'
            }`}
          >
            사용 계정
          </button>
          <button
            onClick={() => {
              setFilter('DELETED');
              setCurrentPage(1);
            }}
            className={`user-tab-button ${
              filter === 'DELETED' ? 'active-tab' : 'inactive-tab'
            }`}
          >
            탈퇴 계정
          </button>
        </div>

        <table className="user-table">
          <thead>
            <tr>
              <th>닉네임</th>
              <th>이메일</th>
              <th>상태</th>
              <th>가입 일자</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user, idx) => (
              <tr key={idx}>
                <td>{user.nickname}</td>
                <td>{user.email}</td>
                <td>
                  <span
                    className={`user-status-badge ${
                      user.status === 'ACTIVE' ? 'status-active' : 'status-inactive'
                    }`}
                  >
                    {user.status === 'ACTIVE' ? '사용 중' : '탈퇴'}
                  </span>
                </td>
                <td>{user.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>

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
  );
}
