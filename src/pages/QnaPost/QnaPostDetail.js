import React, { useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './QnaPostDetail.css';
import HomeBar from '../../components/HomeBar';
import { dummyQnaPosts } from '../../data/dummyQnaPosts';

function QnaPostDetail() {
    const textareaRef = useRef(null);
    const { postId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from;

    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const currentUser = '현재유저'; // 이건 예시, 실제로는 로그인한 사용자 정보로 대체해야 함

  
    const post = dummyQnaPosts.find((p) => p.id === parseInt(postId));
  
    if (!post) return <div>해당 게시글을 찾을 수 없습니다.</div>;
  
    const handleTextareaChange = (e) => {
      setComment(e.target.value);
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
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
        <div className="qnapost-detail-container">
          <h1 className="board-title" onClick={() => navigate('/qna')}>
            질문 게시판
          </h1>
  
          <div className="qnapost-box">
            <div className="qnapost-header">
              <div className="qnapost-tags">
                <span className="tag">#{post.tag.toLowerCase()}</span>
              </div>
              <div className="qnapost-actions">
              {post.writer === currentUser ? (
               <>
               <button onClick={() => navigate(`/qna/edit/${postId}`)}>수정하기</button>
               <button
                 onClick={() => {
                   const confirmed = window.confirm('이 글을 삭제하시겠습니까?');
                   if (confirmed) {
                     if (from === 'my-posts') {
                       navigate('/mypage/mypostpage');
                     } else {
                       navigate('/qna');
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
              onClick={() => alert('찜 되었습니다.')}
            >
              찜
            </button>
          </div>
  
          {/* ✅ 댓글 목록 */}
          <div className="comment-list">
            <h3 className="comment-title">댓글 {comments.length}개</h3>
            {comments.map((c) => (
              <div key={c.id} className="comment-item">
                <div className="comment-meta">
                  <strong>{c.nickname}</strong> · <span>{c.date}</span>
                </div>
                <p className="comment-text">{c.content}</p> {/* ✅ 클래스명 수정 */}
              </div>
            ))}
          </div>
  
          {/* ✅ 댓글 입력 박스 */}
          <div className="comment-wrapper">
            <div className="textarea-wrapper">
              <textarea
                ref={textareaRef}
                value={comment}
                onChange={handleTextareaChange}
                placeholder="질문에 대한 답변을 작성해주세요."
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
  
  export default QnaPostDetail;