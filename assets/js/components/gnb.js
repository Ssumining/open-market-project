const initGNB = () => {
    const cartBtn = document.querySelector('.cart-btn');
    const loginBtn = document.getElementById('login-btn');
    const dropdownMenu = document.getElementById('mypage-dropdown');
    const userText = document.getElementById('user-status-login');
    
    // const 대신 let으로 선언해야 나중에 값을 바꿀 수 있습니다.
    let isLoggedIn = true; 

    // 화면의 로그인/마이페이지 텍스트와 드롭다운 상태를 업데이트하는 함수
    const updateUI = () => {
        if (userText) {
            userText.textContent = isLoggedIn ? '마이페이지' : '로그인';
        }
        // 로그아웃 상태가 되면 열려있던 드롭다운을 닫습니다.
        if (!isLoggedIn && dropdownMenu) {
            dropdownMenu.classList.remove('show');
            loginBtn.classList.remove('active');
        }
    };

    // 초기 실행 시 UI 반영
    updateUI();

    // 장바구니 버튼
    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            if (!isLoggedIn) {
                openModal(); 
            } else {
                location.href = '/cart/index.html';
            }
        });
    }

    // 로그인 / 마이페이지 버튼 및 드롭다운 제어
    if (loginBtn && dropdownMenu) {
        loginBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!isLoggedIn) {
                // 경로 작성 후에도 경로 이동이 안됨
                location.href = './login/index.html';
            } else {
                const isShowing = dropdownMenu.classList.toggle('show');
                loginBtn.classList.toggle('active', isShowing);
            }
        });

        dropdownMenu.addEventListener('click', (e) => e.stopPropagation());

        const mypageBtn = document.getElementById('mypage-btn');
        const logoutBtn = document.getElementById('logout-btn');

        if (mypageBtn) {
            mypageBtn.addEventListener('click', () => {
                location.href = '/mypage/index.html'; 
            });
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                const isConfirm = confirm("로그아웃 하시겠습니까?");
                if (isConfirm) {
                    console.log("로그아웃 처리");
                    
                    // 1. 변수 상태를 변경합니다.
                    isLoggedIn = false; 
                    // 2. 변경된 상태를 화면에 즉시 반영합니다.
                    updateUI(); 
                    
                    // 실제로는 여기서 localStorage.removeItem('token') 등을 실행합니다.
                }
            });
        }
    }

    window.addEventListener('click', () => {
        if (dropdownMenu && dropdownMenu.classList.contains('show')) {
            dropdownMenu.classList.remove('show');
            loginBtn.classList.remove('active');
        }
    });
};

document.addEventListener('DOMContentLoaded', initGNB);