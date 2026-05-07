/**
 * 나를읽다 타로 - 어드민 인증 공통 모듈
 *
 * 동작:
 * 1) URL에 ?dev=2991 있으면 → localStorage에 저장 + URL에서 제거
 * 2) localStorage에 admin_key 있으면 → window.adminFetch가 자동으로 헤더에 첨부
 *
 * 새 토픽 페이지 만들 때:
 *   <script src="./admin.js"></script> 한 줄만 추가
 *   기존 fetch() 호출을 window.adminFetch()로 바꾸면 자동 어드민 적용
 *   (기존 fetch() 그대로 둬도 동작은 함, 일반 유저 모드)
 */
(function () {
  // 1) URL 파라미터에서 dev 키 감지 → localStorage 저장
  try {
    const urlParams = new URLSearchParams(location.search);
    const devKey = urlParams.get('dev');
    if (devKey) {
      localStorage.setItem('admin_key', devKey);
      // URL에서 ?dev= 파라미터 제거 (보안: URL 노출 최소화)
      urlParams.delete('dev');
      const newQuery = urlParams.toString();
      const newUrl = location.pathname + (newQuery ? '?' + newQuery : '') + location.hash;
      history.replaceState(null, '', newUrl);
      console.log('[admin] 어드민 키 등록됨. 이 기기는 영구 어드민.');
    }
  } catch (e) {
    console.warn('[admin] init 실패:', e);
  }

  // 2) adminFetch: 자동으로 X-Admin-Key 헤더 첨부하는 fetch wrapper
  window.adminFetch = function (url, options) {
    options = options || {};
    options.headers = options.headers || {};
    const key = localStorage.getItem('admin_key');
    if (key) {
      options.headers['X-Admin-Key'] = key;
    }
    return fetch(url, options);
  };

  // 3) 어드민 여부 헬퍼
  window.isAdmin = function () {
    return !!localStorage.getItem('admin_key');
  };

  // 4) 어드민 해제 (콘솔에서 사용)
  window.adminLogout = function () {
    localStorage.removeItem('admin_key');
    console.log('[admin] 어드민 해제됨. 새로고침하면 일반 유저로 동작.');
  };
})();