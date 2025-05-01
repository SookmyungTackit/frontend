// MainPage.js
import React from 'react';
import HomeBar from '../../components/HomeBar';
import { Link } from 'react-router-dom';
import './MainPage.css';
import { dummyFreePosts } from '../../data/dummyFreePosts';
import { dummyQnaPosts } from '../../data/dummyQnaPosts';
import { dummyTipPosts } from '../../data/dummyTipPosts';


function MainPage() {
  return (
    <div>
      <HomeBar />
      <div className="main-container">
        <section className="birthday-banner">
          <h2>오늘은 000님의 생일입니다! 🥳</h2>
          <p>모두 축하해주세요!</p>
        </section>

        <section className="tip-section">
          <h3>선임자의 TIP <Link to="/tip" className="more-link">+ 더보기</Link></h3>
          <div className="tip-boxes">
            {dummyTipPosts.map((tip) => (
              <Link
                key={tip.id}
                to={`/tip/${tip.id}`}
                className="tip-box"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                {tip.title}
              </Link>
            ))}
          </div>
        </section>


        <section className="board-section">
          <h3>자유게시판 <Link to="/freeboard" className="more-link">+ 더보기</Link></h3>
          <p>신입과 선배 모두 게시글, 댓글 작성이 자유롭게 가능해요!</p>
          <ul className="post-list">
            {dummyFreePosts.map(post => (
              <li key={post.id} className="post-item">
                <Link to={`/freeboard/${post.id}`} className="post-title-link">
                  <span className="post-title">{post.title}</span>
                </Link>
                <span className="post-meta">{post.writer} | {post.date} | {post.tag}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="board-section">
          <h3>질문게시판 <Link to="/qna" className="more-link">+ 더보기</Link></h3>
          <p>신입은 질문글로, 선배는 답글로 만날 수 있어요!</p>
          <ul className="post-list">
            {dummyQnaPosts.map(post => (
              <li key={post.id} className="post-item">
                <Link to={`/qna/${post.id}`} className="post-title-link">
                  <span className="post-title">{post.title}</span>
                </Link>
                <span className="post-meta">{post.writer} | {post.date} | {post.tag}</span>
              </li>
            ))}
          </ul>
        </section>

      </div>
    </div>
  );
}

export default MainPage;


