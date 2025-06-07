import React, { useEffect, useState } from 'react';
import HomeBar from '../../components/HomeBar';
import { Link } from 'react-router-dom';
import './MainPage.css';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick"; 
import api from '../../api/api';
import BoardSection from '../../components/BoardSection';
import {
  fallbackQnaPosts,
  fallbackFreePosts,
  fallbackTipPosts,
} from '../../data/fallbackPosts';

const bannerData = [
  { title: "오늘은 000님의 생일입니다! 🥳", description: "생일 축하 메시지를 남겨보세요!" },
  { title: "Tackit에 오신 걸 환영합니다! 🎉", description: "새로운 소식과 업데이트를 확인해보세요!" },
  { title: "즐거운 하루 보내세요! 🌈", description: "오늘도 행복한 하루 되시길 바랍니다!" },
];

function MainPage() {
  const [tipPosts, setTipPosts] = useState([]);
  const [freePosts, setFreePosts] = useState([]);
  const [qnaPosts, setQnaPosts] = useState([]);

  useEffect(() => {
    // TIP 게시글 3개
    api.get('/api/tip-posts')
      .then((res) => {
        const sorted = res.data.content
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3);
        setTipPosts(sorted);
      })
      .catch(() => {
        const fallback = fallbackTipPosts.content
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3);
        setTipPosts(fallback);
      });

    // 자유게시판 최신순 5개
    api.get('/api/free-posts?page=0&size=5&sort=createdAt,desc')
      .then((res) => {
        setFreePosts(res.data.content.slice(0, 5));
      })
      .catch(() => {
        setFreePosts(fallbackFreePosts.content.slice(0, 5));
      });

    // 질문게시판 최신순 5개
    api.get('/api/qna-post/list?page=0&size=5&sort=createdAt,desc')
      .then((res) => {
        setQnaPosts(res.data.content.slice(0, 5));
      })
      .catch(() => {
        setQnaPosts(fallbackQnaPosts.content.slice(0, 5));
      });
  }, []);

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

      {/* 슬라이드 배너 */}
      <section className="birthday-banner">
        <Slider {...sliderSettings}>
          {bannerData.map((item, index) => (
            <div key={index} className="banner-slide">
              <h2>{item.title}</h2>
              <p>{item.description}</p>
            </div>
          ))}
        </Slider>
      </section>

      <div className="main-container">
        {/* TIP 게시판 (제목만) */}
        <section className="tip-section">
          <h3>
            <span>선임자의 TIP</span>
            <Link to="/tip" className="more-link">+ 더보기</Link>
          </h3>
          <p>선배는 회사생활 팁 글 작성과 신입은 자유롭게 읽을 수 있어요!</p>
          <div className="tip-boxes">
            {tipPosts.map((tip) => (
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

        {/* 자유게시판 */}
        <BoardSection
          title="자유게시판"
          description="신입과 선배 모두 게시글, 댓글 작성이 자유롭게 가능해요!"
          posts={freePosts}
          boardPath="free"
        />

        {/* 질문게시판 */}
        <BoardSection
          title="질문게시판"
          description="신입은 질문글만, 선배는 답글만 달 수 있어요!"
          posts={qnaPosts}
          boardPath="qna"
        />
      </div>
    </div>
  );
}

export default MainPage;
