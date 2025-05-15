import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './QnaPostEdit.css'; // QnA 스타일 (작성 페이지와 통일)
import HomeBar from '../../components/HomeBar';
import { dummyQnaPosts } from '../../data/dummyQnaPosts';
import { toast } from 'react-toastify';

function QnaPostEdit() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const post = dummyQnaPosts.find((p) => p.id === parseInt(postId, 10));
  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.content || '');
  const [tag, setTag] = useState(post?.tag || 'Engineering');

  const tagOptions = ['Product', 'Engineering', 'People', 'Sales'];

  if (!post) return <div>해당 게시글을 찾을 수 없습니다.</div>;

  const handleSave = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.warn('제목과 내용을 모두 입력해주세요!');
      return;
    }

    post.title = title;
    post.content = content;
    post.tag = tag;

    toast.success('게시글이 수정되었습니다.');
    navigate(`/qna/${postId}`);
  };

  const handleCancel = () => {
    navigate(`/qna/${postId}`);
  };

  return (
    <>
      <HomeBar />
      <div className="freepost-write-container">
        <h1 className="board-title" onClick={() => navigate('/qna')}>
          질문 게시판
        </h1>

        <form className="write-form" onSubmit={handleSave}>
          <div className="button-group">
            <button type="button" className="button-common button-gray" onClick={handleCancel}>
              취소
            </button>
            <button type="submit" className="button-common">
              저장
            </button>
          </div>

          <p className="write-label">글 제목</p>
          <input
            type="text"
            className="write-title-input"
            placeholder="글 제목은 내용을 대표할 수 있도록 간결하게 작성해 주세요."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="tag-buttons">
            {tagOptions.map((t) => (
              <button
                key={t}
                type="button"
                className={`tag-button ${tag === t ? 'selected' : ''}`}
                onClick={() => setTag(t)}
              >
                #{t}
              </button>
            ))}
          </div>

          <p className="write-label">내용</p>
          <textarea
            className="write-textarea"
            placeholder="질문에 대한 답변을 작성해주세요."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </form>
      </div>
    </>
  );
}

export default QnaPostEdit;
