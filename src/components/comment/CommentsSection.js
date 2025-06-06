import React, { useEffect, useState } from 'react';
import CommentForm from './CommentForm';
import MyCommentActions from './MyCommentActions';
import CommentReportButton from './CommentReportButton';
import CommentList from './CommentList';

const dummyComments = [
  {
    id: 1,
    postId: 1,
    writer: '현재유저',
    content: '내 댓글 예시!',
    createdAt: '2025-05-23T08:00:00',
  },
  {
    id: 2,
    postId: 1,
    writer: 'test2',
    content: '남의 댓글 예시!',
    createdAt: '2025-05-23T08:10:00',
  },
];

function CommentsSection({ postId, apiUrl, currentUser }) {
  const [comments, setComments] = useState([]);

  // 댓글 목록 조회
  useEffect(() => {
    fetch(`${apiUrl}?postId=${postId}`)
      .then(res => res.json())
      .then(data => setComments(data))
      .catch(() => setComments(dummyComments.filter(c => c.postId == postId)));
  }, [apiUrl, postId]);

  // 댓글 등록 성공 시
  const handleCommentSuccess = (newComment) => {
    setComments(prev => [newComment, ...prev]);
  };

  // 댓글 수정 성공 시
  const handleUpdateLocal = (updated) => {
    setComments(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  // 댓글 삭제 성공 시
  const handleDeleteLocal = (id) => {
    setComments(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="comments-section">
        {comments.length === 0 && <div>댓글 0개</div>}
        <CommentList postId={postId} apiUrl="/api/free-comments" />
       {/* ✅ 댓글 목록이 먼저 */}
        {comments.map((comment) =>
        comment.writer === currentUser ? (
            <MyCommentActions
            key={comment.id}
            comment={comment}
            apiUrl={apiUrl}
            currentUser={currentUser}
            onUpdateLocal={handleUpdateLocal}
            onDeleteLocal={handleDeleteLocal}
            />
        ) : (
            <div key={comment.id} className="comment-item">
            <div className="comment-meta">
                <strong>{comment.writer}</strong> ·{' '}
                <span>{new Date(comment.createdAt).toLocaleString()}</span>
            </div>
            <div className="comment-text">{comment.content}</div>
            <CommentReportButton commentId={comment.id} apiUrl={apiUrl} />
            </div>
        )
        )}

        {/* ✅ 입력창이 그 아래 */}
        <CommentForm
        postId={postId}
        apiUrl={apiUrl}
        currentUser={currentUser}
        onCommentSuccess={handleCommentSuccess}
        />
      </div>
  );
}

export default CommentsSection;
