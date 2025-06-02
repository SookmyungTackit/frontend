import axios from "axios";

// ✅ axios 인스턴스 생성
const api = axios.create({
  baseURL: "https://56cc-1-209-144-251.ngrok-free.app",
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
    const status = error.response?.status;
    const isAuthError = status === 401 || status === 403;
  
    if (isAuthError) {
      const refreshToken = localStorage.getItem("refreshToken");
  
      if (!refreshToken || refreshToken === "null") {
        // 리프레시 토큰 자체가 없을 때만 로그아웃
        window.location.href = "/login";
      } else {
        // 토큰은 있는데 서버 문제일 수 있음 → 알림만 표시
        console.error("⚠️ 토큰 있음에도 재발급 실패. 서버 문제일 수 있음.");
        alert("세션이 만료되었거나 서버에 문제가 있습니다. 다시 로그인해주세요.");
        // window.location.href = "/login";  ← 주석 처리 가능
      }
    }
  
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
