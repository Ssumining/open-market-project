document.addEventListener('DOMContentLoaded', () => {
    const BASE_URL = 'https://api.wenivops.co.kr/services/open-market';
    const joinForm = document.getElementById('joinform');
    const userTypeInput = document.getElementById('usertype');
    const submitBtn = document.querySelector('.btn-submit-join');
    const termsCheck = document.getElementById('terms-agree');

    // 탭 관련 요소
    const tabBuyer = document.getElementById('tab-buyer');
    const tabSeller = document.getElementById('tab-seller');
    const buyerPanel = document.getElementById('buyer-panel');
    const sellerPanel = document.getElementById('seller-panel');

    // 입력 필드들
    const fields = {
        username: { input: document.getElementById('user-id'), msg: document.getElementById('id-msg'), valid: false, checkBtn: document.querySelector('.btn-check') },
        password: { input: document.getElementById('user-pw'), msg: document.getElementById('pw-msg'), icon: document.querySelector('#buyer-panel .icon-valid-check'), valid: false },
        passwordConfirm: { input: document.getElementById('user-pw-check'), msg: document.getElementById('pw-check-msg'), icon: document.querySelectorAll('.icon-valid-check')[1], valid: false },
        name: { input: document.getElementById('user-name'), msg: document.getElementById('name-msg'), valid: false },
        phoneMid: { input: document.querySelector('.phone-mid'), valid: false },
        phoneLast: { input: document.querySelector('.phone-last'), valid: false },
        businessNum: { input: document.getElementById('business-num'), msg: document.getElementById('business-msg'), valid: false, verifyBtn: document.querySelector('.btn-verify') },
        storeName: { input: document.getElementById('store-name'), msg: document.getElementById('store-msg'), valid: false }
    };

    // 1. 탭 전환 로직
    const switchTab = (type) => {
        userTypeInput.value = type;
        if (type === 'buyer') {
            tabBuyer.classList.add('on');
            tabSeller.classList.remove('on');
            sellerPanel.hidden = true;
            tabBuyer.setAttribute('aria-selected', 'true');
            tabSeller.setAttribute('aria-selected', 'false');
        } else {
            tabSeller.classList.add('on');
            tabBuyer.classList.remove('on');
            sellerPanel.hidden = false;
            tabSeller.setAttribute('aria-selected', 'true');
            tabBuyer.setAttribute('aria-selected', 'false');
        }
        checkFormValidity();
    };

    tabBuyer.addEventListener('click', () => switchTab('buyer'));
    tabSeller.addEventListener('click', () => switchTab('seller'));

    // 2. 메시지 표시 유틸리티
    const showMsg = (field, text, isSuccess = false) => {
        field.msg.textContent = text;
        field.msg.classList.remove('ir'); // 화면에 표시
        field.msg.style.color = isSuccess ? '#21BF48' : '#EB5757';
        field.input.style.borderColor = isSuccess ? '#21BF48' : '#EB5757';
    };

    // 3. 필수 입력 순서 검증 (상단이 비었는지 확인)
    const checkPreviousFields = (currentFieldKey) => {
        const keys = Object.keys(fields);
        const currentIndex = keys.indexOf(currentFieldKey);
        for (let i = 0; i < currentIndex; i++) {
            const prevField = fields[keys[i]];
            if (userTypeInput.value === 'buyer' && (keys[i] === 'businessNum' || keys[i] === 'storeName')) continue;
            if (!prevField.input.value.trim()) {
                showMsg(prevField, "필수 정보입니다.");
                return false;
            }
        }
        return true;
    };

    // 4. 아이디 중복 확인 API
    fields.username.checkBtn.addEventListener('click', async () => {
        const val = fields.username.input.value;
        const idRegex = /^[a-z0-9]{4,20}$/;

        if (!idRegex.test(val)) {
            showMsg(fields.username, "20자 이내의 영어 소문자, 대문자, 숫자만 사용 가능합니다.");
            fields.username.valid = false;
            return;
        }

        try {
            const res = await fetch(`${BASE_URL}/accounts/validate-username/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: val })
            });
            const data = await res.json();
            if (res.ok) {
                showMsg(fields.username, "멋진 아이디네요 :)", true);
                fields.username.valid = true;
            } else {
                showMsg(fields.username, data.error || "이미 사용 중인 아이디입니다.");
                fields.username.valid = false;
            }
        } catch (e) { console.error(e); }
        checkFormValidity();
    });

    // 5. 비밀번호 검증
    fields.password.input.addEventListener('input', () => {
        const val = fields.password.input.value;
        const pwRegex = /^(?=.*[a-z])(?=.*[0-9]).{8,}$/;
        
        if (pwRegex.test(val)) {
            fields.password.icon.style.filter = "invert(48%) sepia(87%) saturate(418%) hue-rotate(84deg) brightness(95%) contrast(88%)"; // 초록색 근사치
            fields.password.valid = true;
            fields.password.msg.classList.add('ir');
        } else {
            fields.password.icon.style.filter = "none";
            fields.password.valid = false;
        }
        checkFormValidity();
    });

    fields.passwordConfirm.input.addEventListener('input', () => {
        if (fields.password.input.value === fields.passwordConfirm.input.value && fields.passwordConfirm.input.value !== "") {
            fields.passwordConfirm.valid = true;
            fields.passwordConfirm.msg.classList.add('ir');
            fields.passwordConfirm.icon.style.filter = "invert(48%) sepia(87%) saturate(418%) hue-rotate(84deg) brightness(95%) contrast(88%)";
        } else {
            showMsg(fields.passwordConfirm, "비밀번호가 일치하지 않습니다.");
            fields.passwordConfirm.valid = false;
            fields.passwordConfirm.icon.style.filter = "none";
        }
        checkFormValidity();
    });

    // 6. 사업자 번호 인증 API (판매자 전용)
    fields.businessNum.verifyBtn?.addEventListener('click', async () => {
        const val = fields.businessNum.input.value;
        if (val.length !== 10) {
            showMsg(fields.businessNum, "사업자등록번호는 10자리 숫자여야 합니다.");
            return;
        }
        try {
            const res = await fetch(`${BASE_URL}/accounts/seller/validate-registration-number/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ company_registration_number: val })
            });
            const data = await res.json();
            if (res.ok) {
                showMsg(fields.businessNum, "사용 가능한 사업자등록번호입니다.", true);
                fields.businessNum.valid = true;
            } else {
                showMsg(fields.businessNum, data.error);
                fields.businessNum.valid = false;
            }
        } catch (e) { console.error(e); }
        checkFormValidity();
    });

    // 7. 폼 전체 유효성 검사 및 버튼 활성화
    const checkFormValidity = () => {
        const isBuyerValid = fields.username.valid && fields.password.valid && fields.passwordConfirm.valid && termsCheck.checked;
        const isSellerValid = isBuyerValid && fields.businessNum.valid && fields.storeName.input.value.trim() !== "";
        
        submitBtn.disabled = !(userTypeInput.value === 'buyer' ? isBuyerValid : isSellerValid);
    };

    [termsCheck, fields.name.input, fields.storeName.input].forEach(el => el.addEventListener('change', checkFormValidity));

    // 8. 최종 회원가입 제출
    joinForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const type = userTypeInput.value;
        const phone = `${document.getElementById('phone-prefix').value}${fields.phoneMid.input.value}${fields.phoneLast.input.value}`;
        
        const body = {
            username: fields.username.input.value,
            password: fields.password.input.value,
            name: fields.name.input.value,
            phone_number: phone
        };

        if (type === 'seller') {
            body.company_registration_number = fields.businessNum.input.value;
            body.store_name = fields.storeName.input.value;
        }

        try {
            const res = await fetch(`${BASE_URL}/accounts/${type}/signup/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            if (res.ok) {
                alert("회원가입이 완료되었습니다!");
                location.href = "/html/login/index.html"; // 로그인 페이지로 이동
            } else {
                const data = await res.json();
                alert(JSON.stringify(data));
            }
        } catch (e) { console.error(e); }
    });
});