const BASE_URL = "https://api.wenivops.co.kr/services/open-market";

const request = async (url, method = "GET", body = null) => {
    const options = {
        method,
        headers: { "Content-Type": "application/json" },
    };
    if (body) options.body = JSON.stringify(body);

    const response = await fetch(`${BASE_URL}/${url}`, options);
    const data = await response.json();

    if (!response.ok) {
        // 서버에서 오는 객체형 에러 처리
        const errorMsg = data.error || 
                        (typeof data === 'object' ? Object.values(data).flat().join(", ") : null) || 
                        "오류가 발생했습니다.";
        throw new Error(errorMsg);
    }
    return data;
};

export const signupAPI = (isSeller, payload) => {
    const url = isSeller ? "accounts/seller/signup/" : "accounts/buyer/signup/";
    return request(url, "POST", payload);
};

export const validateUsernameAPI = (username) => 
    request("accounts/validate-username/", "POST", { username });

export const validateBusinessNumAPI = (number) => 
    request("accounts/seller/validate-registration-number/", "POST", { company_registration_number: number });