import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './QnaPostDetail.css';
import HomeBar from '../../components/HomeBar';

const dummyPosts = [
  {
    id: 1,
    nickname: '닉네임',
    date: '2022년 10월 14일 오전 9시 30분',
    tag: 'Engineering',
    title: '처음이라 많이 떨리네요! 😂 신입 인사드립니다.',
    content:
      '첫 직장에서의 인사라 설렘과 긴장이 공존합니다. 함께할 팀원들과 협업을 통해 즐겁고 뜻깊은 시간을 보내고 싶습니다.',
  },
  {
    id: 2,
    nickname: '선배1',
    date: '2022년 11월 02일 오후 2시 15분',
    tag: 'Product',
    title: '프로덕트 팀에서 협업 잘하는 팁!',
    content:
      '신입분들과의 소통을 잘 하기 위해선 일일 체크인과 주간 회고가 정말 도움이 됩니다. 자유롭게 질문해주세요 :)',
  },
  {
    id: 3,
    nickname: '사원2',
    date: '2023년 1월 10일 오전 11시 00분',
    tag: 'People',
    title: '다들 점심 뭐 드시나요?',
    content: '요즘 구내식당 메뉴가 살짝 질리네요. 근처 추천 식당 있으신가요?',
  },
  {
    id: 4,
    nickname: '신입3',
    date: '2023년 3월 7일 오후 4시 45분',
    tag: 'Sales',
    title: '첫 미팅 후기 공유드려요!',
    content:
      '오늘 처음으로 고객사 미팅 다녀왔습니다. 긴장했지만 팀장님 덕분에 잘 마무리했어요. 배운 점 간단히 정리해봅니다.',
  },
];

function QnaPostDetail() {
    const textareaRef = useRef(null);
    const { postId } = useParams();
    const navigate = useNavigate();
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
  
    const post = dummyPosts.find((p) => p.id === parseInt(postId));
  
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
        <div className="freepost-detail-container">
          <h1 className="board-title" onClick={() => navigate(-1)}>
            질문 게시판
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