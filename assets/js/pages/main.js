import productAPI from '../api/product.js';

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
        alert("상품을 로드하는 중 오류가 발생했습니다.");
    }
};

document.addEventListener('DOMContentLoaded', renderMainProducts);