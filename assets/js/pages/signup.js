const JOIN_API = "https://api.wenivops.co.kr/services/open-market/";

const DOMElementArray = {};

// 유효성 상태 관리 (버튼 활성화용)
let validationsMapping = {};
let sellerValidationsMapping = {};

// ========================================
// 1. DOM 요소 초기화
// ========================================
function loadJoinDOM() {
  // 폼
  DOMElementArray.joinForm = document.getElementById("joinform");
  DOMElementArray.userType = document.getElementById("usertype");
  
  // 탭 관련
  DOMElementArray.tabBuyer = document.getElementById("tab-buyer");
  DOMElementArray.tabSeller = document.getElementById("tab-seller");
  DOMElementArray.buyerPanel = document.getElementById("buyer-panel");
  DOMElementArray.sellerPanel = document.getElementById("seller-panel");

  // ID & PW
  DOMElementArray.userId = document.getElementById("user-id");
  DOMElementArray.userIdCheckBtn = document.querySelector(".btn-check");
  DOMElementArray.userIdMessage = document.getElementById("id-msg");
  
  DOMElementArray.password = document.getElementById("user-pw");
  DOMElementArray.passwordMessage = document.getElementById("pw-msg");
  DOMElementArray.passwordRow = DOMElementArray.password?.closest('.input-row');
  
  DOMElementArray.passwordConfirm = document.getElementById("user-pw-check");
  DOMElementArray.pwConfirmMessage = document.getElementById("pw-check-msg");
  DOMElementArray.passwordConfirmRow = DOMElementArray.passwordConfirm?.closest('.input-row');

  // 개인정보
  DOMElementArray.userName = document.getElementById("user-name");
  DOMElementArray.userNameMessage = document.getElementById("name-msg");
  
  DOMElementArray.phoneFirst = document.getElementById("phone-prefix");
  DOMElementArray.phoneMiddle = document.querySelector(".phone-mid");
  DOMElementArray.phoneLast = document.querySelector(".phone-last");
  DOMElementArray.phoneNumberMessage = document.getElementById("phone-msg");

  // 판매자 정보
  DOMElementArray.businessNumber = document.getElementById("business-num");
  DOMElementArray.businessNumberCheckBtn = document.querySelector(".btn-verify");
  DOMElementArray.businessNumberMessage = document.getElementById("business-msg");
  DOMElementArray.storeName = document.getElementById("store-name");
  DOMElementArray.storeNameMessage = document.getElementById("store-msg");

  // 기타
  DOMElementArray.privacyConsent = document.getElementById("terms-agree");
  DOMElementArray.joinBtn = document.querySelector(".btn-submit-join");

  // 유효성 체크 매핑
  validationsMapping = {
    userId: { 
      input: DOMElementArray.userId, 
      message: DOMElementArray.userIdMessage, 
      isCheck: false 
    },
    password: { 
      input: DOMElementArray.password, 
      message: DOMElementArray.passwordMessage, 
      isCheck: false 
    },
    passwordConfirm: { 
      input: DOMElementArray.passwordConfirm, 
      message: DOMElementArray.pwConfirmMessage, 
      isCheck: false 
    },
    userName: {
      input: DOMElementArray.userName,
      message: DOMElementArray.userNameMessage
    },
    phoneNumber: {
      input: [
        DOMElementArray.phoneFirst,
        DOMElementArray.phoneMiddle,
        DOMElementArray.phoneLast
      ],
      message: DOMElementArray.phoneNumberMessage
    }
  };

  sellerValidationsMapping = {
    businessNumber: { 
      input: DOMElementArray.businessNumber, 
      message: DOMElementArray.businessNumberMessage, 
      isCheck: false 
    },
    storeName: {
      input: DOMElementArray.storeName,
      message: DOMElementArray.storeNameMessage
    }
  };
}

// ========================================
// 2. 이벤트 리스너 설정
// ========================================
function eventSetting() {
  // 탭 변경
  DOMElementArray.tabBuyer.addEventListener("click", () => handleTabChange("buyer"));
  DOMElementArray.tabSeller.addEventListener("click", () => handleTabChange("seller"));

  // ID 중복 확인
  DOMElementArray.userIdCheckBtn.addEventListener("click", () => checkUserId());
  
  // ID 입력 시 초기화
  DOMElementArray.userId.addEventListener("input", () => {
    resetError(DOMElementArray.userId, DOMElementArray.userIdMessage);
    validationsMapping.userId.isCheck = false;
    handleInputCheck();
  });

  // 비밀번호 유효성 검사
  DOMElementArray.password.addEventListener("input", (e) => {
    // 비밀번호 확인란 초기화
    if (DOMElementArray.passwordConfirm.value) {
      DOMElementArray.passwordConfirm.value = "";
      resetError(DOMElementArray.passwordConfirm, DOMElementArray.pwConfirmMessage);
      if (DOMElementArray.passwordConfirmRow) {
        DOMElementArray.passwordConfirmRow.classList.remove("check-password");
      }
      validationsMapping.passwordConfirm.isCheck = false;
    }

    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;
    const isValid = regex.test(e.target.value);
    
    if (!isValid && e.target.value.length > 0) {
      showError(
        DOMElementArray.password, 
        DOMElementArray.passwordMessage, 
        "8자 이상, 영문 대 소문자, 숫자, 특수문자를 사용하세요."
      );
      if (DOMElementArray.passwordRow) {
        DOMElementArray.passwordRow.classList.remove("check-password");
      }
      validationsMapping.password.isCheck = false;
    } else if (isValid) {
      showSuccess(
        DOMElementArray.password, 
        DOMElementArray.passwordMessage, 
        "사용 가능한 비밀번호입니다."
      );
      if (DOMElementArray.passwordRow) {
        DOMElementArray.passwordRow.classList.add("check-password");
      }
      validationsMapping.password.isCheck = true;
    } else {
      resetError(DOMElementArray.password, DOMElementArray.passwordMessage);
      if (DOMElementArray.passwordRow) {
        DOMElementArray.passwordRow.classList.remove("check-password");
      }
      validationsMapping.password.isCheck = false;
    }
    
    handleInputCheck();
  });

  // 비밀번호 재확인
  DOMElementArray.passwordConfirm.addEventListener("input", (e) => {
    if (e.target.value === "") {
      resetError(DOMElementArray.passwordConfirm, DOMElementArray.pwConfirmMessage);
      if (DOMElementArray.passwordConfirmRow) {
        DOMElementArray.passwordConfirmRow.classList.remove("check-password");
      }
      validationsMapping.passwordConfirm.isCheck = false;
    } else if (e.target.value !== DOMElementArray.password.value) {
      showError(
        DOMElementArray.passwordConfirm, 
        DOMElementArray.pwConfirmMessage, 
        "비밀번호가 일치하지 않습니다."
      );
      if (DOMElementArray.passwordConfirmRow) {
        DOMElementArray.passwordConfirmRow.classList.remove("check-password");
      }
      validationsMapping.passwordConfirm.isCheck = false;
    } else {
      showSuccess(
        DOMElementArray.passwordConfirm, 
        DOMElementArray.pwConfirmMessage, 
        "비밀번호가 일치합니다."
      );
      if (DOMElementArray.passwordConfirmRow) {
        DOMElementArray.passwordConfirmRow.classList.add("check-password");
      }
      validationsMapping.passwordConfirm.isCheck = true;
    }
    handleInputCheck();
  });

  // 이름 입력
  DOMElementArray.userName.addEventListener("input", () => {
    resetError(DOMElementArray.userName, DOMElementArray.userNameMessage);
    handleInputCheck();
  });

  // 휴대폰번호 입력
  DOMElementArray.phoneMiddle.addEventListener("input", () => {
    handleInputCheck();
  });
  DOMElementArray.phoneLast.addEventListener("input", () => {
    handleInputCheck();
  });

  // 판매자 사업자번호 인증
  DOMElementArray.businessNumberCheckBtn.addEventListener("click", async () => {
    await checkBusinessNumber();
  });

  // 판매자 스토어 이름 입력
  DOMElementArray.storeName.addEventListener("input", () => {
    resetError(DOMElementArray.storeName, DOMElementArray.storeNameMessage);
    handleInputCheck();
  });

  // 약관 동의 체크
  DOMElementArray.privacyConsent.addEventListener("change", () => handleInputCheck());

  // 최종 제출
  DOMElementArray.joinForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    // 폼 유효성 검사
    if (!DOMElementArray.joinForm.checkValidity()) {
      DOMElementArray.joinForm.reportValidity();
      return;
    }

    // 추가 검증
    const validationResult = validateAllFields();
    if (!validationResult.isValid) {
      alert(validationResult.message);
      return;
    }

    const result = await join();
    
    if (result.user_type) {
      alert("회원가입이 완료되었습니다!");
      // 로그인 페이지로 이동 (경로는 프로젝트에 맞게 수정)
      // location.href = "/html/login/index.html"; 
    } else if (result.error) {
      alert(result.error);
    } else {
      alert("입력 정보를 다시 확인해주세요.");
    }
  });
}

// ========================================
// 3. 탭 변경 로직
// ========================================
function handleTabChange(type) {
  const isBuyer = type === "buyer";
  
  // 탭 버튼 스타일 변경
  DOMElementArray.tabBuyer.classList.toggle("on", isBuyer);
  DOMElementArray.tabSeller.classList.toggle("on", !isBuyer);
  
  // ARIA 속성 업데이트
  DOMElementArray.tabBuyer.ariaSelected = isBuyer;
  DOMElementArray.tabSeller.ariaSelected = !isBuyer;

  // 패널 표시/숨김
  DOMElementArray.buyerPanel.hidden = !isBuyer;
  DOMElementArray.sellerPanel.hidden = isBuyer;
  
  // 유저 타입 값 설정
  DOMElementArray.userType.value = type;
  
  // 버튼 활성화 상태 재확인
  handleInputCheck();
}

// ========================================
// 4. 아이디 중복 검사
// ========================================
async function checkUserId() {
  const username = DOMElementArray.userId.value.trim();
  
  if (!username) {
    showError(
      DOMElementArray.userId, 
      DOMElementArray.userIdMessage, 
      "아이디를 입력해주세요."
    );
    DOMElementArray.userId.focus();
    return;
  }

  // 형식 검사 (4-20자, 영문 소문자+숫자)
  const regex = /^[a-z0-9]{4,20}$/;
  if (!regex.test(username)) {
    showError(
      DOMElementArray.userId, 
      DOMElementArray.userIdMessage, 
      "20자 이내의 영문 소문자, 숫자만 사용 가능합니다."
    );
    validationsMapping.userId.isCheck = false;
    DOMElementArray.userId.focus();
    return;
  }

  const result = await postData("accounts/validate-username/", { username });
  
  if (result.error) {
    showError(
      DOMElementArray.userId, 
      DOMElementArray.userIdMessage, 
      result.error
    );
    validationsMapping.userId.isCheck = false;
    DOMElementArray.userId.focus();
  } else {
    showSuccess(
      DOMElementArray.userId, 
      DOMElementArray.userIdMessage, 
      "멋진 아이디네요 :)"
    );
    validationsMapping.userId.isCheck = true;
    DOMElementArray.password.focus();
  }
  
  handleInputCheck();
}

// ========================================
// 5. 사업자번호 인증
// ========================================
async function checkBusinessNumber() {
  const businessNumber = DOMElementArray.businessNumber.value.trim();
  
  if (!businessNumber) {
    showError(
      DOMElementArray.businessNumber, 
      DOMElementArray.businessNumberMessage, 
      "사업자 등록번호를 입력해주세요."
    );
    DOMElementArray.businessNumber.focus();
    return;
  }

  // 10자리 숫자 검사
  const regex = /^[0-9]{10}$/;
  if (!regex.test(businessNumber)) {
    showError(
      DOMElementArray.businessNumber, 
      DOMElementArray.businessNumberMessage, 
      "10자리 숫자로 입력해주세요."
    );
    sellerValidationsMapping.businessNumber.isCheck = false;
    DOMElementArray.businessNumber.focus();
    return;
  }

  const result = await postData("accounts/seller/validate-registration-number/", {
    company_registration_number: businessNumber
  });
  
  if (result.error) {
    showError(
      DOMElementArray.businessNumber, 
      DOMElementArray.businessNumberMessage, 
      result.error
    );
    sellerValidationsMapping.businessNumber.isCheck = false;
    DOMElementArray.businessNumber.focus();
  } else {
    showSuccess(
      DOMElementArray.businessNumber, 
      DOMElementArray.businessNumberMessage, 
      "인증되었습니다."
    );
    sellerValidationsMapping.businessNumber.isCheck = true;
  }
  
  handleInputCheck();
}

// ========================================
// 6. 모든 필드 검증
// ========================================
function validateAllFields() {
  const requiredText = "필수 정보입니다.";
  
  // ID 검증
  if (!validationsMapping.userId.isCheck) {
    return { isValid: false, message: "아이디 중복 확인을 해주세요." };
  }
  
  // 비밀번호 검증
  if (!validationsMapping.password.isCheck) {
    return { isValid: false, message: "비밀번호 형식을 확인해주세요." };
  }
  
  // 비밀번호 확인 검증
  if (!validationsMapping.passwordConfirm.isCheck) {
    return { isValid: false, message: "비밀번호가 일치하는지 확인해주세요." };
  }
  
  // 이름 검증
  if (!DOMElementArray.userName.value.trim()) {
    showError(DOMElementArray.userName, DOMElementArray.userNameMessage, requiredText);
    return { isValid: false, message: "이름을 입력해주세요." };
  }
  
  // 휴대폰번호 검증
  if (!DOMElementArray.phoneMiddle.value || !DOMElementArray.phoneLast.value) {
    showError(null, DOMElementArray.phoneNumberMessage, requiredText);
    return { isValid: false, message: "휴대폰번호를 입력해주세요." };
  }
  
  // 판매자인 경우 추가 검증
  if (DOMElementArray.userType.value === "seller") {
    if (!sellerValidationsMapping.businessNumber.isCheck) {
      return { isValid: false, message: "사업자번호 인증을 해주세요." };
    }
    
    if (!DOMElementArray.storeName.value.trim()) {
      showError(DOMElementArray.storeName, DOMElementArray.storeNameMessage, requiredText);
      return { isValid: false, message: "스토어 이름을 입력해주세요." };
    }
  }
  
  // 약관 동의 검증
  if (!DOMElementArray.privacyConsent.checked) {
    return { isValid: false, message: "약관에 동의해주세요." };
  }
  
  return { isValid: true };
}

// ========================================
// 7. UI 제어 함수
// ========================================
function showError(input, msgEl, text) {
  if (input) {
    input.classList.add("input-error");
  }
  
  if (msgEl) {
    msgEl.innerText = text;
    msgEl.classList.remove("ir");
    msgEl.classList.remove("msg-success");
    msgEl.classList.add("msg-error");
  }
}

function showSuccess(input, msgEl, text) {
  if (input) {
    input.classList.remove("input-error");
  }
  
  if (msgEl) {
    msgEl.innerText = text;
    msgEl.classList.remove("ir");
    msgEl.classList.remove("msg-error");
    msgEl.classList.add("msg-success");
  }
}

function resetError(input, msgEl) {
  if (input) {
    input.classList.remove("input-error");
  }
  
  if (msgEl) {
    msgEl.innerText = "";
    msgEl.classList.add("ir");
    msgEl.classList.remove("msg-error", "msg-success");
  }
}

// ========================================
// 8. 버튼 활성화 제어
// ========================================
function handleInputCheck() {
  let isInvalid = false;

  // 공통 필수 항목 체크
  const commonValid = 
    validationsMapping.userId.isCheck && 
    validationsMapping.password.isCheck && 
    validationsMapping.passwordConfirm.isCheck &&
    DOMElementArray.userName.value.trim() &&
    DOMElementArray.phoneMiddle.value &&
    DOMElementArray.phoneLast.value &&
    DOMElementArray.privacyConsent.checked;

  if (!commonValid) {
    isInvalid = true;
  }

  // 판매자인 경우 추가 항목 체크
  if (DOMElementArray.userType.value === "seller") {
    if (!sellerValidationsMapping.businessNumber.isCheck || 
        !DOMElementArray.storeName.value.trim()) {
      isInvalid = true;
    }
  }

  DOMElementArray.joinBtn.disabled = isInvalid;
}

// ========================================
// 9. 가입 API 호출
// ========================================
async function join() {
  const isSeller = DOMElementArray.userType.value === "seller";
  const url = isSeller ? "accounts/seller/signup/" : "accounts/buyer/signup/";
  
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

  return await postData(url, data);
}

// ========================================
// 10. API POST 공통 함수
// ========================================
async function postData(url = "", data = {}) {
  try {
    const res = await fetch(JOIN_API + url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    
    const result = await res.json();
    return result;
  } catch (e) {
    console.error("API 호출 실패:", e);
    return { error: "서버 연결에 실패했습니다." };
  }
}

// ========================================
// 11. 초기화
// ========================================
document.addEventListener("DOMContentLoaded", () => {
  loadJoinDOM();
  eventSetting();
  handleInputCheck(); // 초기 버튼 상태 설정
});
