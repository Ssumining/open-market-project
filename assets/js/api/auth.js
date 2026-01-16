// assets/js/api/auth.js
const BASE_URL = "https://api.wenivops.co.kr/services/open-market";

export const loginAPI = async (username, password) => {
    const response = await fetch(`${BASE_URL}/accounts/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (!response.ok) {
        // 아이디/비번 불일치 시 서버 에러 메시지 혹은 커스텀 메시지 던지기
        throw new Error(data.error || "아이디 또는 비밀번호가 일치하지 않습니다.");
    }
    
    return data; 
};