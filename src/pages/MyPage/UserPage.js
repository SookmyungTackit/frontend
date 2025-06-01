import React, { useEffect, useState } from 'react';
import HomeBar from '../../components/HomeBar';
import './UserPage.css';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api'; // axios 인스턴스 (baseURL 설정됨)
import useFetchUserInfo from '../../hooks/useFetchUserInfo';

const MyPage = () => {
  const navigate = useNavigate();
  const { userInfo, loading, error } = useFetchUserInfo();
  const role = localStorage.getItem('role');

  console.log('🔍 userInfo:', userInfo);
  console.log('🔍 userInfo.yearsOfService:', userInfo.yearsOfService);
  console.log('🔍 type of yearsOfService:', typeof userInfo.yearsOfService);

  if (loading) return <p>로딩 중...</p>;

  return (
    <>
      <HomeBar />
      <div className="mypage-container">
        <h2>마이페이지</h2>

        {/* 내 정보 */}
        <section className="mypage-section" aria-labelledby="info-title">
          <h3 id="info-title">내 정보</h3>

          <div className="info-row">
            <label htmlFor="nickname">닉네임</label>
            <div id="nickname" className="info-box">{userInfo.nickname}</div>
          </div>

          <div className="info-row">
            <label htmlFor="joinedYear">입사년도</label>
            <div id="joinedYear" className="info-box">{userInfo.joinedYear}</div>
          </div>

          <div className="info-row">
            <label htmlFor="yearsOfService">연차</label>
            <div id="yearsOfService" className="info-box">{userInfo.yearsOfService}</div>
          </div>
        </section>

        {/* 정보 수정 */}
        <section className="mypage-section" aria-labelledby="edit-title">
          <h3 id="edit-title">정보 수정</h3>
          <div className="btn-row">
            <button className="mypage-btn" onClick={() => navigate('/mypage/edit-nickname')}>
              닉네임 변경
            </button>
          </div>
          <div className="btn-row">
            <button className="mypage-btn" onClick={() => navigate('/mypage/edit-password')}>
              비밀번호 변경
            </button>
          </div>
        </section>

        {/* 글보기 */}
            {userInfo.yearsOfService >= 2 ? (
              <>
              {console.log('✅ 선임자용 UI 렌더링')}
              <section className="mypage-section" aria-labelledby="posts-title">
                <h3 id="posts-title">글보기</h3>
                <div className="btn-row">
                  <button className="mypage-btn" onClick={() => navigate('/mypage/mytip')}>
                    선임자의 TIP 내가 쓴 글 보기
                  </button>
                </div>
                <div className="btn-row">
                  <button className="mypage-btn" onClick={() => navigate('/mypage/mypostpage')}>
                    자유게시판 내가 쓴 글 보기
                  </button>
                </div>
                <div className="btn-row">
                  <button className="mypage-btn" onClick={() => navigate('/mypage/myfreecomments')}>
                    자유게시판 내가 쓴 댓글 보기
                  </button>
                  <button className="mypage-btn" onClick={() => navigate('/mypage/myqnacomments')}>
                    질문게시판 내가 쓴 댓글 보기
                  </button>
                </div>
                <div className="btn-row">
                  <button className="mypage-btn" onClick={() => navigate('/mypage/bookmarked')}>
                    찜한 글 보기
                  </button>
                </div>
              </section>

            </>
            ) : (
              <>
              {console.log('🟡 뉴비용 UI 렌더링')}
              <section className="mypage-section" aria-labelledby="posts-title">
                <h3 id="posts-title">글보기</h3>
                <div className="btn-row">
                  <button className="mypage-btn" onClick={() => navigate('/mypage/myqnaposts')}>
                    질문게시판 내가 쓴 글 보기
                  </button>
                </div>
                <div className="btn-row">
                  <button className="mypage-btn" onClick={() => navigate('/mypage/mypostpage')}>
                    자유게시판 내가 쓴 글 보기
                  </button>
                </div>
                <div className="btn-row">
                  <button className="mypage-btn" onClick={() => navigate('/mypage/myfreecomments')}>
                    자유게시판 내가 쓴 댓글 보기
                  </button>
                </div>
                <div className="btn-row">
                  <button className="mypage-btn" onClick={() => navigate('/mypage/bookmarked')}>
                    찜한 글 보기
                  </button>
                </div>
              </section>
              </>
            )}

        {/* 관리자 기능 - role이 'admin'일 때만 보임 */}
        {role === 'ADMIN' && (
          <section className="mypage-section" aria-labelledby="admin-title">
            <h3 id="admin-title">관리자</h3>
            <div className="btn-row">
              <button className="mypage-btn" onClick={() => navigate('/admin/users')}>
                회원 관리
              </button>
            </div>
            <div className="btn-row">
              <button className="mypage-btn" onClick={() => navigate('/mypage/post-management')}>
                게시글 관리
              </button>
            </div>
          </section>
        )}

        <button className="withdraw-btn">탈퇴하기</button>
      </div>
    </>
  );
};

export default MyPage;
