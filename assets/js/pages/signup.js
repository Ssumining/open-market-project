import { signupAPI, validateUsernameAPI, validateBusinessNumAPI } from "../api/auth.js";
import { getAbsolutePath } from "../utils/path.js";

const DOMElementArray = {};

const ERROR_MSG = {
    REQUIRED: "필수 정보입니다.",
    ID_FORMAT: "20자 이내의 영문 소문자, 숫자만 사용 가능합니다.",
    ID_SUCCESS: "멋진 아이디네요 :)",
    PW_FORMAT: "8자 이상, 영문 대 소문자, 숫자, 특수문자를 사용하세요.",
    PW_SUCCESS: "사용 가능한 비밀번호입니다.",
    PW_MISMATCH: "비밀번호가 일치하지 않습니다.",
    PW_MATCH: "비밀번호가 일치합니다.",
    BUSINESS_NUM_FORMAT: "10자리 숫자로 입력해주세요.",
    BUSINESS_NUM_SUCCESS: "인증되었습니다.",
};

let validationsMapping = {};
let sellerValidationsMapping = {};

// ========================================
// DOM 요소 초기화
// ========================================
function loadJoinDOM() {
    DOMElementArray.joinForm = document.getElementById("joinform");
    DOMElementArray.userType = document.getElementById("usertype");
    
    DOMElementArray.tabBuyer = document.getElementById("tab-buyer");
    DOMElementArray.tabSeller = document.getElementById("tab-seller");
    DOMElementArray.buyerPanel = document.getElementById("buyer-panel");
    DOMElementArray.sellerPanel = document.getElementById("seller-panel");

    DOMElementArray.userId = document.getElementById("user-id");
    DOMElementArray.userIdCheckBtn = document.querySelector(".btn-check");
    DOMElementArray.userIdMessage = document.getElementById("id-msg");
    
    DOMElementArray.password = document.getElementById("user-pw");
    DOMElementArray.passwordMessage = document.getElementById("pw-msg");
    DOMElementArray.passwordRow = DOMElementArray.password?.closest('.input-row');
    DOMElementArray.passwordIcon = document.getElementById("pw-check-icon") 
        || DOMElementArray.passwordRow?.querySelector('.icon-valid-check');
    
    DOMElementArray.passwordConfirm = document.getElementById("user-pw-check");
    DOMElementArray.pwConfirmMessage = document.getElementById("pw-check-msg");
    DOMElementArray.passwordConfirmRow = DOMElementArray.passwordConfirm?.closest('.input-row');
    DOMElementArray.passwordConfirmIcon = document.getElementById("pw-confirm-check-icon") 
        || DOMElementArray.passwordConfirmRow?.querySelector('.icon-valid-check');

    DOMElementArray.userName = document.getElementById("user-name");
    DOMElementArray.userNameMessage = document.getElementById("name-msg");
    
    DOMElementArray.phoneFirst = document.getElementById("phone-prefix");
    DOMElementArray.phoneMiddle = document.querySelector(".phone-mid");
    DOMElementArray.phoneLast = document.querySelector(".phone-last");
    DOMElementArray.phoneNumberMessage = document.getElementById("phone-msg");

    DOMElementArray.businessNumber = document.getElementById("business-num");
    DOMElementArray.businessNumberCheckBtn = document.querySelector(".btn-verify");
    DOMElementArray.businessNumberMessage = document.getElementById("business-msg");
    DOMElementArray.storeName = document.getElementById("store-name");
    DOMElementArray.storeNameMessage = document.getElementById("store-msg");

    DOMElementArray.privacyConsent = document.getElementById("terms-agree");
    DOMElementArray.joinBtn = document.querySelector(".btn-submit-join");

    validationsMapping = {
        userId: { input: DOMElementArray.userId, message: DOMElementArray.userIdMessage, isCheck: false },
        password: { input: DOMElementArray.password, message: DOMElementArray.passwordMessage, isCheck: false },
        passwordConfirm: { input: DOMElementArray.passwordConfirm, message: DOMElementArray.pwConfirmMessage, isCheck: false }
    };

    sellerValidationsMapping = {
        businessNumber: { input: DOMElementArray.businessNumber, message: DOMElementArray.businessNumberMessage, isCheck: false }
    };
}

// ========================================
// 순차적 입력 검증 유틸리티
// ========================================
function checkPreviousFields(currentField) {
    const fields = [
        { el: DOMElementArray.userId, msg: DOMElementArray.userIdMessage },
        { el: DOMElementArray.password, msg: DOMElementArray.passwordMessage },
        { el: DOMElementArray.passwordConfirm, msg: DOMElementArray.pwConfirmMessage },
        { el: DOMElementArray.userName, msg: DOMElementArray.userNameMessage }
    ];

    for (let field of fields) {
        if (field.el === currentField) break; 
        if (!field.el.value.trim()) {
            showError(field.el, field.msg, ERROR_MSG.REQUIRED);
        }
    }
}

// ========================================
// 이벤트 리스너 설정
// ========================================
function eventSetting() {
    // 탭 변경
    DOMElementArray.tabBuyer.addEventListener("click", () => handleTabChange("buyer"));
    DOMElementArray.tabSeller.addEventListener("click", () => handleTabChange("seller"));

    // [아이디] 포커스 아웃 시 검사
    DOMElementArray.userId.addEventListener("blur", () => {
        if (!DOMElementArray.userId.value.trim()) {
            showError(DOMElementArray.userId, DOMElementArray.userIdMessage, ERROR_MSG.REQUIRED);
        }
    });
    DOMElementArray.userIdCheckBtn.addEventListener("click", () => checkUserId());
    DOMElementArray.userId.addEventListener("input", () => {
        resetError(DOMElementArray.userId, DOMElementArray.userIdMessage);
        validationsMapping.userId.isCheck = false;
        handleInputCheck();
    });

    // [비밀번호] 포커스 아웃 시 검사
    DOMElementArray.password.addEventListener("focus", () => checkPreviousFields(DOMElementArray.password));
    DOMElementArray.password.addEventListener("blur", () => {
        if (!DOMElementArray.password.value) {
            showError(DOMElementArray.password, DOMElementArray.passwordMessage, ERROR_MSG.REQUIRED);
        }
    });
    DOMElementArray.password.addEventListener("input", (e) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;
        const isValid = regex.test(e.target.value);
        if (isValid) {
            setCheckIcon(DOMElementArray.passwordIcon, true);
            showSuccess(DOMElementArray.password, DOMElementArray.passwordMessage, ERROR_MSG.PW_SUCCESS);
            validationsMapping.password.isCheck = true;
        } else {
            showError(DOMElementArray.password, DOMElementArray.passwordMessage, ERROR_MSG.PW_FORMAT);
            setCheckIcon(DOMElementArray.passwordIcon, false);
            validationsMapping.password.isCheck = false;
        }
        updatePasswordConfirm();
        handleInputCheck();
    });

    // [비밀번호 재확인] 포커스 아웃 시 검사
    DOMElementArray.passwordConfirm.addEventListener("focus", () => checkPreviousFields(DOMElementArray.passwordConfirm));
    DOMElementArray.passwordConfirm.addEventListener("blur", () => {
        if (!DOMElementArray.passwordConfirm.value) {
            showError(DOMElementArray.passwordConfirm, DOMElementArray.pwConfirmMessage, ERROR_MSG.REQUIRED);
        }
    });
    DOMElementArray.passwordConfirm.addEventListener("input", () => {
        updatePasswordConfirm();
        handleInputCheck();
    });

    // [이름] 포커스 아웃 시 검사
    DOMElementArray.userName.addEventListener("focus", () => checkPreviousFields(DOMElementArray.userName));
    DOMElementArray.userName.addEventListener("blur", () => {
        if (!DOMElementArray.userName.value.trim()) {
            showError(DOMElementArray.userName, DOMElementArray.userNameMessage, ERROR_MSG.REQUIRED);
        }
    });
    DOMElementArray.userName.addEventListener("input", () => {
        if (DOMElementArray.userName.value.trim()) resetError(DOMElementArray.userName, DOMElementArray.userNameMessage);
        handleInputCheck();
    });

    // 클릭 시 상단 모든 미입력 필드 에러 출력
    const phoneInputHandler = () => {
        const previousFields = [
            { el: DOMElementArray.userId, msg: DOMElementArray.userIdMessage },
            { el: DOMElementArray.password, msg: DOMElementArray.passwordMessage },
            { el: DOMElementArray.passwordConfirm, msg: DOMElementArray.pwConfirmMessage },
            { el: DOMElementArray.userName, msg: DOMElementArray.userNameMessage }
        ];

        previousFields.forEach(field => {
            if (!field.el.value.trim()) {
                showError(field.el, field.msg, ERROR_MSG.REQUIRED);
            }
        });
    };

    DOMElementArray.phoneMiddle.addEventListener("focus", phoneInputHandler);
    DOMElementArray.phoneLast.addEventListener("focus", phoneInputHandler);
    
    // 입력 시 에러 메시지 초기화
    DOMElementArray.phoneMiddle.addEventListener("input", () => {
        if (DOMElementArray.phoneMiddle.value && DOMElementArray.phoneLast.value) {
            resetError(null, DOMElementArray.phoneNumberMessage);
        }
        handleInputCheck();
    });
    DOMElementArray.phoneLast.addEventListener("input", () => {
        if (DOMElementArray.phoneMiddle.value && DOMElementArray.phoneLast.value) {
            resetError(null, DOMElementArray.phoneNumberMessage);
        }
        handleInputCheck();
    });

    // [기타 이벤트]
    DOMElementArray.businessNumberCheckBtn.addEventListener("click", () => checkBusinessNumber());
    DOMElementArray.privacyConsent.addEventListener("change", () => handleInputCheck());
    DOMElementArray.joinForm.addEventListener("submit", handleFormSubmit);
}

// 탭 변경 로직 수정
function handleTabChange(type) {
    const isBuyer = type === "buyer";
    
    // 탭 버튼 상태 변경
    DOMElementArray.tabBuyer.classList.toggle("on", isBuyer);
    DOMElementArray.tabSeller.classList.toggle("on", !isBuyer);
    DOMElementArray.tabBuyer.setAttribute("aria-selected", isBuyer);
    DOMElementArray.tabSeller.setAttribute("aria-selected", !isBuyer);
    
    // 폼 클래스 변경 (판매자 모드일 때 디자인 조절용)
    DOMElementArray.joinForm.classList.toggle("seller-mode", !isBuyer);

    // 판매자 전용 패널만 토글
    if (DOMElementArray.sellerPanel) {
        DOMElementArray.sellerPanel.hidden = isBuyer;
        DOMElementArray.sellerPanel.style.display = isBuyer ? "none" : "block";
    }

    if (DOMElementArray.buyerPanel) {
        DOMElementArray.buyerPanel.hidden = false; 
    }
    
    DOMElementArray.userType.value = type;
    handleInputCheck();
}

// 비밀번호 일치 확인
function updatePasswordConfirm() {
    const pw = DOMElementArray.password.value;
    const pwConfirm = DOMElementArray.passwordConfirm.value;

    if (pwConfirm && pw === pwConfirm) {
        setCheckIcon(DOMElementArray.passwordConfirmIcon, true);
        showSuccess(DOMElementArray.passwordConfirm, DOMElementArray.pwConfirmMessage, ERROR_MSG.PW_MATCH);
        validationsMapping.passwordConfirm.isCheck = true;
    } else if (pwConfirm) {
        showError(DOMElementArray.passwordConfirm, DOMElementArray.pwConfirmMessage, ERROR_MSG.PW_MISMATCH);
        setCheckIcon(DOMElementArray.passwordConfirmIcon, false);
        validationsMapping.passwordConfirm.isCheck = false;
    }
}

// 아이디 중복 확인
async function checkUserId() {
    const username = DOMElementArray.userId.value.trim();
    if (!username) return showError(DOMElementArray.userId, DOMElementArray.userIdMessage, ERROR_MSG.REQUIRED);
    if (!/^[a-z0-9]{4,20}$/.test(username)) return showError(DOMElementArray.userId, DOMElementArray.userIdMessage, ERROR_MSG.ID_FORMAT);

    try {
        await validateUsernameAPI(username);
        showSuccess(DOMElementArray.userId, DOMElementArray.userIdMessage, ERROR_MSG.ID_SUCCESS);
        validationsMapping.userId.isCheck = true;
    } catch (error) {
        showError(DOMElementArray.userId, DOMElementArray.userIdMessage, error.message);
        validationsMapping.userId.isCheck = false;
    }
    handleInputCheck();
}

// 사업자 번호 확인
async function checkBusinessNumber() {
    const num = DOMElementArray.businessNumber.value.trim();
    if (!/^[0-9]{10}$/.test(num)) return showError(DOMElementArray.businessNumber, DOMElementArray.businessNumberMessage, ERROR_MSG.BUSINESS_NUM_FORMAT);
    try {
        await validateBusinessNumAPI(num);
        showSuccess(DOMElementArray.businessNumber, DOMElementArray.businessNumberMessage, ERROR_MSG.BUSINESS_NUM_SUCCESS);
        sellerValidationsMapping.businessNumber.isCheck = true;
    } catch (error) {
        showError(DOMElementArray.businessNumber, DOMElementArray.businessNumberMessage, error.message);
        sellerValidationsMapping.businessNumber.isCheck = false;
    }
    handleInputCheck();
}

// ========================================
// UI 및 상태 제어 유틸리티
// ========================================
function setCheckIcon(iconEl, isValid) {
    if (!iconEl) return;
    const currentSrc = iconEl.src;
    if (isValid) {
        iconEl.src = currentSrc.replace('icon-check-off.svg', 'icon-check-on.svg');
        iconEl.style.filter = "none";
    } else {
        iconEl.src = currentSrc.replace('icon-check-on.svg', 'icon-check-off.svg');
        iconEl.style.filter = "grayscale(1)";
    }
}

function showError(input, msgEl, text) {
    if (input) { input.classList.add("input-error"); input.classList.remove("input-success"); }
    if (msgEl) { msgEl.innerText = text; msgEl.classList.remove("ir", "msg-success"); msgEl.classList.add("msg-error"); }
}

function showSuccess(input, msgEl, text) {
    if (input) { input.classList.add("input-success"); input.classList.remove("input-error"); }
    if (msgEl && text) {
        msgEl.innerText = text;
        msgEl.classList.remove("ir", "msg-error");
        msgEl.classList.add("msg-success");
        setTimeout(() => {
            msgEl.innerText = "";
            msgEl.classList.add("ir");
            if (input) input.classList.remove("input-success");
        }, 1000); 
    }
}

function resetError(input, msgEl) {
    if (input) input.classList.remove("input-error", "input-success");
    if (msgEl) { msgEl.innerText = ""; msgEl.classList.add("ir"); msgEl.classList.remove("msg-error", "msg-success"); }
}

function handleInputCheck() {
    const isSeller = DOMElementArray.userType.value === "seller";
    const commonValid = validationsMapping.userId.isCheck && validationsMapping.password.isCheck && 
                        validationsMapping.passwordConfirm.isCheck && DOMElementArray.userName.value.trim() &&
                        DOMElementArray.phoneMiddle.value && DOMElementArray.phoneLast.value && DOMElementArray.privacyConsent.checked;
    const sellerValid = !isSeller || (sellerValidationsMapping.businessNumber.isCheck && DOMElementArray.storeName.value.trim());
    DOMElementArray.joinBtn.disabled = !(commonValid && sellerValid);
}

async function handleFormSubmit(e) {
    e.preventDefault();
    try {
        const isSeller = DOMElementArray.userType.value === "seller";
        const data = {
            username: DOMElementArray.userId.value.trim(),
            password: DOMElementArray.password.value,
            name: DOMElementArray.userName.value.trim(),
            phone_number: `${DOMElementArray.phoneFirst.value}${DOMElementArray.phoneMiddle.value}${DOMElementArray.phoneLast.value}`,
        };
        if (isSeller) {
            data.company_registration_number = DOMElementArray.businessNumber.value.trim();
            data.store_name = DOMElementArray.storeName.value.trim();
        }
        await signupAPI(isSeller, data);
        alert("회원가입이 완료되었습니다!");
        location.href = getAbsolutePath("html/login/index.html");
    } catch (error) {
        alert(error.message);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadJoinDOM();
    eventSetting();
    handleInputCheck();
});