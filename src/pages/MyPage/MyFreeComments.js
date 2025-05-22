import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PostPageList.css';
import HomeBar from '../../components/HomeBar';

import { dummyMyFreeComments } from '../../data/dummyMyFreeComments';
import { dummyFreePosts } from '../../data/dummyFreePosts';

function MyFreeComments() {
  const navigate = useNavigate();

  const sortByDate = (a, b) => new Date(b.createdAt) - new Date(a.createdAt);

  const freeComments = dummyMyFreeComments
    .map(comment => {
      const post = dummyFreePosts.find(p => p.id === comment.postId);
      return {
        ...comment,
        postTitle: post?.title,
        postContent: post?.content,
      };
    })
    .sort(sortByDate);

  return (
    <>
      <HomeBar />

      <div className="freepost-banner">
        <h1>자유게시판 내가 쓴 댓글</h1>
        <p>마이페이지 &gt; 자유게시판 내가 쓴 댓글 보기</p>
      </div>

      <div className="freepost-container">
        <div className="freepost-list">
          {freeComments.length === 0 ? (
            <p>작성한 댓글이 없습니다.</p>
          ) : (
            freeComments.map((comment) => (
              <div
                key={comment.commentId}
                className="post-card"
                onClick={() => navigate(`/free/${comment.postId}`)}
              >
                <div className="post-meta">
                  <span className="board-type">자유게시판</span>
                  <span className="date">
                    {comment.date}
                  </span>
                </div>
                <div className="comment-preview">💬 {comment.content}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default MyFreeComments;
