import { loginAPI } from "../api/auth.js";
import { setToken } from "../utils/storage.js";

const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const errorLabel = document.getElementById("errorMessage");

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // 중요: 405 에러 방지의 핵심
    
    resetUI();

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    // 아이디가 공란이거나 비밀번호만 입력했을 경우
    if (!username) {
        displayError("아이디를 입력해 주세요.", usernameInput);
        return;
    }
    
    // 아이디만 입력했을 경우
    if (!password) {
        displayError("비밀번호를 입력해 주세요.", passwordInput);
        return;
    }

    try {
        const result = await loginAPI(username, password);
        
        // 성공 시 데이터 저장 (storage.js의 setToken 사용)
        setToken(result.access, result.refresh);
        // 유저 타입 저장 (GNB에서 BUYER/SELLER 구분용)
        localStorage.setItem("user_type", result.user.user_type);
        localStorage.setItem("isLoggedIn", "true"); // GNB 호환용

        // 성공 시 이전 페이지로 이동
        const prevPage = document.referrer;
        if (prevPage && !prevPage.includes("login")) {
            location.href = prevPage;
        } else {
            location.href = "../../index.html";
        }

    } catch (error) {
        // 정보 불일치 시 메시지 노출 및 비밀번호창 초기화/포커스
        displayError("아이디 또는 비밀번호가 일치하지 않습니다.", passwordInput);
        passwordInput.value = ""; 
        passwordInput.focus();
    }
});

function displayError(message, targetElement) {
    errorLabel.textContent = message;
    errorLabel.style.display = "block";
    targetElement.focus(); // 미입력 또는 에러 발생 시 focus 이벤트 작동
}

function resetUI() {
    errorLabel.style.display = "none";
}