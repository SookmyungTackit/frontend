import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './FreePostDetail.css';
import HomeBar from '../../components/HomeBar';
import { dummyFreePosts } from '../../data/dummyFreePosts';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';


function FreePostDetail() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const textareaRef = useRef(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const currentUser = '현재유저'; // 이건 예시, 실제로는 로그인한 사용자 정보로 대체해야 함
  const location = useLocation();
  const from = location.state?.from; // 'my-posts' or undefined


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
      <h1 className="board-title" onClick={() => navigate('/free')}>
        자유 게시판
      </h1>

        <div className="freepost-box">
          <div className="freepost-header">
            <div className="freepost-tags">
              <span className="tag">#{post.tag.toLowerCase()}</span>
            </div>
            <div className="freepost-actions">
              {post.writer === currentUser ? (
                <>
                  <button onClick={() => navigate(`/free/edit/${postId}`)}>수정하기</button>
                  <button
                    onClick={() => {
                      const confirmed = window.confirm('이 글을 삭제하시겠습니까?');
                      if (confirmed) {
                        if (from === 'my-posts') {
                          navigate('/mypage/mypostpage');
                        } else {
                          navigate('/free');
                        }
                      }
                    }}
                  >
                    삭제하기
                  </button>

                </>
              ) : (
                <button onClick={() => alert('신고 되었습니다.')}>신고하기</button>
              )}
            </div>
          </div>

          <h1 className="detail-title">{post.title}</h1>
          <div className="detail-meta">
              <span>{post.writer}</span> 
              <span>{new Date(post.created_at).toLocaleString('ko-KR')}</span>
            </div>

          <div className="detail-content">{post.content}</div>

          <button
            className="bookmark-button"
            onClick={() => toast.success('찜 되었습니다.')}
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