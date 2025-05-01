import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './TipPostDetail.css';
import HomeBar from '../../components/HomeBar';
import { dummyTipPosts } from '../../data/dummyTipPosts';

function TipPostDetail() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const post = dummyTipPosts.find((p) => p.id === parseInt(postId, 10));

  if (!post) return <div>해당 게시글을 찾을 수 없습니다.</div>;

  return (
    <>
      <HomeBar />
      <div className="freepost-detail-container">
        <h1 className="board-title" onClick={() => navigate('/tip')}>
          선임자의 TIP
        </h1>

        <div className="post-box">
          <div className="post-header">
            <div className="post-tags">
              <span className="tag">#{post.tag.toLowerCase()}</span>
            </div>
            <div className="post-actions">
              <button onClick={() => alert('수정 기능 구현 예정')}>수정하기</button>
              <button onClick={() => alert('삭제 기능 구현 예정')}>삭제하기</button>
            </div>
          </div>

          <h1 className="detail-title">{post.title}</h1>
          <div className="detail-meta">
            <span>{post.nickname}</span> · <span>{new Date(post.created_at).toLocaleString('ko-KR')}</span>
          </div>

          <div className="detail-content">{post.content}</div>

          <button
            className="bookmark-button"
            onClick={() => alert('찜 되었습니다.')}
          >
            찜
          </button>
        </div>
      </div>
    </>
  );
}

export default TipPostDetail;