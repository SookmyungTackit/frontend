import React, { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../api/api';
import './PostEdit.css';

function PostEditForm({
  initialTitle = '',
  initialContent = '',
  initialTagId = null,
  tagOptions = null,       // [{ id: 1, name: "Engineering" }, ...] or null
  putUrl,                  // (postId) => url
  postId,
  onSuccess,
  navigateTo,
  navigate,
}) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [selectedTagId, setSelectedTagId] = useState(initialTagId);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.warn('제목과 내용을 모두 입력해주세요!');
      return;
    }
    try {
      let body;
      if (tagOptions) {
        body = {
          title,
          content,
          tagIds: [selectedTagId]
        };
      } else {
        body = { title, content };
      }

      const { data } = await api.put(putUrl(postId), body);

      toast.success('게시글이 수정되었습니다.');
      if (onSuccess) onSuccess(data);
      navigate(navigateTo);
    } catch (err) {
      toast.error('수정 중 오류가 발생했습니다.');
      console.error(err);
    }
  };

  return (
    <form className="write-form" onSubmit={handleSave}>
      <div className="button-group">
        <button
          type="button"
          className="button-common button-gray"
          onClick={() => navigate(navigateTo)}
        >
          취소
        </button>
        <button type="submit" className="button-common">
          저장
        </button>
      </div>

      <p className="write-label">글 제목</p>
      <input
        type="text"
        className="edit-title-input"
        placeholder="글 제목은 내용을 대표할 수 있도록 간결하게 작성해 주세요."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {tagOptions && (
        <div className="tag-buttons" style={{ marginBottom: 16 }}>
          {tagOptions.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`tag-button ${selectedTagId === t.id ? 'selected' : ''}`}
              onClick={() => setSelectedTagId(t.id)}
            >
              #{t.name}
            </button>
          ))}
        </div>
      )}

      <p className="write-label">내용</p>
      <textarea
        className="edit-content-textarea"
        placeholder="자유롭게 내용을 작성해주세요."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
    </form>
  );
}

export default PostEditForm;
