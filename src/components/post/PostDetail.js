import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/api';
import MyInfo from '../mypage/MyInfo';
import MyPostActions from './MyPostActions';
import {ReportButton} from './ReportButton';
import {ScrapButton} from './ScrapButton';
import CommentsSection from '../comment/CommentsSection';
import './PostDetail.css';

const dummyPost = {
  id: 101,
  writer: "test1",
  title: "예시 게시글 제목",
  content: "게시글 본문 내용 예시입니다.\n여러 줄도 잘 보입니다.",
  tags: ["태그1", "태그2"],
  createdAt: "2025-05-23T08:00:00"
};

function PostDetail({
  fetchPost,
  boardType = 'post', // 기본값: post
  deleteApiPathTemplate,
  reportUrlTemplate,
  scrapUrlTemplate,
  from
}) {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loadingPost, setLoadingPost] = useState(true);

  useEffect(() => {
    async function getPost() {
      try {
        const { data } = await api.get(`/api/${boardType}-posts/${postId}`);
        setPost(data);
      } catch (err) {
        console.error('게시글 불러오기 실패:', err);
        setPost(dummyPost);
      } finally {
        setLoadingPost(false);
      }
    }
    getPost();
  }, [postId, boardType]);
  

  if (loadingPost) return <div>게시글을 불러오는 중...</div>;
  if (!post) return <div>해당 게시글을 찾을 수 없습니다.</div>;

  return (
    <MyInfo>
      {(myInfo, loadingMyInfo) => {
        console.log('PostDetail - myInfo:', myInfo);
        console.log('PostDetail - loadingMyInfo:', loadingMyInfo);
        if (loadingMyInfo) return <div>내 정보를 불러오는 중...</div>;
        if (!myInfo) return <div>내 정보를 표시할 수 없습니다.</div>;

        const isMyPost = post.writer === myInfo.nickname;

        // 각 api path 템플릿에서 실제 url로 변환
        const deleteApiPath = typeof deleteApiPathTemplate === 'function'
          ? deleteApiPathTemplate(postId)
          : (deleteApiPathTemplate || `/api/${boardType}-posts/${postId}`);
        const reportUrl = typeof reportUrlTemplate === 'function'
          ? reportUrlTemplate(postId)
          : (reportUrlTemplate || `/api/${boardType}-posts/${postId}/report`);
        const scrapUrl = typeof scrapUrlTemplate === 'function'
          ? scrapUrlTemplate(postId)
          : (scrapUrlTemplate || `/api/${boardType}-posts/${postId}/scrap`);

        return (
          <div className="post-detail-container">
            <h1 className="board-title" onClick={() => navigate(`/${boardType}`)}>
              {boardType === 'qna' ? '질문 게시판'
                : boardType === 'free' ? '자유 게시판'
                : boardType === 'tip' ? '선임자의 Tip 게시판'
                : '게시판'}
            </h1>
            <div className="post-detail-box">
              <div className="post-detail-header">
                <div className="post-detail-tags">
                  {post.tags?.length
                    ? post.tags.map((tag, i) => <span key={i}>#{tag} </span>)
                    : <span>#태그없음</span>
                  }
                </div>
                <div className="post-detail-actions">
                  {isMyPost
                    ? <MyPostActions
                        post={post}
                        boardType={boardType}
                        postId={postId}
                        currentUser={myInfo.nickname}
                        from={from}
                        deleteApiPath={deleteApiPath}
                      />

                    :  <div className="post-extra-actions">
                    <ReportButton
                      reportUrl={reportUrl}
                      onReportSuccess={() => console.log('신고 성공')}
                    />
                  </div>
                  }
                </div>
              </div>
              <h1 className="detail-title">{post.title}</h1>
              <div className="detail-meta">
                <span>{post.writer}</span>
                <span>{new Date(post.createdAt).toLocaleString('ko-KR')}</span>
              </div>
              <div className="detail-content">{post.content}</div>
              {!isMyPost && (
                    <ScrapButton
                    scrapUrl={scrapUrl}
                    onScrapSuccess={() => console.log('찜 성공')}
                    />
                )}
            </div>

            {/* 🔽 댓글 섹션! */}
            <CommentsSection
            postId={post.id}
            apiUrl={`/api/${boardType}-comments`}
            currentUser={myInfo.nickname}
            />
          </div>
        );
      }}
    </MyInfo>
  );
}

export default PostDetail;
