import { getRootPrefix } from "../utils/path.js";

window.openModal = () => {
    const modal = document.getElementById('login-modal');
    if (modal) modal.style.display = 'flex';
};

window.closeModal = () => {
    const modal = document.getElementById('login-modal');
    if (modal) modal.style.display = 'none';
};

document.addEventListener('DOMContentLoaded', () => {
    const cancelBtn = document.getElementById('btn-modal-cancel');
    const loginConfirmBtn = document.getElementById('btn-modal-login');
    const closeXBtn = document.getElementById('btn-modal-close');
    const modalOverlay = document.getElementById('login-modal');

    const rootPrefix = getRootPrefix();

    // closeModal -> window.closeModal 호출 (통일성)
    if (cancelBtn) cancelBtn.addEventListener('click', window.closeModal);
    if (closeXBtn) closeXBtn.addEventListener('click', window.closeModal);
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) window.closeModal();
        });
    }

    if (loginConfirmBtn) {
        loginConfirmBtn.addEventListener('click', () => {
            // 이동 전 모달 닫음
            window.closeModal();
            // 페이지 이동 실행
            location.href = `${rootPrefix}html/login/index.html`;
        });
    }

    window.addEventListener('pageshow', (event) => {
        // 뒤로가기로 왔을 경우 (persisted가 true일 때) 모달을 닫음
        if (event.persisted) {
            window.closeModal();
        }
    });
});