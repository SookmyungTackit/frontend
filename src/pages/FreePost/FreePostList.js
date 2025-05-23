import React from 'react';
import PostList from '../../components/post/PostList';
import { dummyFreePosts } from '../../data/dummyFreePosts';

function FreePostList() {
  return (
    <PostList
      boardType="free"
      title="자유 게시판"
      description="“자유 게시판”은 신입과 선배 모두 자유롭게 게시글과 댓글을 작성할 수 있습니다."
      dummyData={dummyFreePosts}
      apiUrl="/api/free-posts"
      tagList={['Product', 'Engineering', 'People', 'Sales']}
    />
  );
}

export default FreePostList;
