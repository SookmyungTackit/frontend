import api from './api';

export const qnaCommentApi = {
  getComments: (postId) => api.get(`/qna_comment/${postId}`), //댓글 조회
  postComment: (postId, content) =>
    api.post('/qna_comment', { qnaPostId: postId, content }),//댓글 작성
  patchComment: (commentId, content) =>
    api.patch(`/qna_comment/${commentId}`, { content }),//댓글 수정
  deleteComment: (commentId) => api.delete(`/qna_comment/${commentId}`),//댓글 삭제
  reportComment: (commentId) => api.post(`/qna_comment/${commentId}/report`),//댓글 신고하기
};