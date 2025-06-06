import React, { useEffect, useState } from 'react';
import HomeBar from '../../components/HomeBar';
import './MyPage.css';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api'; // axios 인스턴스 (baseURL 설정됨)
import useFetchUserInfo from '../../hooks/useFetchUserInfo';
import { toast } from 'react-toastify'; 


const MyPage = () => {
  const navigate = useNavigate();
  const { userInfo, loading, error } = useFetchUserInfo();
  const role = localStorage.getItem('role');

  const handleWithdraw = async () => {
    const confirmed = window.confirm(
      '정말 탈퇴하시겠습니까?\n탈퇴 후에는 계정을 복구할 수 없습니다.'
    );
    if (!confirmed) return;
  
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      toast.error('인증 정보가 없습니다. 다시 로그인해주세요.');
      navigate('/login');
      return;
    }
  
    try {
      const response = await api.post(
        '/withdraw',
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
  
      toast.success(response.data.message || '탈퇴가 완료되었습니다.');
  
      // 로그아웃 처리
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('accessTokenExpiresIn');
      localStorage.removeItem('grantType');
      localStorage.removeItem('role');
  
      navigate('/login'); // ✅ 로그인 페이지로 이동
    } catch (err) {
      toast.error('탈퇴 처리 중 오류가 발생했습니다.');
    }
  };
  

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
        {role !== 'ADMIN' && (
          <>
            {userInfo.yearsOfService >= 2 ? (
              <>
                <section className="mypage-section" aria-labelledby="posts-title">
                  <h3 id="posts-title">내 활동</h3>
                  <div className="btn-row">
                    <button className="mypage-btn" onClick={() => navigate('/mypage/mytipposts')}>
                      선임자의 TIP 내가 쓴 글 보기
                    </button>
                  </div>
                  <div className="btn-row">
                    <button className="mypage-btn" onClick={() => navigate('/mypage/myfreeposts')}>
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
               
                <section className="mypage-section" aria-labelledby="posts-title">
                  <h3 id="posts-title">내 활동</h3>
                  <div className="btn-row">
                    <button className="mypage-btn" onClick={() => navigate('/mypage/myqnaposts')}>
                      질문게시판 내가 쓴 글 보기
                    </button>
                  </div>
                  <div className="btn-row">
                    <button className="mypage-btn" onClick={() => navigate('/mypage/myfreeposts')}>
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
              <button className="mypage-btn" onClick={() => navigate('/admin/report/:postType')}>
                게시글 관리
              </button>
            </div>
          </section>
        )}

          <button className="withdraw-btn" onClick={handleWithdraw}>
            탈퇴하기
          </button>
      </div>
    </>
  );
};

export default MyPage;
