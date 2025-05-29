import axios from "axios";

// ✅ axios 인스턴스 생성( 끝에 / 하나 떼기 )
const api = axios.create({
  baseURL: "https://097f-61-40-226-235.ngrok-free.app", // 백엔드 서버 주소
});

// ✅ 토큰 재발급 함수
const reissueAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    // accessToken 토큰 재발급 Api (url : /auth/reissue , post)
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

// ✅ 응답 인터셉터 (401 에러 발생 시 토큰 재발급 & 요청 재시도)
// ✅ 요청 인터셉터 (API 호출 시 자동으로 accessToken 붙이기)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    // ✅ 인증이 필요 없는 경로 목록
    const authFreeUrls = [
      "/auth/sign-in",
      "/auth/sign-up",
      "/auth/check-email-auth",
      "/auth/check-nickname",
      "/auth/rejoin",
    ];

    // ✅ 현재 요청이 예외 경로에 포함되어 있는지 확인
    const isAuthFree = authFreeUrls.some((url) => config.url.includes(url));

    // ✅ 예외가 아닌 경우에만 Authorization 헤더 추가
    if (token && !isAuthFree) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


export default api;
