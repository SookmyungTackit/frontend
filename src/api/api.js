import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

// axios 인스턴스 생성
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'ngrok-skip-browser-warning': 'any-value',
  },
});


// 토큰 재발급 함수
const reissueAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    const response = await axios.post(
      `${BASE_URL}/auth/reissue`,
      null,
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`
        }
      }
    );
    const { accessToken, refreshToken: newRefreshToken } = response.data;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", newRefreshToken);

    return accessToken;
  } catch (error) {
    const status = error.response?.status;
    const isAuthError = status === 401 || status === 403;
  
    if (isAuthError) {
      const refreshToken = localStorage.getItem("refreshToken");
  
      if (!refreshToken || refreshToken === "null") {
        window.location.href = "/login";
      } else {
        alert("세션이 만료되었거나 서버에 문제가 있습니다. 다시 로그인해주세요.");
      }
    }
  
    return null;
  }  
};

// 요청 인터셉터 (accessToken 자동 첨부)
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

// 응답 인터셉터 (401 → 토큰 재발급 & 요청 재시도)
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
        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);


export default api;
