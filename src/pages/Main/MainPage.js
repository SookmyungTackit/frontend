// MainPage.js
import React from 'react';
import HomeBar from '../../components/HomeBar';
import { Link } from 'react-router-dom';
import './MainPage.css';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick"; 
import { dummyFreePosts } from '../../data/dummyFreePosts';
import { dummyQnaPosts } from '../../data/dummyQnaPosts';
import { dummyTipPosts } from '../../data/dummyTipPosts';

const bannerData = [
  "오늘은 000님의 생일입니다! 🥳",
  "Tackit에 오신 걸 환영합니다! 🎉",
  "즐거운 하루 보내세요! 🌈"
];

function MainPage() {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 4000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  return (
    <div>
      <HomeBar />

      {/* 배너 */}
      <section className="birthday-banner">
        <Slider {...sliderSettings}>
          {bannerData.map((text, index) => (
            <div key={index} className="banner-slide">
              <h2>{text}</h2>
              <p>모두 축하해주세요!</p>
            </div>
          ))}
        </Slider>
      </section>

      <div className="main-container">
        <section className="tip-section">
          <h3>
            <span>선임자의 TIP</span>
            <Link to="/tip" className="more-link">+ 더보기</Link>
          </h3>
          <p>선배는 회사생활 팁 글 작성과 신입은 자유롭게 읽을 수 있어요!</p>
          <div className="tip-boxes">
            {dummyTipPosts.map((tip) => (
              <Link
                key={tip.id}
                to={`/tip/${tip.id}`}
                className="tip-box"
                style={{ textDecoration: 'none' }}
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
            {dummyFreePosts.slice(0, 5).map(post => {
              const formattedDate = new Date(post.created_at).toLocaleString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false  // 24시간제
              });

              return (
                <li key={post.id} className="post-item">
                  <Link to={`/freeboard/${post.id}`} className="post-title-link">
                    <span className="post-title">{post.title}</span>
                  </Link>
                  <span className="post-meta">
                    {post.writer} | {formattedDate} | {post.tag}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>


        <section className="board-section">
          <h3>질문게시판 <Link to="/qna" className="more-link">+ 더보기</Link></h3>
          <p>신입은 질문글로, 선배는 답글로 만날 수 있어요!</p>
          <ul className="post-list">
            {dummyQnaPosts.slice(0, 5).map(post => {
              const formattedDate = new Date(post.created_at).toLocaleString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              });

              return (
                <li key={post.id} className="post-item">
                  <Link to={`/qna/${post.id}`} className="post-title-link">
                    <span className="post-title">{post.title}</span>
                  </Link>
                  <span className="post-meta">
                    {post.writer} | {formattedDate} | {post.tag}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}

export default MainPage;
