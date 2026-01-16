import { getRootPrefix } from "../utils/path.js";
import productAPI from '../api/product.js';
import { getAccessToken, isAuthenticated } from '../utils/storage.js';

// 설정값 및 상태 관리
const MIN_QTY = 1;
let currentProduct = null; 
let amount = MIN_QTY;
const rootPrefix = getRootPrefix();

// DOM 요소 선택
const plusBtn = document.querySelector('.plus');
const minusBtn = document.querySelector('.minus');
const amountDisplay = document.querySelector('.current-amount');
const quantityDisplay = document.querySelector('.quantity');
const totalPriceDisplay = document.querySelector('.totalPrice');
const buyBtn = document.querySelector('.M-button');
const cartBtn = document.querySelector('.M-dark-button');


// UI 업데이트: 수량 및 총 가격 표시 제어
function updateUI() {
    if (!currentProduct) return;

    amountDisplay.innerText = amount;
    quantityDisplay.innerText = amount;
    
    const total = (currentProduct.price * amount) + currentProduct.shipping_fee;
    totalPriceDisplay.textContent = total.toLocaleString();

    plusBtn.disabled = amount >= currentProduct.stock;
    minusBtn.disabled = amount <= MIN_QTY;
}

// 서버 데이터를 화면 요소에 바인딩
function bindProductDetail(data) {
    currentProduct = data;

    document.querySelector('.seller').textContent = data.seller.store_name;
    document.querySelector('.product-name').textContent = data.name;
    document.getElementById('seo-product-name').textContent = data.name;

    const unitPrice = document.querySelector('.L-price:not(.totalPrice)');
    if (unitPrice) unitPrice.innerHTML = `<span class="L-price_value">${data.price.toLocaleString()}</span>`;

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


// 상세 페이지 초기화 및 데이터 로드
async function initDetailPage() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id'); 

    if (!productId) {
        alert("상품 정보가 없습니다. 메인으로 이동합니다.");
        location.href = `${rootPrefix}index.html`;
        return;
    }

    try {
        const data = await productAPI.getProductDetail(productId);
        bindProductDetail(data);
    } catch (error) {
        alert(`데이터 로드 실패: ${error.message}`);
    }
}


// 바로 구매 로직 처리
function handleDirectOrder() {
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
    window.location.href = `${rootPrefix}order.html`;
}


// 장바구니 담기 로직 처리 
async function handleAddToCart() {
    if (!isAuthenticated()) {
        if (typeof window.openModal === 'function') window.openModal();
        return;
    }

    const userType = localStorage.getItem("user_type");
    if (userType !== "BUYER") {
        alert("구매자 계정으로 로그인해주세요.");
        return;
    }

    try {
        const token = getAccessToken();
        await productAPI.addToCart(currentProduct.id, amount, token);
        alert("장바구니에 상품이 담겼습니다.");
    } catch (error) {
        alert(error.message);
    }
}

// 초기화 실행 및 이벤트 바인딩
document.addEventListener('DOMContentLoaded', () => {
    initDetailPage();
    
    // 수량 조절 버튼
    plusBtn?.addEventListener('click', () => {
        if (amount < currentProduct?.stock) {
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

    // 구매 및 장바구니 버튼 핸들러 연결
    buyBtn?.addEventListener('click', handleDirectOrder);
    cartBtn?.addEventListener('click', handleAddToCart);
});