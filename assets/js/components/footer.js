const renderFooter = () => {
    const footer = document.querySelector('footer');
    if (!footer) return;

    const isSubPage = window.location.pathname.includes('/html/');
    const pathPrefix = isSubPage ? '../../' : './';

    footer.innerHTML = `
        <div class="container">
            <div class="footer-top">
                <ul class="footer-links">
                    <li><a href="#">호두샵 소개</a></li>
                    <span class="divider">|</span>
                    <li><a href="#">이용약관</a></li>
                    <span class="divider">|</span>
                    <li><a href="#">개인정보처리방침</a></li>
                    <span class="divider">|</span>
                    <li><a href="#">전자금융거래약관</a></li>
                    <span class="divider">|</span>
                    <li><a href="#">청소년보호정책</a></li>
                    <span class="divider">|</span>
                    <li><a href="#">제휴문의</a></li>
                </ul>
                <ol class="sns-links">
                    <li><button type="button"><img src="${pathPrefix}assets/images/icon-insta.svg" alt="인스타그램"></button></li>
                    <li><button type="button"><img src="${pathPrefix}assets/images/icon-fb.svg" alt="페이스북"></button></li>
                    <li><button type="button"><img src="${pathPrefix}assets/images/icon-yt.svg" alt="유튜브"></button></li>
                </ol>
            </div>

            <!-- 위 / 아래 구분선 -->
            <div class="row-divider"></div>
            
            <address class="footer-info">
                <p class="company-name">(주)HODU SHOP</p>
                <p>제주특별자치도 제주시 동광로 137 제주코딩베이스캠프</p>
                <div class="biz-info">
                    <span>사업자 번호 : 000-0000-0000</span>
                    <span class="divider">|</span>
                    <span>통신판매업</span>
                </div>
                <p>대표 : 김호두</p> 
            </address>
        </div>
    `;
};

document.addEventListener('DOMContentLoaded', renderFooter);