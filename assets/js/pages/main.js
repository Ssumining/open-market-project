import productAPI from '../api/product.js';

// 상품 목록 렌더링
async function renderMainProducts() {
    const productList = document.querySelector('.product-list');
    if (!productList) return;
    
    try {
        const data = await productAPI.getAllProducts(); // API에서 전체 상품 가져오기
        productList.innerHTML = ''; // 초기 리스트 비우기

        data.results.forEach(product => {
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
            
            // 클릭 시 상세 페이지로 이동 (쿼리 스트링 id 전달)
            productItem.addEventListener('click', () => {
                location.href = `/html/products/detail.html?id=${product.id}`;
            });

            productList.appendChild(productItem);
        });
    } catch (error) {
        console.error(error);
        alert("상품을 로드하는 중 오류가 발생했습니다.");
    }
}


// 2. 메인 슬라이더 (Main Visual Slider)
function initSlider() {
    const sliderList = document.querySelector('.slider-list');
    const slides = document.querySelectorAll('.main-visual');
    const prevBtn = document.querySelector('.btn-prev');
    const nextBtn = document.querySelector('.btn-next');
    const paginationItems = document.querySelectorAll('.pagination li');

    // 슬라이더 요소가 없는 페이지일 경우 실행 중단
    if (!sliderList) return;

    let currentIndex = 0;
    const totalSlides = slides.length;
    const intervalTime = 3000; 
    let slideInterval;

    // UI 업데이트 함수
    function updateUI() {
        sliderList.style.transform = `translateX(-${currentIndex * 100}%)`;
        paginationItems.forEach((item, index) => {
            item.classList.toggle('on', index === currentIndex);
        });
    }

    // 다음 슬라이드로 이동
    function moveToNextSlide() {
        currentIndex = (currentIndex < totalSlides - 1) ? currentIndex + 1 : 0;
        updateUI();
    }

    // 자동 슬라이드 시작
    function startAutoSlide() {
        stopAutoSlide();
        slideInterval = setInterval(moveToNextSlide, intervalTime);
    }

    // 자동 슬라이드 정지
    function stopAutoSlide() {
        clearInterval(slideInterval);
    }

    // 이벤트 리스너 등록
    nextBtn?.addEventListener('click', () => {
        moveToNextSlide();
        startAutoSlide();
    });

    prevBtn?.addEventListener('click', () => {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : totalSlides - 1;
        updateUI();
        startAutoSlide();
    });

    paginationItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentIndex = index;
            updateUI();
            startAutoSlide();
        });
    });

    sliderList.addEventListener('mouseenter', stopAutoSlide);
    sliderList.addEventListener('mouseleave', startAutoSlide);

    // 초기 실행
    startAutoSlide();
}


// 초기화 실행 (DOMContentLoaded)
document.addEventListener('DOMContentLoaded', () => {
    renderMainProducts();
    initSlider();
});