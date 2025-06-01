import { useEffect, useState } from 'react';
import api from '../api/api';

const useFetchUserInfo = () => {
  const [userInfo, setUserInfo] = useState({
    nickname: "기본값",
    joinedYear: 2025,
    yearsOfService: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('accessToken');

        console.log('token:', token);

        // ✅ 토큰 없으면 요청 중단
        if (!token) {
          setError(new Error('토큰 없음'));
          setLoading(false);
          return;
        }

        const response = await api.get('/api/members/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log('✅ 백엔드 응답:', response.data); // 👈 여기가 핵심!
          setUserInfo(response.data);          
      } catch (err) {
        console.error('사용자 정보 불러오기 실패:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  return { userInfo, loading, error };
};

export default useFetchUserInfo;
