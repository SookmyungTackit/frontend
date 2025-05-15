import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './TipPostDetail.css';
import HomeBar from '../../components/HomeBar';
import { dummyTipPosts } from '../../data/dummyTipPosts';
import { useLocation } from 'react-router-dom';


function TipPostDetail() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const currentUser = '현재유저'; // 이건 예시, 실제로는 로그인한 사용자 정보로 대체해야 함
  const location = useLocation();
  const from = location.state?.from;

  const post = dummyTipPosts.find((p) => p.id === parseInt(postId, 10));

  if (!post) return <div>해당 게시글을 찾을 수 없습니다.</div>;

  return (
    <>
      <HomeBar />
      <div className="tippost-detail-container">
        <h1 className="board-title" onClick={() => navigate('/tip')}>
          선임자의 TIP
        </h1>

        <div className="tippost-box">
          <div className="tippost-header">
            <div className="tippost-actions">
              {post.writer === currentUser ? (
                <>
                  <button onClick={() => navigate(`/tip/edit/${postId}`)}>수정하기</button>
                  <button
                    onClick={() => {
                      const confirmed = window.confirm('이 글을 삭제하시겠습니까?');
                      if (confirmed) {
                        if (from === 'my-posts') {
                          navigate('/mypage/mypostpage');
                        } else {
                          navigate('/tip');
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
            <span>{post.writer}</span> {/* nickname → writer로 통일 */}
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
      </div>
    </>
  );
}

export default TipPostDetail;
