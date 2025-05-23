import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PostPageList.css';
import HomeBar from '../../components/layout/HomeBar';
import api from '../../api/api';

function MyFreeComments() {
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [myNickname, setMyNickname] = useState('');

  useEffect(() => {
    const fetchMyComments = async () => {
      try {
        const token = localStorage.getItem('accessToken');

        // 1. 내 정보 가져오기
        const meRes = await api.get('/members/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { nickname } = meRes.data;
        setMyNickname(nickname);

        // 2. 내 자유게시판 글 목록 가져오기
        const postsRes = await api.get('/mypage/free_posts', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const posts = postsRes.data; // [{ postId, title, ... }]

        // 3. 각 게시글에 대한 댓글 가져오기
        let userComments = [];
        for (const post of posts) {
          const res = await api.get(`/api/free-comments/${post.postId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const postComments = res.data;

          // 4. 내 댓글만 필터링 후 title 추가
          const filtered = postComments
            .filter((c) => c.writer === nickname)
            .map((c) => ({
              ...c,
              postId: post.postId,
              postTitle: post.title,
              createdAt: c.createdAt,
            }));

          userComments.push(...filtered);
        }

        // 5. 최신순 정렬
        userComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setComments(userComments);
      } catch (err) {
        console.error('내 댓글 불러오기 실패:', err);
      }
    };

    fetchMyComments();
  }, []);

  return (
    <>
      <HomeBar />

      <div className="freepost-banner">
        <h1>자유게시판 내가 쓴 댓글</h1>
        <p>마이페이지 &gt; 자유게시판 내가 쓴 댓글 보기</p>
      </div>

      <div className="freepost-container">
        <div className="freepost-list">
          {comments.length === 0 ? (
            <p>작성한 댓글이 없습니다.</p>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="post-card"
                onClick={() => navigate(`/free/${comment.postId}`)}
              >
                <div className="post-meta">
                  <span className="board-type">자유게시판</span>
                  <span className="date">
                    {new Date(comment.createdAt).toLocaleString('ko-KR')}
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
