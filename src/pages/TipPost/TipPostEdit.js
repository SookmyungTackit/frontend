import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './TipPostEdit.css';
import HomeBar from '../../components/HomeBar';
import { toast } from 'react-toastify';
import api from '../../api/api';

function TipPostEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    async function fetchPost() {
      try {
        const { data } = await api.get(`/api/tip-posts/${id}`);
        setTitle(data.title);
        setContent(data.content);
      } catch (err) {
        toast.error('게시글 정보를 불러오는 데 실패했습니다.');
        console.error(err);
      }
    }
    fetchPost();
  }, [id]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.warn('제목과 내용을 모두 입력해주세요!');
      return;
    }

    try {
      const payload = { title, content };
      await api.put(`/api/tip-posts/${id}`, payload);
      toast.success('게시글이 수정되었습니다.');
      navigate(`/tip/${id}`);
    } catch (err) {
      toast.error('수정에 실패했습니다.');
      console.error(err);
    }
  };

  const handleCancel = () => {
    navigate(`/tip/${id}`);
  };

  return (
    <>
      <HomeBar />
      <div className="freepost-write-container">
        <h1 className="board-title" onClick={() => navigate('/tip')}>
          선임자의 Tip 게시판
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
