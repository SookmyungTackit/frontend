import React from 'react';
import { Link } from 'react-router-dom';
import './BoardSection.css';

const formatTags = (tags) => {
  if (!Array.isArray(tags)) return tags || '-';
  if (tags.length > 3) {
    return `${tags.slice(0, 3).join(', ')} +${tags.length - 3}`;
  }
  return tags.join(', ');
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
              {/* ✅ Link는 li 안에서 한 번만! */}
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
                  <span className="post-writer">
                    <img src="/nickname.svg" alt="writer" className="post-icon" />
                    {post.writer}
                  </span>

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
