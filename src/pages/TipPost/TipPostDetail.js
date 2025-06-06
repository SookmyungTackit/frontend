import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './TipPostDetail.css';
import HomeBar from '../../components/HomeBar';
import api from '../../api/api';
import useFetchUserInfo from '../../hooks/useFetchUserInfo';
import { toast } from 'react-toastify';

function TipPostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;

  const [post, setPost] = useState(null);
  const [isScrapped, setIsScrapped] = useState(false);

  const { userInfo } = useFetchUserInfo();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/api/tip-posts/${id}`);
        setPost(res.data);
      } catch (err) {
        setPost({
          writer: '기본',
          title: '본문1 제목',
          content: '내용4',
          createdAt: '2025-05-13T19:34:53.52603',
        });
      }
    };
    fetchPost();
  }, [id]);

  const handleDeletePost = async () => {
    const confirmed = window.confirm('이 글을 삭제하시겠습니까?');
    if (!confirmed) return;

    try {
      await api.delete(`/api/tip-posts/${id}`);
      toast.success('게시글이 삭제되었습니다.');
      if (from === 'my-posts') {
        navigate('/mypage/mypostpage');
      } else {
        navigate('/tip');
      }
    } catch (err) {
      toast.error('게시글 삭제에 실패했습니다.');
    }
  };

  const handleReportPost = async () => {
    const confirmed = window.confirm('정말 이 게시글을 신고하시겠습니까?');
    if (!confirmed) return;
  
    try {
      const res = await api.post(`/api/tip-posts/${id}/report`);
      toast.success('게시글을 신고하였습니다.');
    } catch (err) {
      toast.error('게시글 신고에 실패했습니다.');
    }
  };  

  const handleScrapToggle = async () => {
    try {
      const res = await api.post(`/api/tip-posts/${id}/scrap`);
      const message = res.data; // ✅ 그냥 문자열임
  
      if (typeof message === 'string') {
        if (message.includes("스크랩하였습니다")) {
          setIsScrapped(true);
          toast.success('찜 되었습니다.');
        } else if (message.includes("취소하였습니다")) {
          setIsScrapped(false);
          toast.info('찜이 취소되었습니다.');
        } else {
          toast.info(message);
        }
      } else {
        toast.error('예상하지 못한 응답입니다.');
      }
    } catch (err) {
      toast.error('찜 처리에 실패했습니다.');
    }
  };
  
  

  return (
    <>
      <HomeBar />
      <div className="tippost-detail-container">
        <h1 className="board-title" onClick={() => navigate('/tip')}>선임자의 TIP</h1>

        <div className="tippost-box">
          {post && (
            <>
              <div className="tippost-actions post-actions">
                {userInfo && post.writer === userInfo.nickname ? (
                  <>
                    <button onClick={() => navigate(`/tip/edit/${id}`)}>수정하기</button>
                    <button onClick={handleDeletePost}>삭제하기</button>
                  </>
                ) : userInfo && (
                  <button onClick={handleReportPost}>신고하기</button>
                )}
              </div>

              <h1 className="detail-title">{post.title}</h1>

              <div className="detail-meta">
                <span>{post.writer}</span>
                <span>{new Date(post.createdAt).toLocaleString('ko-KR')}</span>
              </div>
              <div className="detail-content">
                {post.content.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </div>
              <button className="bookmark-button" onClick={handleScrapToggle}>
                찜
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default TipPostDetail;
