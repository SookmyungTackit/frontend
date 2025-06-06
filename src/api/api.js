import axios from "axios";

// ✅ axios 인스턴스 생성
const api = axios.create({
  baseURL: "http://54.180.118.228:8080/",
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
      'http://54.180.118.228:8080/auth/reissue',
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
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const newAccessToken = await reissueAccessToken();

      if (newAccessToken) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        // ✅ 이 한 줄 추가! 새 토큰을 인스턴스에 반영
        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);


export default api;
