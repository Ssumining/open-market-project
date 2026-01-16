import productAPI from '../api/product.js'; // [cite: 53]

// 1. 설정값 및 상태 관리
const MIN_QTY = 1;
let currentProduct = null; 
let amount = MIN_QTY;

// 2. DOM 요소 선택
const plusBtn = document.querySelector('.plus');
const minusBtn = document.querySelector('.minus');
const amountDisplay = document.querySelector('.current-amount');
const quantityDisplay = document.querySelector('.quantity');
const totalPriceDisplay = document.querySelector('.totalPrice');
const buyBtn = document.querySelector('.M-button');
const cartBtn = document.querySelector('.M-dark-button');

// 3. UI 업데이트 함수
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

// 4. 데이터 바인딩
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
    img.src = data.image;
    img.alt = data.name;

    updateUI();
}

// 5. 초기화 및 API 호출
async function initDetailPage() {
    // const params = new URLSearchParams(window.location.search);
    // const productId = params.get('id');
    // ===== 테스트를 위해 ID를 20번으로 고정 (하드코딩)
    const productId = 2; 

    if (!productId) {
        alert("상품 정보가 없습니다.");
        return;
    }

    if (!productId) {
        alert("상품 정보가 없습니다.");
        return;
    }
    // =====

    try {
        // product.js의 함수를 사용하여 데이터 호출 [cite: 237]
        const data = await productAPI.getProductDetail(productId);
        bindProductDetail(data);
    } catch (error) {
        alert(error.message);
    }
}

// 6. 이벤트 리스너
document.addEventListener('DOMContentLoaded', () => {
    initDetailPage();

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
    
    buyBtn?.addEventListener('click', () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("로그인이 필요한 서비스입니다.");
            return;
        }

        // 주문 페이지로 필요한 데이터 전달 (예: sessionStorage 활용)
        const orderData = {
            order_kind: 'direct_order',
            product_id: currentProduct.id,
            quantity: amount,
            total_price: (currentProduct.price * amount) + currentProduct.shipping_fee
        };
        
        sessionStorage.setItem('orderInfo', JSON.stringify(orderData));
        window.location.href = '/order.html'; // 주문 페이지 이동
    });

    // 장바구니 담기 실행 [cite: 284, 286]
    cartBtn?.addEventListener('click', async () => {
        const token = localStorage.getItem('token'); // 로그인 시 저장된 토큰 가정 [cite: 70]
        
        if (!token) {
            alert("로그인이 필요한 서비스입니다."); [cite: 76]
            return;
        }

        try {
            await productAPI.addToCart(currentProduct.id, amount, token);
            alert("장바구니에 상품이 담겼습니다."); [cite: 288]
        } catch (error) {
            alert(error.message); [cite: 299, 300]
        }
    });
});