import React, { useEffect, useState } from 'react';
import HomeBar from '../../components/HomeBar';
import './UserManagementPage.css';
import api from '../../api/api';
import usersFromApi from '../../data/users';

const USERS_PER_PAGE = 5;
const PAGE_GROUP_SIZE = 5;

export default function UserManagementPage() {
  const [filter, setFilter] = useState('ACTIVE'); // 사용자 상태 필터
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCount: 0,
    monthlyCount: 0,
    weeklyCount: 0,
  });
  const role = localStorage.getItem('role');

  // 사용자 목록 불러오기
  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        alert('로그인이 필요합니다.');
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/api/admin/members', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data?.length > 0 ? response.data : usersFromApi);
      } catch (error) {
        console.error('회원 목록 불러오기 실패:', error);
        setUsers(usersFromApi);
      } finally {
        setLoading(false);
      }
    };

    if (role === 'ADMIN') fetchUsers();
    else setLoading(false);
  }, [role]);

  // 통계 정보 불러오기
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

    if (role === 'ADMIN') fetchStats();
  }, [role]);

  // 필터링 및 정렬
  const filteredUsers = users
    .filter((user) => user.status === filter)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const currentGroup = Math.ceil(currentPage / PAGE_GROUP_SIZE);
  const groupStart = (currentGroup - 1) * PAGE_GROUP_SIZE + 1;
  const groupEnd = Math.min(groupStart + PAGE_GROUP_SIZE - 1, totalPages);
  const visiblePages = [];
  for (let i = groupStart; i <= groupEnd; i++) visiblePages.push(i);

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  if (loading) return <div>로딩 중...</div>;

  if (role !== 'ADMIN') {
    return (
      <div className="user-page-container">
        <HomeBar />
        <div className="user-content">
          <h2 className="user-title">🚫 관리자만 접근할 수 있습니다.</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="user-page-container">
      <HomeBar />
      <div className="user-content">
        <h1 className="dashboard-title">Dashboard</h1>

        {/* 가입자 통계 */}
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

        <h2 className="user-title">회원 정보</h2>

        {/* 필터 탭 */}
        <div className="user-tab-buttons">
          <button
            onClick={() => {
              setFilter('ACTIVE');
              setCurrentPage(1);
            }}
            className={`user-tab-button ${filter === 'ACTIVE' ? 'active-tab' : 'inactive-tab'}`}
          >
            사용 계정
          </button>
          <button
            onClick={() => {
              setFilter('DELETED');
              setCurrentPage(1);
            }}
            className={`user-tab-button ${filter === 'DELETED' ? 'active-tab' : 'inactive-tab'}`}
          >
            탈퇴 계정
          </button>
        </div>

        {/* 사용자 목록 */}
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

        {/* 페이지네이션 */}
        <div className="pagination">
          <button
            className="page-button"
            onClick={() => handlePageClick(groupStart - 1)}
            disabled={groupStart === 1}
          >
            ←
          </button>
          {visiblePages.map((pageNum) => (
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
            onClick={() => handlePageClick(groupEnd + 1)}
            disabled={groupEnd === totalPages}
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
