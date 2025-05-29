import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FreePostWrite.css';
import HomeBar from '../../components/layout/HomeBar';
import { toast } from 'react-toastify';
import api from '../../api/api';

function FreePostWrite() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagIds, setTagIds] = useState([]);
  const [tagOptions, setTagOptions] = useState([]);

  useEffect(() => {
    async function fetchTags() {
      try {
        const { data } = await api.get('/qna_tags/list');
        setTagOptions(data);
      } catch (err) {
        toast.error('태그 목록을 불러오지 못했습니다.');
        console.error(err);
      }
    }
    fetchTags();
  }, []);

  const toggleTagSelection = (tagId) => {
    setTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.warn('제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      const payload = {
        title,
        content,
        tagIds,
      };
      const { data } = await api.post('/api/free-posts', payload);
      toast.success('글이 작성되었습니다!');
      navigate(`/free/${data.postId}`);
    } catch (err) {
      toast.error('글 작성에 실패했습니다.');
      console.error(err);
    }
  };

  return (
    <>
      <HomeBar />

      <div className="qnapost-write-container">
        <h1 className="board-title" onClick={() => navigate('/qna')}>
          질문 게시판
        </h1>
        <form className="write-form" onSubmit={handleSubmit}>
          <button type="submit" className="write-submit-button">
            등록
          </button>

          <p className="write-label">글 제목</p>
          <input
            type="text"
            className="write-title-input"
            placeholder="글 제목은 내용을 대표할 수 있도록 간결하게 작성해 주세요."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <p className="write-label">태그 선택</p>
          <div className="tag-buttons">
            {Array.isArray(tagOptions) && tagOptions.length > 0 ? (
              tagOptions.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  className={`tag-button ${tagIds.includes(tag.id) ? 'selected' : ''}`}
                  onClick={() => toggleTagSelection(tag.id)}
                >
                  #{tag.tagName}
                </button>
              ))
            ) : (
              <p style={{ color: '#aaa', fontSize: '14px' }}>불러올 수 있는 태그가 없습니다.</p>
            )}
          </div>


          <p className="write-label">내용</p>
          <textarea
            className="write-textarea"
            placeholder="궁금한 내용을 작성해주세요."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </form>
      </div>
    </>
  );
}

export default FreePostWrite;
