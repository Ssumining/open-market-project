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
            location.href = './html/login/index.html';
        });
    }
});