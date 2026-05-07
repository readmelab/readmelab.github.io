# 나를읽다 타로 - 어드민 인증 메모

> 이 파일을 까먹지 말 것. GitHub에 push해서 어디서든 찾기 가능.

## 비밀번호
2991

## 등록 방법 (기기당 평생 1번)

각 기기/브라우저에서 아래 URL 한 번 방문:

https://readmelab.github.io/tarot/love-mind.html?dev=2991

- 페이지 로드되면 자동으로 localStorage에 저장됨
- URL에서 ?dev=2991은 자동 제거 (보안)
- 그 후 그 브라우저에서는 영구 어드민

## 등록 확인

브라우저 F12 -> Console 탭에서:
  localStorage.getItem("admin_key")
-> "2991" 나오면 등록됨

## 어드민 해제

브라우저 F12 -> Console 탭에서:
  adminLogout()

## 동작 원리

1. URL ?dev=2991 감지 -> localStorage 저장
2. 모든 API 호출에 X-Admin-Key: 2991 헤더 자동 첨부
3. 백엔드(tarot-server)가 헤더 검증 -> rate limit 우회

## 새 토픽 추가할 때

새 토픽 HTML 파일 만들 때 head 안에 한 줄 추가:
  <script src="./admin.js"></script>

그리고 fetch 호출은 (window.adminFetch || fetch)(...) 로 작성.

-> 이거면 끝. 새 토픽 100개 만들어도 자동 어드민.

## 적용 범위

- OK: 같은 기기 같은 브라우저 (영구 적용)
- OK: IP 바뀌어도 (사무실/집/카페/모바일 어디서든)
- NO: 다른 브라우저 (크롬 등록했으면 사파리는 따로)
- NO: 시크릿 모드 (종료 시 사라짐)
- NO: 캐시 전체 삭제 (재등록 필요)

## 백엔드 환경변수 (Cloud Run)

ADMIN_KEY=2991

위치: tarot-server (asia-northeast3, naread-pdf project)