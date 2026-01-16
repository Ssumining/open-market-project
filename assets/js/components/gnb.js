import { isAuthenticated, removeToken } from "../utils/storage.js";

const initGNB = () => {
    const cartBtn = document.querySelector('.cart-btn'); // 구매자용 장바구니 버튼
    const sellerBtn = document.querySelector('.seller-btn'); //판매자용 판매자 센터 버튼
    const loginBtn = document.getElementById('login-btn');
    const dropdownMenu = document.getElementById('mypage-dropdown');
    const userText = document.getElementById('user-status-login');
    const logoutBtn = document.getElementById('logout-btn');
    const mypageBtn = document.getElementById('mypage-btn');
    
    // storage.js의 함수를 사용하여 실제 로그인 상태 확인
    let isLoggedIn = isAuthenticated(); 
    let userType = localStorage.getItem('user_type');

    // 화면 UI 업데이트 함수
    const updateUI = () => {
        if (userText) {
            userText.textContent = isLoggedIn ? '마이페이지' : '로그인';
        }
        //로그인 상태 및 유저 타입에 따른 버튼 제어
        if (isLoggedIn) {
            if (userType === 'BUYER') {
                // 기존 CSS 레이아웃 유지
                if (cartBtn) cartBtn.style.display = 'flex'; 
                if (sellerBtn) sellerBtn.style.display = 'none';
            } else if (userType === 'SELLER') {
                if (cartBtn) cartBtn.style.display = 'none';
                if (sellerBtn) sellerBtn.style.display = 'flex'; 
            }
        } else {
            // 비로그인 시 기본값: 장바구니 버튼 노출
            if (cartBtn) cartBtn.style.display = 'flex'; 
            if (sellerBtn) sellerBtn.style.display = 'none';
            
            if (dropdownMenu) dropdownMenu.classList.remove('show');
            if (loginBtn) loginBtn.classList.remove('active');
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

    if (sellerBtn) {
        sellerBtn.addEventListener('click', () => {
            location.href = '/seller-center/index.html'; // 판매자 센터 경로
        });
    }

    // 로그인/마이페이지 버튼 및 드롭다운
    if (loginBtn && dropdownMenu) {
        loginBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!isLoggedIn) {
                // 실제 로그인은 login.html 페이지 내 로직에서 처리됨
                location.href = '/html/login/index.html';
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
                    // storage.js의 removeToken을 호출하여 모든 인증 정보 삭제
                    removeToken();
                    localStorage.removeItem('isLoggedIn'); // 기존 테스트 키값도 정리
                    localStorage.removeItem('user_type');
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