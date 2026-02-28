나를읽다 연구소 — LLM 사업 컨텍스트 v2.1
최종 업데이트: 2026-02-28
1. 사업 개요
온라인 사주+MBTI 유료 리포트 서비스 (₩30,000)
 상품 4종: N1(나를읽다/PDF+테마곡), N2(나를듣다/+음성+힐링), W1(우리를읽다), W2(우리를듣다)
 타겟: 30~50세 한국인
 보증서 시스템: Cloudflare Pages + 고유코드(8자리), 이메일/SMS 자동 발송
2. 기술 스택
2-1. Google Sheets + Apps Script
스프레드시트 ID: 1xrV0JsJOKrVw6Q2gVm068MyZpCYGz-5kiIabWigzNk0
GAS 웹앱 URL: https://script.google.com/macros/s/AKfycbwyuXY4ZSqDX60kjXeD9oc4ftXf-QSHuA8QnnHnPzIDg22AEYp8-bgjod1XEikMoRxy7g/exec
동적 열 매핑 (getColumnMap), webReportData JSON 저장, doGet 통합 JSON API
고객 폴더 ID: 1x5cf7aGL8DeY-EIXg4i2IpUYg4b2kxUG
현재 배포 버전: v47 이상 (2026-02-28 기준)
2-2. Cloud Run 서버
서버: naread-main-v2 rev00056 (asia-northeast3)
SERVER_URL: https://naread-main-v2-1075269376260.asia-northeast3.run.app
SAJU_API_URL: https://naread-saju-1075269376260.asia-northeast3.run.app/saju
server.js v7.0: Express, CORS, Google Sheets(readonly), Anthropic Claude, node-fetch, NodeCache
2-3. 보증서 페이지
GitHub Pages → Cloudflare Pages
URL: https://readmelab-github-io.pages.dev/?c=
단일 index.html 파일 (HTML + CSS + JavaScript 일체형)
2-4. SMS (Solapi)
API_KEY: NCSUJBVRQTLH6AO6
API_SECRET: RMJ3JKB41HY4DFXJXKTML8MFYGFXXZDL
SENDER: 01068996339
SMS 발송 정상 작동 확인됨
2-5. 구글 폼
N폼 URL: https://docs.google.com/forms/d/e/1FAIpQLScpevb653seFseqAHVA6HzDH8Px_ZjxDrllvXcaYoUXyXeUGw/viewform
N폼 접수코드 entry ID: 1576431055
W폼 URL: https://docs.google.com/forms/d/e/1FAIpQLScxePVExEm6kN6ioAHVDZVhYL_h1mROgfbHuG1a7yk4_uIW7Q/viewform
W폼 접수코드 entry ID: 1016248444
3. 시트 구조 (변경 금지)
3-1. 마스터 시트 헤더 (고정, 절대 수정 불가)
발송 | 주인공1 | 주인공2 | 주문자 | 상품 | 이메일 | 연락처 | 상태 | 폼발송 | 폼응답 | PDF | PDF명 | 테마곡 | 테마곡명 | 음성 | 음성명 | 힐링 | 힐링명 | 관리코드 | 보증코드 | 보증URL | 생성일 | 메일 | 문자 | 비고 | 폴더링크 | 페르소나 | 사주문서 | 소름한줄 | 테마곡설명 | 음성설명 | 힐링설명 | 만세력 | 작업상태 | 리포트종류 | 상대방정보 | 웹리포트데이터 | 리포트챕터
3-2. N폼 응답 시트 헤더
A: 타임스탬프 | B: 개인정보동의 | C: 접수코드 | D: 본인사주여부 | E: 분석결과 누구에게 | F: 대상자이메일 | G: 이름 | H: 성별 | I: 생년월일 | J: 양력/음력 | K: 태어난시간 | L: MBTI | M: 심층질문 | N: 연락처 | O: 이메일
3-3. W폼 응답 시트 헤더
A: 타임스탬프 | B: 개인정보동의 | C: 접수코드 | D: 본인궁합여부 | E: 분석결과 누구에게 | F: 대상자이메일 | G: 이름(내담자) | H: 성별(내담자) | I: 생년월일(내담자) | J: 양력/음력(내담자) | K: 시간(내담자) | L: MBTI(내담자) | M: 이름(상대) | N: 성별(상대) | O: 생년월일(상대) | P: 양력/음력(상대) | Q: 시간(상대) | R: MBTI(상대) | S: 관계 | T: 만남기간 | U: 심층질문 | V: 연락처 | W: 이메일
4. GAS 상수 매핑 (현재 동작 확인됨)
var PRODUCTS = {
  N1: { code: 'N1', items: ['pdf','theme'],                   line: '나를읽다' },
  N2: { code: 'N2', items: ['pdf','theme','voice','healing'],  line: '나를읽다' },
  W1: { code: 'W1', items: ['pdf','theme'],                   line: '우리를읽다' },
  W2: { code: 'W2', items: ['pdf','theme','voice','healing'],  line: '우리를읽다' }
};

var ITEM_KEY_TO_HEADER = {
    pdf: 'PDF', theme: '테마곡', voice: '음성', healing: '힐링'
};
var ITEM_NAME_HEADERS = {
    pdf: 'PDF명', theme: '테마곡명', voice: '음성명', healing: '힐링명'
};
var ITEM_DESC_HEADERS = {
    theme: '테마곡설명', voice: '음성설명', healing: '힐링설명'
};
var ITEM_LABELS = {
    pdf: 'PDF 리포트', theme: '테마곡', voice: '음성 해설', healing: '힐링 사운드'
};

5. GAS handleReportLookup_ — audio 객체 빌드 (해결됨)
핵심 수정: handleReportLookup_ 함수에서 상품 코드를 resolveProductCode_로 변환해야 함.
var productCode = getCellByHeader_(sheet, targetRow, '상품');
var resolvedCode = resolveProductCode_(productCode) || productCode;
var product = PRODUCTS[resolvedCode] || {};

이 수정이 없으면 마스터 시트의 ‘나를 읽다’(띄어쓰기 포함)가 PRODUCTS에서 매칭되지 않아 audio: {}가 반환됨.
JSON API 반환 구조 (정상 동작 확인됨):
{
  "valid": true,
  "certCode": "XRAKJ6P9",
  "certificate": { "name": "테스트11", "product": "나를 읽다", "productLine": "나를읽다" },
  "report": { "meta": {...}, "persona": {...}, "chapters": [...] },
  "audio": {
    "theme": {
      "label": "테마곡",
      "name": "새벽 호수의 등불",
      "description": "...",
      "fileId": "12-UGoSb4x2QZAe1POvqQHs1fq3-pxb90",
      "url": "https://drive.google.com/file/d/..."
    }
  }
}

6. 보증서 페이지 (index.html) — 오디오 시스템 구조
6-1. 핵심 함수 관계
startBgm()          → audioPlayers['theme'] 자동재생, BGM 바 활성화
                       패널은 열지 않음 (사용자가 직접 열기)
toggleBgm()         → playPause(bgmType) 호출 (3줄)
togglePlayer(type)  → 패널 열기/닫기, 미로드 시 loadAudio(type) 호출
loadAudio(type)     → theme이면 기존 객체 재사용 + playPause('theme')
                       voice/healing이면 GAS fetch → new Audio() 생성
playPause(type)     → 다른 오디오 정지, 재생/일시정지 토글, BGM 바 동기화
startProgressUpdate → 섹션 progress + BGM 바 progress 동시 업데이트

6-2. BGM ↔ 테마곡 연동 방식
BGM 자동재생 시 audioPlayers['theme']에 Audio 객체 저장, audioLoaded['theme'] = true
테마곡 섹션 열면 loadAudio('theme') → audioLoaded['theme']가 true이므로 새 Audio 안 만들고 playPause('theme') 호출
하나의 Audio 객체를 공유하므로 BGM 바와 테마곡 섹션이 100% 연동
playPause에서 if (type === 'theme') audio.loop = true; 설정
6-3. BGM 바 HTML 구조
<div class="bgm-bar" id="bgmBar">
    <button class="bgm-bar-btn" id="bgmBtn">⏸</button>
    <div class="bgm-bar-info">
        <div class="bgm-bar-title" id="bgmTitle">♪ 맞춤형 음원</div>
        <progress id="bgmProgress" value="0" max="100"></progress>
        <div class="bgm-bar-sub" id="bgmSub">배경음악 재생 중</div>
    </div>
</div>

onclick 없음 — DOMContentLoaded에서 addEventListener('click') → playPause(bgmType)
6-4. 상품별 표시 로직
N1: PDF 버튼 + 테마곡 버튼만 표시
N2: PDF + 테마곡 + 음성 + 힐링 4개 표시
데이터가 없는 항목은 버튼 자체가 생성되지 않음
버튼 라벨은 시트의 N열(테마곡명), P열(음성명), R열(힐링명)에서 가져옴
6-5. CSS 주요 수정 사항
.player-desc: word-break: keep-all; white-space: pre-wrap; overflow-wrap: break-word; (한글 줄바꿈 수정)
#bgmProgress 커스텀 스타일: gold 색상 progress bar
7. 전체 운영 흐름
7-1. 주문 단계
주문 발생 (수동 입력 or 네이버 API) → 마스터 시트에 주문자, 상품, 연락처만 입력됨
7-2. 상품 선택 시
onProductChange_ 실행 → 상품코드 resolve → 해당 상품에 필요한 열 주황색 하이라이트 → 행 전체 보라색 → 상태 “폼대기”
7-3. 폼 발송
보증서 관리 메뉴 → 폼 문자 발송 or 폼 이메일 발송 → 관리코드가 포함된 구글 폼 URL 발송
7-4. 고객 폼 작성 → 매칭
고객이 N폼/W폼 작성 후 제출 → 폼 응답 시트에 저장 → onFormSubmitN_/W_ 트리거 → 접수코드(관리코드)로 마스터 시트 행 매칭 → 마스터에 주인공1 (W폼은 주인공2도), 이메일 기록 → 상태 “응답대기”
7-5. 파이프라인 가동
상태 “응답대기” → 파이프라인 실행 → buildPayloadV2_ → 사주 API → Claude 페르소나 → Claude 리포트 → 결과를 마스터 시트에 저장
7-6. 발송
모든 컨텐츠 생성 완료 → 상태 “발송준비완료” → 보증서 문자/메일 발송
8. 핵심 원칙: 데이터 저장 위치
데이터
저장 위치
비고
주문 정보 (주문자, 상품, 연락처)
마스터 시트
수동/API 입력
폼 전체 데이터 (이름, 생일, MBTI 등)
N폼/W폼 응답 시트
마스터에 복사 안 함
주인공1, 주인공2
마스터 시트
폼 매칭 시 기록
이메일
마스터 시트
폼 매칭 시 기록
페르소나, 리포트, 만세력, 소름한줄
마스터 시트
파이프라인 완료 후 기록
음원 URL, 이름, 설명
마스터 시트 M~R, AD~AF열
수동 입력

9. GAS 함수 매핑
함수
역할
상태
parseNFormResponse_
N폼 응답 파싱
✅ 완료
parseWFormResponse_
W폼 응답 파싱
✅ 완료
writeNFormData_
마스터에 주인공1+이메일 기록
✅ 완료
writeWFormData_
마스터에 주인공1,2+이메일 기록
✅ 완료
buildPayloadV2_
폼 응답 시트에서 payload 생성
✅ 완료
getFormDataByAdminCode_
관리코드로 폼 응답 검색
✅ 완료
handleReportLookup_
보증서 JSON API (audio 포함)
✅ 완료 (resolvedCode 수정됨)
resolveProductCode_
한글 상품명 → 코드 변환
✅ 완료
sendSms_
Solapi SMS 발송
✅ 정상
doGet
보증서 JSON API
✅ 배포됨

10. 미해결 이슈 (TODO)
#
이슈
상태
1
GAS 웹앱 재배포 — audio 포함 JSON 정상 반환 확인됨
✅ 해결
2
handleReportLookup_ audio 빈 객체 — resolveProductCode_ 적용
✅ 해결
3
보증서 페이지 오디오 연동 — BGM↔테마곡 100% 연동
✅ 해결
4
테마곡 설명 줄바꿈 — CSS word-break/white-space 수정
✅ 해결
5
15행 테스트 — PDF/PDF명 미생성, 구글 폴더 미생성, 주인공1에 생년월일이 들어감
⏳ 조사 필요
6
AH열(작업상태)에 “🔄 파이프라인진행” 표시 — 정상 완료 후 상태 미변경
⏳ 조사 필요
7
onProductChange_ 상품 코드 resolve 확인
⏳ 미완료
8
하이라이트 색상 순서 (주황 → 보라 덮어쓰기 방지)
⏳ 미완료
9
사주 API year 파싱 오류 — Year undefined
⏳ 미완료
10
W폼 파이프라인 — buildPayloadV2_ W폼 궁합 payload 미구현
⏳ 미완료
11
onFormSubmitN_/W_ 트리거 설치 확인
⏳ 미확인
12
AD열 테마곡설명 — 테스트 텍스트를 실제 설명으로 교체 필요
⏳ 수동 작업

11. 수정 금지 규칙 (Safeguards)
규칙 1: 마스터 시트 구조 변경 절대 금지
 열 추가, 삭제, 이름 변경, 순서 변경 일체 불가
규칙 2: 기존 메뉴 구조 변경 금지
 사용자가 명시적으로 요청한 경우에만 변경
규칙 3: 한 번에 하나의 함수만 수정
 수정 전 "이 함수만 수정합니다"라고 명시
규칙 4: 수정 전 영향도 분석 필수
 호출 관계, 읽기/쓰기 열, side effect 확인
규칙 5: 추가만, 덮어쓰기 금지
 기존 동작 변경은 사용자 확인 후에만
규칙 6: 테스트 먼저, 적용 나중에
 수정 코드 제시 → 사용자 테스트 → 확인 → 적용
규칙 7: 코드 붙여넣기 위치 명확히 지시
 “함수 바깥에”, “몇 번째 줄 아래에” 등 정확한 위치 안내. 함수 안에 다른 함수/이벤트리스너를 넣지 않도록 주의
12. 상수 목록 (GAS)
var SHEET_ID = '1xrV0JsJOKrVw6Q2gVm068MyZpCYGz-5kiIabWigzNk0';
var GITHUB_PAGE = 'https://readmelab-github-io.pages.dev/?c=';
var SOLAPI_API_KEY = 'NCSUJBVRQTLH6AO6';
var SOLAPI_API_SECRET = 'RMJ3JKB41HY4DFXJXKTML8MFYGFXXZDL';
var SOLAPI_SENDER = '01068996339';
var CUSTOMER_FOLDER_ID = '1x5cf7aGL8DeY-EIXg4i2IpUYg4b2kxUG';
var SERVER_URL_ = 'https://naread-main-v2-1075269376260.asia-northeast3.run.app';
var SAJU_API_URL = 'https://naread-saju-1075269376260.asia-northeast3.run.app/saju';

13. server.js v7.0 파이프라인 흐름
POST /v2/report/full → jobId 반환 → 프롬프트 로드 + 사주 API → Claude 페르소나 → Claude 리포트 → 챕터 파싱 → GAS 웹훅 (PIPELINE_COMPLETE) → 에러 시 PIPELINE_ERROR

다음 세션 우선순위:
#5 — 15행 테스트 문제 조사 (PDF 미생성, 폴더 미생성, 주인공1에 생년월일)
#6 — 파이프라인 작업상태 미변경 문제
#9 — 사주 API year 파싱 오류

