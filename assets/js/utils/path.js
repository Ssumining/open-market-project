// GitHub Pages 배포 환경(서브디렉토리)과 로컬 환경 모두 대응
export const getRootPrefix = () => {
    const path = window.location.pathname;

    // 현재 경로가 /html/ 폴더 내부인지 확인
    const isSubPage = path.includes('/html/');
    
    // 루트 폴더로 돌아가기 위한 상대 경로 설정
    // html 폴더 안이면 '../', 메인이면 './' (또는 '')
    const prefix = isSubPage ? '../../' : './';

    return prefix;
};

// 절대 경로가 필요한 경우 현재 호스트 정보와 결합하여 반환

export const getAbsolutePath = (relativePath) => {
    const root = getRootPrefix();
    return `${root}${relativePath}`;
};