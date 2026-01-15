/**
 * 토큰 및 사용자 정보를 로컬 스토리지에 관리하는 유틸리티
 */

// 토큰 저장 (로그인 시 사용)
export const setToken = (access, refresh) => {
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
};

// Access Token 가져오기 (API 헤더에 넣을 때 사용)
export const getAccessToken = () => {
    return localStorage.getItem("accessToken");
};

// Refresh Token 가져오기 (토큰 갱신 시 사용)
export const getRefreshToken = () => {
    return localStorage.getItem("refreshToken");
};

// 토큰 및 모든 인증 정보 삭제 (로그아웃 시 사용)
export const removeToken = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user_type"); // 로그인 시 저장했던 유저 타입도 함께 삭제
};

// 현재 로그인 상태인지 확인 (토큰 존재 여부)
export const isAuthenticated = () => {
    return !!localStorage.getItem("accessToken");
};