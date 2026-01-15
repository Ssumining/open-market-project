const initGNB = () => {
    const cartBtn = document.querySelector('.cart-btn');
    const loginBtn = document.getElementById('login-btn');
    const dropdownMenu = document.getElementById('mypage-dropdown');
    const userText = document.getElementById('user-status-login');
    const logoutBtn = document.getElementById('logout-btn');
    const mypageBtn = document.getElementById('mypage-btn');
    
    // localStorage에서 로그인 상태 가져오기
    let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'; 

    // 화면 UI 업데이트 함수
    const updateUI = () => {
        if (userText) {
            userText.textContent = isLoggedIn ? '마이페이지' : '로그인';
        }
        if (!isLoggedIn && dropdownMenu) {
            dropdownMenu.classList.remove('show');
            loginBtn.classList.remove('active');
        }
    };

    updateUI();

    // 장바구니 버튼 클릭 시
    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            if (!isLoggedIn) {
                if (typeof openModal === 'function') openModal(); 
            } else {
                location.href = '/cart/index.html';
            }
        });
    }

    // 로그인/마이페이지 버튼 및 드롭다운
    if (loginBtn && dropdownMenu) {
        loginBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!isLoggedIn) {
                // 이동하기 전에 상태를 true로 저장
                // 서버 들어오기 전 테스트로 변경할 수 있게 함
                localStorage.setItem('isLoggedIn', 'true');
                location.href = './login/index.html';
            } else {
                const isShowing = dropdownMenu.classList.toggle('show');
                loginBtn.classList.toggle('active', isShowing);
            }
        });

        dropdownMenu.addEventListener('click', (e) => e.stopPropagation());

        if (mypageBtn) {
            mypageBtn.addEventListener('click', () => {
                location.href = '/mypage/index.html'; 
            });
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                if (confirm("로그아웃 하시겠습니까?")) {
                    localStorage.setItem('isLoggedIn', 'false'); // 상태 저장
                    isLoggedIn = false;
                    updateUI();
                    location.reload(); // 초기화를 위해 새로고침
                }
            });
        }
    }

    // 바깥 영역 클릭 시 드롭다운 닫기
    window.addEventListener('click', () => {
        if (dropdownMenu && dropdownMenu.classList.contains('show')) {
            dropdownMenu.classList.remove('show');
            loginBtn.classList.remove('active');
        }
    });
};

document.addEventListener('DOMContentLoaded', initGNB);