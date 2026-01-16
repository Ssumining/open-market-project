import productAPI from '../api/product.js';

// 상품 카드 HTML 구조 생성 (컴포넌트화)
function createProductCard(product) {
    const productItem = document.createElement('li');
    productItem.className = 'product-item';
    
    productItem.innerHTML = `
        <article class="product-card" data-id="${product.id}">
            <figure class="product-img">
                <img src="${product.image}" alt="${product.name}">
            </figure>
            <section class="product-info">
                <span class="seller">${product.seller.store_name}</span>
                <h3 class="product-name">${product.name}</h3>
                <p class="price-box"><strong class="price">${product.price.toLocaleString()}</strong>원</p>
            </section>
        </article>
    `;

    // 클릭 이벤트 바인딩
    productItem.addEventListener('click', () => {
        location.href = `./html/products/detail.html?id=${product.id}`;
    });

    return productItem;
}

// 상품 목록 렌더링 메인 로직
async function renderMainProducts() {
    const productList = document.querySelector('.product-list');
    if (!productList) return;
    
    try {
        const data = await productAPI.getAllProducts();
        
        // DocumentFragment를 사용 성능 높임 (DOM 접근 횟수 감소)
        const fragment = document.createDocumentFragment();
        productList.innerHTML = ''; 

        data.results.forEach(product => {
            const card = createProductCard(product);
            fragment.appendChild(card);
        });

        productList.appendChild(fragment);
    } catch (error) {
        console.error("상품 렌더링 에러:", error);
        alert("상품을 로드하는 중 오류가 발생했습니다.");
    }
}

// 메인 슬라이더 초기화 (상태 관리 로직 개선)
function initSlider() {
    const sliderList = document.querySelector('.slider-list');
    const prevBtn = document.querySelector('.btn-prev');
    const nextBtn = document.querySelector('.btn-next');
    const paginationItems = document.querySelectorAll('.pagination li');

    if (!sliderList) return;

    let currentIndex = 0;
    const totalSlides = document.querySelectorAll('.main-visual').length;
    let slideInterval;

    const updateUI = () => {
        sliderList.style.transform = `translateX(-${currentIndex * 100}%)`;
        paginationItems.forEach((item, index) => {
            item.classList.toggle('on', index === currentIndex);
        });
    };

    const nextSlide = () => {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateUI();
    };

    const prevSlide = () => {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateUI();
    };

    const startAuto = () => {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 3000);
    };

    nextBtn?.addEventListener('click', () => { nextSlide(); startAuto(); });
    prevBtn?.addEventListener('click', () => { prevSlide(); startAuto(); });
    
    sliderList.addEventListener('mouseenter', () => clearInterval(slideInterval));
    sliderList.addEventListener('mouseleave', startAuto);

    startAuto();
}

document.addEventListener('DOMContentLoaded', () => {
    renderMainProducts();
    initSlider();
});