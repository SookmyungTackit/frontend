import React, { useEffect, useState } from 'react';
import HomeBar from '../../components/HomeBar';
import './PostManagementPage.css';
import api from '../../api/api';
import { toast } from 'react-toastify';

const POSTS_PER_PAGE = 5;

export default function PostManagementPage() {
  const [activeTab, setActiveTab] = useState('Free'); // ✅ 탭 상태
  const [disabledPosts, setDisabledPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const boardNameMap = {
    Free: '자유게시판',
    QnA: '질문게시판',
    Tip: '선임자의 TIP',
  };

  const fallbackData = {
    page: 0,
    content: [],
    size: 5,
    totalElements: 0,
    totalPages: 1,
  };

  const fetchDisabledPosts = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.get(`/api/admin/report/${activeTab}/posts`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: currentPage - 1, size: POSTS_PER_PAGE },
      });
  
      console.log(`📌 [${activeTab}] 응답 데이터 구조 확인:`);
      console.table(response.data.content); // 게시판별 post 객체 구조 보기
  
      setDisabledPosts(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('신고 게시글 불러오기 실패:', error);
      setDisabledPosts(fallbackData.content);
      setTotalPages(fallbackData.totalPages);
    }
  };
  

  const handleDelete = async (postId) => {
    const confirmed = window.confirm('정말 이 게시글을 삭제하시겠습니까?');
    if (!confirmed) return;

    try {
      const token = localStorage.getItem('accessToken');
      await api.delete(`/api/admin/report/${activeTab}/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('게시글이 삭제되었습니다.');
      fetchDisabledPosts();
    } catch (error) {
      console.error('삭제 실패:', error);
      toast.error('게시글 삭제에 실패했습니다.');
    }
  };

  const handleActivate = async (postId) => {
    const confirmed = window.confirm('이 게시글을 다시 활성화하시겠습니까?');
    if (!confirmed) return;

    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.patch(
        `/api/admin/report/${activeTab}/posts/${postId}/activate`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(response.data);
      fetchDisabledPosts();
    } catch (error) {
      console.error('활성화 실패:', error);
      toast.error('게시글 활성화에 실패했습니다.');
    }
  };

  useEffect(() => {
    fetchDisabledPosts();
  }, [activeTab, currentPage]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPostId = (post) => post.id;


  return (
    <>
      <HomeBar />
      <div className="post-management-container">
        <h2>신고 3회 이상 비활성화된 게시글</h2>

        <div className="bookmark-tabs">
          <button onClick={() => handleTabClick('Tip')} className={activeTab === 'Tip' ? 'active' : ''}>선임자의 TIP</button>
          <button onClick={() => handleTabClick('Free')} className={activeTab === 'Free' ? 'active' : ''}>자유게시판</button>
          <button onClick={() => handleTabClick('QnA')} className={activeTab === 'QnA' ? 'active' : ''}>질문게시판</button>
        </div>

        <ul className="post-management-list">
          {disabledPosts.map((post, index) => {
            const postId = getPostId(post);
            const postUrl = `/${activeTab.toLowerCase()}/${postId}`;
            const boardName = boardNameMap[activeTab];

            return (
              <li key={index} className="post-management-item">
                <div className="post-management-left">
                  <div className="post-management-icon">
                    <img src="/search.svg" alt="돋보기 아이콘" className="search-icon" />
                  </div>

                  <div className="post-management-texts" style={{ textDecoration: 'none', color: 'inherit', cursor: 'default' }}>
                    <div className="post-management-board">{boardName}</div>
                    <div className="post-management-title">{post.title}</div>
                    <div className="post-management-meta">
                      신고 수: {post.reportCount}회 Posted <span className="date">{new Date(post.createdAt).toLocaleString('ko-KR')}</span>, by @{post.nickname}
                    </div>
                  </div>
                </div>

                <div className="post-management-actions">
                  <button className="activate-btn" onClick={() => handleActivate(postId)}>활성화</button>
                  <button className="delete-btn" onClick={() => handleDelete(postId)}>삭제</button>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="pagination">
          <button onClick={() => handlePageClick(currentPage - 1)} disabled={currentPage === 1} className="page-button">←</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button key={pageNum} className={`page-button ${currentPage === pageNum ? 'active' : ''}`} onClick={() => handlePageClick(pageNum)}>{pageNum}</button>
          ))}
          <button onClick={() => handlePageClick(currentPage + 1)} disabled={currentPage === totalPages} className="page-button">→</button>
        </div>
      </div>
    </>
  );
}
