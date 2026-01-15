// 모달 열기/닫기 함수 (전역에서 사용할 수 있도록 설정)
const openModal = () => {
    const modal = document.getElementById('login-modal');
    if (modal) modal.style.display = 'flex';
};

const closeModal = () => {
    const modal = document.getElementById('login-modal');
    if (modal) modal.style.display = 'none';
};

document.addEventListener('DOMContentLoaded', () => {
    const cancelBtn = document.getElementById('btn-modal-cancel');
    const loginConfirmBtn = document.getElementById('btn-modal-login');
    const closeXBtn = document.getElementById('btn-modal-close');
    const modalOverlay = document.getElementById('login-modal');

    // 닫기 이벤트들
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    if (closeXBtn) closeXBtn.addEventListener('click', closeModal);
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }

    // "예" 버튼 클릭 시: 로그인 상태를 true로 만들고 이동
    if (loginConfirmBtn) {
        loginConfirmBtn.addEventListener('click', () => {
            // 테스트를 위해 이동 전 상태를 true로 저장
            // 실제 로그인 페이지의 성공 로직에 넣는 것이 더 정확
            localStorage.setItem('isLoggedIn', 'true');
            location.href = './login/index.html';
        });
    }
});