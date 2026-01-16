// 스토리지 키 정의 (상수화)
const STORAGE_KEYS = {
    ACCESS_TOKEN: 'accessToken',
    USER_TYPE: 'user_type',
};

// 토큰 관련 유틸리티
export const getAccessToken = () => {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
};

export const setToken = (token) => {
    if (!token) return;
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
};

export const removeToken = () => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_TYPE);
};

// 사용자 정보 및 상태 유틸리티
export const setUserType = (type) => {
    if (!type) return;
    localStorage.setItem(STORAGE_KEYS.USER_TYPE, type);
};

export const getUserType = () => {
    return localStorage.getItem(STORAGE_KEYS.USER_TYPE);
};

export const isAuthenticated = () => {
    return !!getAccessToken(); // 토큰 존재 여부를 불리언 값으로 반환
};