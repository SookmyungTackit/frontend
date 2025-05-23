import React from 'react';
import PostList from '../../components/post/PostList';
import { dummyTipPosts } from '../../data/dummyTipPosts';

function TipPostList() {
  return (
    <>
      <PostList
        boardType="tip"
        title="선임자의 TIP"
        dummyData={dummyTipPosts}
        apiUrl="/api/tip/tip-posts"
        extraContent={
          <div className="post-subtext with-icon" style={{ marginBottom: '20px' }}>
            <img src="/warning.svg" alt="경고 아이콘" className="warning-icon" />
            <span>
              "선임자의 TIP"은 선배 사원만 글을 작성할 수 있으며, 신입 사원은 열람만 가능합니다.
            </span>
          </div>
        }
      />

    </>
  );
}

export default TipPostList;
