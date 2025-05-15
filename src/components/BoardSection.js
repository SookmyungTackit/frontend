// components/BoardSection.js
import React from 'react';
import { Link } from 'react-router-dom';
import './BoardSection.css';


function BoardSection({ title, description, posts, boardPath }) {
  return (
    <section className="board-section">
      <h3>
        {title}
        <Link to={`/${boardPath}`} className="more-link">+ 더보기</Link>
      </h3>
      <p>{description}</p>
      <ul className="post-list">
        {posts
          .slice() // 원본 배열 변경 방지
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // 최신 순 정렬
          .slice(0, 5) // 최신글 5개만
          .map((post) => {
            const formattedDate = new Date(post.created_at).toLocaleString('ko-KR', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            });

            return (
              <li key={post.id} className="post-item">
                <div className="post-left">
                  <Link to={`/${boardPath}/${post.id}`} className="post-title-link">
                    <span className="post-title">{post.title}</span>
                  </Link>
                </div>
                <div className="post-right">
                  <span className="post-writer">
                    <img src="/nickname.svg" alt="writer" className="icon" />
                    {post.writer}
                  </span>
                  <span className="post-date">
                    <img src="/date.svg" alt="date" className="icon" />
                    {formattedDate}
                  </span>
                  <span className="post-tag">
                    <img src="/tag.svg" alt="tag" className="icon" />
                    {post.tag}
                  </span>
                </div>
              </li>
            );
          })}
      </ul>

    </section>
  );
}



export default BoardSection;
