import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './QnaPostEdit.css';
import HomeBar from '../../components/layout/HomeBar';
import { toast } from 'react-toastify';
import api from '../../api/api';

function QnaPostEdit() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagOptions, setTagOptions] = useState([]); // 전체 태그 목록
  const [selectedTagId, setSelectedTagId] = useState(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        const { data } = await api.get(`/qna_post/${postId}`);
        setTitle(data.title);
        setContent(data.content);

        const tagsRes = await api.get('/qna_tags/list');
        setTagOptions(tagsRes.data);
        const matchedTag = tagsRes.data.find(tag => tag.tagName === data.tags[0]);
        setSelectedTagId(matchedTag?.id || null);
      } catch (err) {
        toast.error('게시글 정보를 불러오는 데 실패했습니다.');
        console.error(err);
      }
    }
    fetchPost();
  }, [postId]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.warn('제목과 내용을 모두 입력해주세요!');
      return;
    }

    try {
      const payload = {
        title,
        content,
        tagIds: selectedTagId ? [selectedTagId] : [],
      };
      await api.put(`/qna_post/${postId}`, payload);
      toast.success('게시글이 수정되었습니다.');
      navigate(`/qna/${postId}`);
    } catch (err) {
      toast.error('수정에 실패했습니다.');
      console.error(err);
    }
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

          <p className="write-label">태그 선택</p>
          <div className="tag-list">
            {tagOptions.map(tag => (
              <button
                key={tag.id}
                type="button"
                className={`tag-button${selectedTagId === tag.id ? ' active-tag' : ''}`}
                onClick={() => setSelectedTagId(tag.id)}
              >
                #{tag.tagName}
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