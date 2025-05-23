import React from 'react';
import HomeBar from '../../components/layout/HomeBar';
import PostDetail from '../../components/post/PostDetail';

// 필요하면 더미데이터/커스텀 fetchPost 등도 import

function FreePostDetail() {
  return (
    <>
      <HomeBar />
      <PostDetail
        boardType="free"
        // 필요시 fetchPost, deleteApiPathTemplate, reportUrlTemplate 등 커스텀 함수 props로 전달
        // fetchPost={ ... }
        // deleteApiPathTemplate={id => `/qna_post/${id}`}
        // reportUrlTemplate={id => `/qna_post/${id}/report`}
        // scrapUrlTemplate={id => `/qna_post/${id}/scrap`}
      />
    </>
  );
}

export default FreePostDetail;