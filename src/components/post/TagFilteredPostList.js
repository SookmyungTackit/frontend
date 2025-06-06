import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import './Tag.css';

// 더미 데이터: 백엔드 응답 형식에 맞춤
const dummyPosts = [
  {
    writer: 'test1',
    title: '본문1 제목',
    content: '내용4',
    tags: ['태그1', '태그3', '태그2'],
    createdAt: '2025-05-13T19:34:53.52603'
  },
  {
    writer: 'test2',
    title: '질문글2',
    content: '질문글 내용',
    tags: ['태그2'],
    createdAt: '2025-05-14T09:12:21.712001'
  }
];

function TagFilteredPostList({
  tagId,                         // 필터할 태그 ID
  apiUrlBase = '/qna_tags',      // API base URL (게시판별 변경 가능)
  onPostClick                    // 게시글 클릭 시 콜백 (선택)
}) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const { data } = await api.get(`${apiUrlBase}/${tagId}/posts`);
        setPosts(data);
      } catch (err) {
        setPosts(dummyPosts);
        console.error('게시글 목록 불러오기 실패, 더미 데이터 사용', err);
      }
    }
    if (tagId) fetchPosts();
  }, [tagId, apiUrlBase]);

  if (!tagId) return <div style={{ padding: 24, color: '#aaa' }}>태그를 선택해 주세요.</div>;

  return (
    <div className="tag-post-list">
      {posts.length === 0 ? (
        <div style={{ padding: '32px', color: '#aaa' }}>해당 태그의 게시글이 없습니다.</div>
      ) : (
        posts.map((post, idx) => (
          <div
            key={idx}
            className="post-card"
            onClick={() => onPostClick && onPostClick(post)}
            style={{
              background: '#fff',
              border: '1px solid #e0e0e0',
              borderRadius: 12,
              padding: 24,
              marginBottom: 20,
              cursor: 'pointer'
            }}
          >
            <div className="post-meta" style={{ fontSize: 13, color: '#666', marginBottom: 6 }}>
              <span className="nickname">{post.writer}</span> |{' '}
              <span className="date">
                {new Date(post.createdAt).toLocaleString('ko-KR')}
              </span>
              <span style={{ marginLeft: 12 }}>
                {post.tags.map((t, i) => (
                  <span key={i} className="tag" style={{ color: '#4D77FF', marginRight: 6 }}>
                    #{t}
                  </span>
                ))}
              </span>
            </div>
            <div className="post-title" style={{ fontWeight: 600, fontSize: 17, marginBottom: 4 }}>
              {post.title}
            </div>
            <div className="post-content-preview" style={{ fontSize: 14, color: '#333' }}>
              {post.content}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default TagFilteredPostList;
