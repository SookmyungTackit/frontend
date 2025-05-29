// MainPage.js
import React, { useState, useEffect } from 'react';
import HomeBar from '../../components/layout/HomeBar';
import { Link } from 'react-router-dom';
import './MainPage.css';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick"; 
import BoardSection from '../../components/BoardSection';
import api from '../../api/api';




const bannerData = [
  {
    title: "오늘은 000님의 생일입니다! 🥳",
    description: "생일 축하 메시지를 남겨보세요!",
  },
  {
    title: "Tackit에 오신 걸 환영합니다! 🎉",
    description: "새로운 소식과 업데이트를 확인해보세요!",
  },
  {
    title: "즐거운 하루 보내세요! 🌈",
    description: "오늘도 행복한 하루 되시길 바랍니다!",
  },
];


function MainPage() {
  const [freePosts, setFreePosts] = useState([]);
  const [qnaPosts, setQnaPosts] = useState([]);
  const [tipPosts, setTipPosts] = useState([]);

  useEffect(() => {
    async function fetchFreePosts() {
      try {
        const { data } = await api.get('/api/free-posts');
        setFreePosts(data);
        const qnaRes = await api.get('/qna_post/list'); // ✅ 질문 게시판 데이터 호출
        setQnaPosts(qnaRes.data);
        const tipRes = await api.get('/api/tip/tip-posts'); // ✅ TIP 데이터
        setTipPosts(tipRes.data);

      } catch (err) {
        console.error('자유게시판 글 불러오기 실패:', err);
      }
    }
    fetchFreePosts();
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 400,
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
        {bannerData.map((item, index) => (
          <div key={index} className="banner-slide">
            <h2>{item.title}</h2>
            <p>{item.description}</p>
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
        {Array.isArray(tipPosts) &&
          tipPosts
            .slice()
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 3)
            .map((tip) => (
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


        <BoardSection
        title="자유게시판"
        description="신입과 선배 모두 게시글, 댓글 작성이 자유롭게 가능해요!"
        posts={freePosts}
        boardPath="free"
      />

        <BoardSection
          title="질문게시판"
          description="신입은 질문글로, 선배는 답글로 만날 수 있어요!"
          posts={qnaPosts}
          boardPath="qna"
        />

      </div>
    </div>
  );
}

export default MainPage;
