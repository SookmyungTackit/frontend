import React, { useEffect, useState } from 'react';
import api from '../../api/api'; // 위치 맞게 수정!

const dummyMyInfo = {
  nickname: '현재유저',
  joinedYear: 2022,
  yearsOfService: 4,
};

function MyInfo({ children }) {
    const [myInfo, setMyInfo] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      async function fetchMyInfo() {
        try {
          const { data } = await api.get('/members/me');
          setMyInfo(data);
        } catch (err) {
          setMyInfo(dummyMyInfo);
        } finally {
          setLoading(false);
        }
      }
      fetchMyInfo();
    }, []);
  
    if (typeof children === "function") {
      // ✅ 여기서 값 확인
      console.log('MyInfo - myInfo:', myInfo);
      console.log('MyInfo - loading:', loading);
      return children(myInfo, loading);
    }
    return null;
  }  

export default MyInfo;
