import { getRootPrefix } from "../utils/path.js";
import { isAuthenticated, removeToken } from "../utils/storage.js";

const initGNB = () => {
    const header = document.querySelector('header');
    if (!header) return;

    // 현재 페이지가 html 폴더 안에 있는지 체크 (하위 폴더 깊이 확인)
    const rootPrefix = getRootPrefix();

    // 1. 헤더 HTML 구조 동적 생성 (기존 HTML 복사)
    header.innerHTML = `
        <div class="container"> 
            <div class="logo-search-group">
                <h1 class="logo">
                    <a href="${rootPrefix}index.html">
                        <img src="${rootPrefix}assets/images/Logo-hodu.svg">
                    </a>
                </h1>
                <div class="search-form">
                    <input type="text" class="search-input" placeholder="상품을 검색해보세요!">
                    <button class="btn-search"><img src="${rootPrefix}assets/images/icon-search.svg"></button>
                </div>
            </div>
            <div class="user-menu">
                <button class="seller-btn" id="seller-btn">
                    <img src="${rootPrefix}assets/images/icon-shopping-bag.svg">
                    <p class="seller-txt">판매자 센터</p>
                </button>
                <button class="cart-btn">장바구니</button> 
                <div class="dropdown-container">
                    <button class="login-btn" id="login-btn">
                        <span id="user-status-login">로그인</span>
                    </button>
                    <div id="mypage-dropdown" class="dropdown-menu">
                        <button type="button" id="mypage-btn" class="menu-item">마이페이지</button>
                        <button type="button" id="logout-btn" class="menu-item">로그아웃</button>
                    </div>
                </div>
            </div>
        </div>
        <div id="login-modal" class="modal-overlay" style="display: none;">
            <article class="modal-content">
                <button type="button" id="btn-modal-close" class="btn-close-x">
                    <img src="${rootPrefix}assets/images/icon-delete.svg" class="btn-close-x-icon" alt="닫기">
                </button>
                <p class="modal-text">
                    로그인이 필요한 서비스입니다.<br>
                    로그인 하시겠습니까?
                </p>
                <div class="modal-btns">
                    <button type="button" id="btn-modal-cancel" class="btn-no">아니오</button>
                    <button type="button" id="btn-modal-login" class="btn-yes">예</button>
                </div>
            </article>
        </div>
    `;
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
                location.href = `${rootPrefix}cart/index.html`;
            }
        });
    }

    if (sellerBtn) {
        sellerBtn.addEventListener('click', () => {
            location.href = `${rootPrefix}seller-center/index.html`; // 판매자 센터 경로
        });
    }

    // 로그인/마이페이지 버튼 및 드롭다운
    if (loginBtn && dropdownMenu) {
        loginBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!isLoggedIn) {
                // 실제 로그인은 login.html 페이지 내 로직에서 처리됨
                location.href = `${rootPrefix}html/login/index.html`;
            } else {
                const isShowing = dropdownMenu.classList.toggle('show');
                loginBtn.classList.toggle('active', isShowing);
            }
        });

        dropdownMenu.addEventListener('click', (e) => e.stopPropagation());

        if (mypageBtn) {
            mypageBtn.addEventListener('click', () => {
                location.href = `${rootPrefix}mypage/index.html`; 
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