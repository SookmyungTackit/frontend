import React from 'react';
import PostList from '../../components/post/PostList';
import { dummyQnaPosts } from '../../data/dummyQnaPosts';

function QnaPostList() {
  return (
    <PostList
      boardType="qna"
      title="질문 게시판"
      description="“질문 게시판”은 신입은 질문글만 작성할 수 있으며, 선배는 답글만 작성할 수 있습니다."
      dummyData={dummyQnaPosts}
      apiUrl="/qna_post/list"
      tagList={['Product', 'Engineering', 'People', 'Sales']}
    />
  );
}

export default QnaPostList;
