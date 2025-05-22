import React from 'react';
import HomeBar from '../../components/HomeBar';
import './UserPage.css';
import { useNavigate } from 'react-router-dom';

const MyPage = () => {
  const navigate = useNavigate(); 
  
  const nickname = '현재유저';
  const joinedYear = 2022;
  const yearsOfService = 4;
  const role = 'admin';

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
                <div id="nickname" className="info-box">{nickname}</div>
            </div>

            <div className="info-row">
                <label htmlFor="joinedYear">입사년도</label>
                <div id="joinedYear" className="info-box">{joinedYear}</div>
            </div>

            <div className="info-row">
                <label htmlFor="yearsOfService">연차</label>
                <div id="yearsOfService" className="info-box">{yearsOfService}</div>
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
        <section className="mypage-section" aria-labelledby="posts-title">
          <h3 id="posts-title">글보기</h3>
          <div className="btn-row">
            <button
              className="mypage-btn"
              onClick={() => navigate('/mypage/mypostpage')}
            >
              내가 쓴 글 보기
            </button>
          </div>
          <div className="btn-row">

          <button
              className="mypage-btn"
              onClick={() => navigate('/mypage/myfreecomments')} 
            >
              자유게시판 내가 쓴 댓글 보기
            </button>
          
            <button
              className="mypage-btn"
              onClick={() => navigate('/mypage/myqnacomments')} 
            >
              질문게시판 내가 쓴 댓글 보기
            </button>
          </div>
          <div className="btn-row">
            <button
              className="mypage-btn"
              onClick={() => navigate('/mypage/bookmarked')} 
            >
              찜한 글 보기
            </button>
          </div>
        </section>

         {/* 관리자 기능 - role이 'admin'일 때만 보임 */}
        {role === 'admin' && (
          <section className="mypage-section" aria-labelledby="admin-title">
            <h3 id="admin-title">관리자</h3>
            <div className="btn-row">
              <button className="mypage-btn" onClick={() => navigate('/admin/users')}>
                회원 관리
              </button>
            </div>
            <div className="btn-row">
              <button className="mypage-btn" onClick={() => navigate('/mypage/post-management')}>
                가입 현황 및 신고글 관리
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
