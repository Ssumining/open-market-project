
(function setup404BackHandler() {
  if (window.__404BackHandlerInstalled) return;
  window.__404BackHandlerInstalled = true;

  document.addEventListener(
    "click",
    (e) => {
      const btn = e.target.closest("[data-back]");
      if (!btn) return;

      e.preventDefault();

      // 바로 직전 히스토리로
      if (history.length > 1) {
        history.back();
        return;
      }

      // 히스토리가 없으면(새 탭 등) = 폴백
      try {
        if (
          document.referrer &&
          new URL(document.referrer).origin === location.origin
        ) {
          location.replace(document.referrer);
        } else {
          location.replace("../../index.html#productList");
        }
      } catch {
        location.replace("../../index.html#productList");
      }
    },
    { passive: false }
  );
})();
