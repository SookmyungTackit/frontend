import axios from "axios";

// ✅ axios 인스턴스 생성
const api = axios.create({
  baseURL: " ", // 백엔드 서버 주소
});

// ✅ 토큰 재발급 함수
const reissueAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    const response = await axios.post("/auth/reissue", null, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    const { accessToken, refreshToken: newRefreshToken } = response.data;

    // 새 토큰 저장
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", newRefreshToken);

    return accessToken;
  } catch (error) {
    console.error("토큰 재발급 실패:", error);
    // ✅ 재발급 실패 → 로그인 페이지로 강제 이동
    window.location.href = "/login";
    return null;
  }
};

// ✅ 요청 인터셉터 (API 호출 시 자동으로 accessToken 붙이기)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ 응답 인터셉터 (401 에러 발생 시 토큰 재발급 & 요청 재시도)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // 무한 루프 방지

      const newAccessToken = await reissueAccessToken();
      if (newAccessToken) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest); // 실패한 요청 재시도
      }
    }
    return Promise.reject(error);
  }
);

export default api;
