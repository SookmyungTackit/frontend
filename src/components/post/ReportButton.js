// ReportButton.js
import React, { useState } from 'react';
import api from '../../api/api';
import { toast } from 'react-toastify';

export function ReportButton({ reportUrl, onReportSuccess }) {
  const [loading, setLoading] = useState(false);

  const handleReport = async () => {
    if (loading) return;
    if (!reportUrl) return alert('신고 URL이 없습니다.');
    const confirmed = window.confirm('정말로 신고하시겠습니까?');
    if (!confirmed) return;

    setLoading(true);
    try {
      const res = await api.post(reportUrl);
      toast.success(res.data?.message || '게시글을 신고하였습니다.');
      if (onReportSuccess) onReportSuccess(res);
    } catch (err) {
      toast.error(
        err.response?.data?.message || '신고 처리 중 오류가 발생했습니다.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className="extra-action-button report-button"
      onClick={handleReport}
      disabled={loading}
    >
      신고하기
    </button>
  );
}
