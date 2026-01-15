// 1. 설정값 (상수)
const MAX_QTY = 10;
const MIN_QTY = 1;
const UNIT_PRICE = 17500; 

// 2. 초기 상태
let amount = MIN_QTY; 

// 3. DOM 요소 선택
const plusBtn = document.querySelector('.plus');
const minusBtn = document.querySelector('.minus');
const amountDisplay = document.querySelector('.current-amount');
const quantity = document.querySelector('.quantity');
const receipt = document.querySelector('.totalPrice'); 
const tabHeader = document.querySelector('.product-info_header');

// 4. UI 업데이트 함수
function updateUI() {
    // 수량 텍스트 업데이트
    if (amountDisplay) amountDisplay.innerText = amount;
    if (quantity) quantity.innerText = amount;
    
    // 총 금액 계산 및 업데이트
    if (receipt) {
        const totalPrice = amount * UNIT_PRICE;
        receipt.textContent = totalPrice.toLocaleString();
    }

    // 버튼 비활성화 제어
    const isMax = amount >= MAX_QTY;
    const isMin = amount <= MIN_QTY;

    if (plusBtn) {
        plusBtn.disabled = isMax;
        plusBtn.classList.toggle('is-disabled', isMax);
    }
    if (minusBtn) {
        minusBtn.disabled = isMin;
        minusBtn.classList.toggle('is-disabled', isMin);
    }
}

// 5. 데이터 바인딩 함수들
function bindSeller(name) {
    const seller = document.querySelector('.seller');
    if (seller) seller.textContent = name;
}

function bindProductName(name) {
    const productName = document.querySelector('.product-name');
    const seoProductName = document.getElementById('seo-product-name');
    if (productName) productName.textContent = name;
    if (seoProductName) seoProductName.textContent = name;
}

function bindPrice(price) {
    const lPriceList = document.querySelectorAll('.L-price');
    lPriceList.forEach((el) => {
        el.innerHTML = `<span class="L-price_value">${price.toLocaleString()}</span>`;
    });
}

function bindShipping(method, fee) {
    const shipping = document.getElementById('shipping');
    if (shipping) shipping.textContent = `${method} / ${fee}`;
}

function bindImage(url) {
    const img = document.querySelector('.product-image_main');
    if (img) {
        img.src = url;
        img.alt = '상품이미지';
    }
}

// 6. 초기화 함수
function initDetailPage() {
    // 임시 데이터 (추후 API 데이터로 대체)
    const productData = {
        seller: '백엔드글로벌',
        name: '딥러닝 개발자 무릎 담요',
        price: UNIT_PRICE,
        shippingMethod: '택배배송',
        shippingFee: '무료배송',
        imageUrl: 'https://via.placeholder.com/400' // 임시 이미지 URL
    };

    bindSeller(productData.seller);
    bindProductName(productData.name);
    bindPrice(productData.price);
    bindShipping(productData.shippingMethod, productData.shippingFee);
    bindImage(productData.imageUrl);
    
    updateUI();
}

// 7. 이벤트 리스너 등록
document.addEventListener('DOMContentLoaded', () => {
    initDetailPage();

    // 수량 조절 버튼 이벤트
    plusBtn?.addEventListener('click', () => {
        if (amount < MAX_QTY) {
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

    // 탭 헤더 클릭 이벤트 (이벤트 위임)
    tabHeader?.addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;

        const currentActive = tabHeader.querySelector('.tab-Activ-button');
        if (currentActive) {
            currentActive.classList.remove('tab-Activ-button');
            currentActive.classList.add('tab-Disabled-button');
        }

        target.classList.add('tab-Activ-button');
        target.classList.remove('tab-Disabled-button');
    });
});
