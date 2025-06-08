import React from 'react';
import { Link } from 'react-router-dom';
import './BoardSection.css';

const formatTags = (tags) => {
  if (!Array.isArray(tags) || tags.length === 0 || !tags[0]) return '';
  if (tags.length > 1) {
    return `#${tags[0]} +${tags.length - 1}`;
  }
  return `#${tags[0]}`;
};

function BoardSection({ title, description, posts, boardPath }) {
  return (
    <section className="board-section">
      <h3>
        {title}
        <Link to={`/${boardPath}`} className="more-link">+ 더보기</Link>
      </h3>
      <p>{description}</p>

      <ul className="post-list">
        {Array.isArray(posts) && posts.length > 0 ? (
          posts.map((post) => (
            <li key={post.id || post.postId} className="post-item">
              <Link
                to={`/${boardPath}/${post.id || post.postId}`}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  textDecoration: 'none',
                  color: 'inherit',
                  width: '100%',
                  height: '100%',
                }}
              >
                <div className="post-left">
                  <span className="post-title">{post.title}</span>
                </div>

                <div className="post-right post-meta">

                  <span className="post-date">
                    <img src="/date.svg" alt="date" className="post-icon" />
                    <span className="date">
                      {new Date(post.createdAt).toLocaleString('ko-KR')}
                    </span>
                  </span>

                  <span className="post-tag">
                    <img src="/tag.svg" alt="tag" className="post-icon" />
                    {formatTags(post.tags)}
                  </span>
                </div>
              </Link>
            </li>
          ))
        ) : (
          <li>게시글이 없습니다.</li>
        )}
      </ul>
    </section>
  );
}

export default BoardSection;
