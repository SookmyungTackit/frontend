import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './FreePostDetail.css';
import HomeBar from '../../components/HomeBar';
import { dummyFreePosts } from '../../data/dummyFreePosts';

function FreePostDetail() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const textareaRef = useRef(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  const post = dummyFreePosts.find((p) => p.id === parseInt(postId, 10));

  if (!post) return <div>해당 게시글을 찾을 수 없습니다.</div>;

  const handleTextareaChange = (e) => {
    setComment(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleCommentSubmit = () => {
    if (!comment.trim()) {
      alert('댓글을 입력해주세요.');
      return;
    }

    const newComment = {
      id: Date.now(),
      nickname: '현재유저',
      content: comment.trim(),
      date: new Date().toLocaleString('ko-KR'),
    };

    setComments((prev) => [newComment, ...prev]);
    setComment('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  return (
    <>
      <HomeBar />
      <div className="freepost-detail-container">
      <h1 className="board-title" onClick={() => navigate('/freeboard')}>
        자유 게시판
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
            <span>{post.nickname}</span> · <span>{post.date}</span>
          </div>

          <div className="detail-content">{post.content}</div>

          <button
            className="bookmark-button"
            onClick={() => alert('찜 기능 구현 예정')}
          >
            찜
          </button>
        </div>

        {/* 댓글 목록 */}
        <div className="comment-list">
          <h3 className="comment-title">댓글 {comments.length}개</h3>
          {comments.map((c) => (
            <div key={c.id} className="comment-item">
              <div className="comment-meta">
                <strong>{c.nickname}</strong> · <span>{c.date}</span>
              </div>
              <p className="comment-text">{c.content}</p>
            </div>
          ))}
        </div>

        {/* 댓글 입력 */}
        <div className="comment-wrapper">
          <div className="textarea-wrapper">
            <textarea
              ref={textareaRef}
              value={comment}
              onChange={handleTextareaChange}
              placeholder="자유롭게 답변을 작성해주세요."
              className="floating-textarea"
            />
            <div className="button-float-layer">
              <button className="floating-button" onClick={handleCommentSubmit}>
                답글 등록
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FreePostDetail;