import axios from "axios";

// ✅ axios 인스턴스 생성
const api = axios.create({
  baseURL: "https://5bae-61-40-226-235.ngrok-free.app",
  headers: {
    'ngrok-skip-browser-warning': 'any-value', // 이 한 줄 추가
  },
});


// ✅ 토큰 재발급 함수
const reissueAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    console.log("📦 기존 refreshToken:", refreshToken);

    const response = await axios.post(
      'https://b9c3-61-40-226-235.ngrok-free.app/auth/reissue',
      null,
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`
        }
      }
    );
    console.log("✅ 새 accessToken:", response.data.accessToken);

    const { accessToken, refreshToken: newRefreshToken } = response.data;


    console.log("✅ 새 accessToken:", accessToken);
    console.log("✅ 새 refreshToken:", newRefreshToken);

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", newRefreshToken);

    return accessToken;
  } catch (error) {
    console.error("❌ 토큰 재발급 실패 상태 코드:", error.response?.status);
    console.error("❌ 토큰 재발급 실패 응답:", error.response?.data || error.message);
    localStorage.removeItem("accessTokenExpiresIn"); // ✅ 로그인 페이지 타이밍 오류 방지
    window.location.href = "/login";
    return null;
  }
};

// ✅ 요청 인터셉터 (accessToken 자동 첨부)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    const authFreeUrls = [
      "/auth/sign-in",
      "/auth/sign-up",
      "/auth/check-email-auth",
      "/auth/check-nickname",
      "/auth/rejoin",
    ];
    const isAuthFree = authFreeUrls.some((url) => config.url.includes(url));

    if (token && !isAuthFree) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ 응답 인터셉터 (401 → 토큰 재발급 & 요청 재시도)
api.interceptors.response.use(
  (response) => response, // 정상 응답은 그대로
  async (error) => {
    const originalRequest = error.config;

    // 401 에러 && 재발급 시도가 아직 안 된 요청만 처리
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // 재시도 중임을 표시

      const newAccessToken = await reissueAccessToken();

      if (newAccessToken) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest); // 재요청
      }
    }

    return Promise.reject(error); // 다른 에러는 그대로
  }
);

export default api;
