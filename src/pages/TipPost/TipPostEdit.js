import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './TipPostEdit.css'; // Tip 스타일 (작성 페이지와 통일)
import HomeBar from '../../components/HomeBar';
import { dummyTipPosts } from '../../data/dummyTipPosts';
import { toast } from 'react-toastify';

function TipPostEdit() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const post = dummyTipPosts.find((p) => p.id === parseInt(postId, 10));
  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.content || '');

  if (!post) return <div>해당 게시글을 찾을 수 없습니다.</div>;

  const handleSave = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.warn('제목과 내용을 모두 입력해주세요.');
      return;
    }

    post.title = title;
    post.content = content;

    toast.success('게시글이 수정되었습니다.');
    navigate(`/tip/${postId}`);
  };

  const handleCancel = () => {
    navigate(`/tip/${postId}`);
  };

  return (
    <>
      <HomeBar />
      <div className="freepost-write-container">
        <h1 className="board-title" onClick={() => navigate('/tip')}>
          선임자의 TIP
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

          <p className="write-label">내용</p>
          <textarea
            className="write-textarea"
            placeholder="신입사원에게 도움이 될 회사 생활 팁이나 조언을 작성해 주세요."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </form>
      </div>
    </>
  );
}

export default TipPostEdit;
