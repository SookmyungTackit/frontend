import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './FreePostWrite.css';
import HomeBar from '../../components/HomeBar';
import api from '../../api/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function FreePostWrite() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [tagList, setTagList] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await api.get('/api/free_tags');
        setTagList(res.data);
      } catch (err) {
        setTagList([
          { id: 2, tagName: '태그2' },
          { id: 3, tagName: '태그3' },
        ]);
      }
    };
    fetchTags();
  }, []);

  const handleTagToggle = (id) => {
    setSelectedTagIds((prev) =>
      prev.includes(id) ? prev.filter((tagId) => tagId !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.warn('제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      const res = await api.post('/api/free-posts', {
        title,
        content,
        tagIds: selectedTagIds,
      });      
      toast.success('글이 작성되었습니다!');
      navigate('/free');
    } catch (err) {
      console.error('글 작성 실패:', err);
      toast.error('글 작성에 실패했습니다.');
    }
  };

  return (
    <>
      <HomeBar />
      <div className="freepost-write-container">
        <h1 className="board-title" onClick={() => navigate('/free')}>
          자유 게시판
        </h1>
        <form className="write-form" onSubmit={handleSubmit}>
          <button className="write-submit-button" type="submit">등록</button>
          <p className="write-label">글 제목</p>
          <input
            type="text"
            className="write-title-input"
            placeholder="글 제목은 내용을 대표할 수 있도록 간결하게 작성해 주세요."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="tag-buttons">
            {tagList.map((tag) => (
              <button
                key={tag.id}
                type="button"
                className={`tag-button ${selectedTagIds.includes(tag.id) ? 'selected' : ''}`}
                onClick={() => handleTagToggle(tag.id)}
              >
                #{tag.tagName}
              </button>
            ))}
          </div>

          <p className="write-label">내용</p>
          <textarea
            className="write-textarea"
            placeholder="자유롭게 내용을 작성해주세요."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </form>
      </div>
    </>
  );
}

export default FreePostWrite;
