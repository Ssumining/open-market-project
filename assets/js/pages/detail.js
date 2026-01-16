import productAPI from '../api/product.js';
import { getAccessToken, isAuthenticated } from '../utils/storage.js';

// 설정값 및 상태 관리
const MIN_QTY = 1;
let currentProduct = null; 
let amount = MIN_QTY;

// DOM 요소 선택
const plusBtn = document.querySelector('.plus');
const minusBtn = document.querySelector('.minus');
const amountDisplay = document.querySelector('.current-amount');
const quantityDisplay = document.querySelector('.quantity');
const totalPriceDisplay = document.querySelector('.totalPrice');
const buyBtn = document.querySelector('.M-button');
const cartBtn = document.querySelector('.M-dark-button');

// UI 업데이트 함수
function updateUI() {
    if (!currentProduct) return;

    amountDisplay.innerText = amount;
    quantityDisplay.innerText = amount;
    
    // 총 금액 계산: (가격 * 수량) + 배송비 [cite: 374, 375]
    const total = (currentProduct.price * amount) + currentProduct.shipping_fee;
    totalPriceDisplay.textContent = total.toLocaleString();

    // 재고 기반 버튼 활성화 제어 [cite: 234]
    plusBtn.disabled = amount >= currentProduct.stock;
    minusBtn.disabled = amount <= MIN_QTY;
}

// 데이터 바인딩
function bindProductDetail(data) {
    currentProduct = data;

    document.querySelector('.seller').textContent = data.seller.store_name;
    document.querySelector('.product-name').textContent = data.name;
    document.getElementById('seo-product-name').textContent = data.name;

    // 단가 설정
    const unitPrice = document.querySelector('.L-price:not(.totalPrice)');
    if (unitPrice) unitPrice.innerHTML = `<span class="L-price_value">${data.price.toLocaleString()}</span>`;

    // 배송 정보 [cite: 205, 206, 207]
    const method = data.shipping_method === 'PARCEL' ? '택배배송' : '직접배송';
    const fee = data.shipping_fee === 0 ? '무료배송' : `${data.shipping_fee.toLocaleString()}원`;
    document.getElementById('shipping').textContent = `${method} / ${fee}`;

    const img = document.querySelector('.product-image');
    if (img) {
        img.src = data.image;
        img.alt = data.name;
    }

    updateUI();
}

// 초기화 및 API 호출
async function initDetailPage() {
    // URL 쿼리 스트링에서 id 파라미터를 가져옴
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id'); 

    if (!productId) {
        alert("상품 정보가 없습니다. 메인으로 이동합니다.");
        // 404 페이지 띄울지 고민
        location.href = "./index.html";
        return;
    }

    try {
        // 해당 productId의 상세 정보를 서버에서 불러옴
        const data = await productAPI.getProductDetail(productId);
        bindProductDetail(data);
    } catch (error) {
        alert(error.message);
    }
}

function setupTabMenu() {
    // 버튼들의 부모 요소를 선택합니다.
    const tabHeader = document.querySelector('.product-info_header');
    
    if (!tabHeader) return;

    // 부모 요소에 클릭 이벤트를 걸어 효율적으로 제어합니다.
    tabHeader.addEventListener('click', (e) => {
        // 클릭된 요소가 버튼인지 확인합니다.
        const targetButton = e.target.closest('button');
        if (!targetButton) return;

        // 1. 모든 버튼에서 활성화 클래스를 제거하고 비활성화 클래스를 입힙니다.
        const allButtons = tabHeader.querySelectorAll('button');
        allButtons.forEach(btn => {
            btn.classList.remove('tab-Activ-button');
            btn.classList.add('tab-Disabled-button');
        });

        // 2. 현재 클릭된 버튼에만 활성화 클래스를 추가합니다.
        targetButton.classList.add('tab-Activ-button');
        targetButton.classList.remove('tab-Disabled-button');
        
        // [추가 기능] 탭에 맞는 콘텐츠를 보여주고 싶다면 여기에 로직을 추가하세요.
        console.log(`${targetButton.textContent} 탭 클릭됨`);
    });
}

// 이벤트 리스너
document.addEventListener('DOMContentLoaded', () => {
    initDetailPage();
    setupTabMenu();

    plusBtn?.addEventListener('click', () => {
        if (amount < currentProduct.stock) {
            amount++;
            updateUI();
        }
    });

    minusBtn?.addEventListener('click', () => {
        if (amount > MIN_QTY) {
            amount--;
            updateUI();
        }
    });
    
    // 바로 구매하기
    buyBtn?.addEventListener('click', () => {
        if (!isAuthenticated()) {
            if (typeof window.openModal === 'function') window.openModal();
            return;
        }

        const orderData = {
            product_id: currentProduct.id,
            quantity: amount,
            total_price: (currentProduct.price * amount) + currentProduct.shipping_fee
        };
        
        sessionStorage.setItem('orderInfo', JSON.stringify(orderData));
        window.location.href = '/order.html';
    });

    // 장바구니 담기
    cartBtn?.addEventListener('click', async () => {
        if (!isAuthenticated()) {
            // 전역 모달 함수 호출 (gnb.js/modal.js 연동)
            if (typeof window.openModal === 'function') window.openModal();
            return;
        }

        const userType = localStorage.getItem("user_type");
        if (userType !== "BUYER") {
            alert("구매자 계정으로 로그인해주세요.");
            return;
        }

        try {
            const token = getAccessToken(); // storage.js 유틸리티 사용
            await productAPI.addToCart(currentProduct.id, amount, token);
            alert("장바구니에 상품이 담겼습니다.");
        } catch (error) {
            alert(error.message);
        }
    });
});