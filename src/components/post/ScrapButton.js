// ReportButton.js
import React, { useState } from 'react';
import api from '../../api/api';
import { toast } from 'react-toastify';

export function ScrapButton({ scrapUrl, onScrapSuccess }) {
    const [loading, setLoading] = useState(false);
  
    const handleScrap = async () => {
      if (loading) return;
      if (!scrapUrl) return alert('스크랩 URL이 없습니다.');
      setLoading(true);
      try {
        const res = await api.post(scrapUrl);
        toast.success(res.data?.message || '게시글을 스크랩하였습니다.');
        if (onScrapSuccess) onScrapSuccess(res);
      } catch (err) {
        toast.error(
          err.response?.data?.message || '스크랩 처리 중 오류가 발생했습니다.'
        );
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <>
        <style>{`
          .bookmark-wrapper {
            display: flex;
            justify-content: flex-end;
            margin-top: 20px;
          }
  
          .bookmark-button {
            position: absolute;
            bottom: 20px;
            right: 20px;
            width: 80px;
            height: 36px;
            padding: 8px 14px;
            background-color: #4D77FF;
            color: white;
            border: none;
            border-radius: 20px;
            font-size: 14px;
            cursor: pointer;
            transition: background-color 0.2s ease;
          }
  
          .bookmark-button:hover {
            background-color: #5A95FF;
          }
        `}</style>
        <button
          className="extra-action-button bookmark-button"
          onClick={handleScrap}
          disabled={loading}
        >
          찜
        </button>
      </>
    );
  }  