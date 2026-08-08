/* ==========================================================================
   이미지 경로 상수
   원본 helplus.kr 에서 받은 이미지를 WebP 로 변환해 public/images/ 아래에
   보관하고, 여기서 한 곳으로 모아 참조한다. (경로 변경 시 이 파일만 수정)
   변환: sharp — JPG q82 / PNG q92(알파 유지), 합계 10.8MB → 1.9MB
   ========================================================================== */

/* --------------------------------------------------------------------------
   메인 히어로 배경 (2000×1059) — 원본 index/c_main_*.jpg
   -------------------------------------------------------------------------- */
export const HERO_IMAGES = [
  "/images/hero/c_main_1.webp",
  "/images/hero/c_main_2.webp",
  "/images/hero/c_main_3.webp",
] as const;

/* --------------------------------------------------------------------------
   PARTNERS 카드 (747×501) — 원본 index/k_main_banner_*.jpg
   -------------------------------------------------------------------------- */
export const PARTNER_IMAGES = [
  "/images/partners/k_main_banner_1.webp",
  "/images/partners/k_main_banner_2.webp",
  "/images/partners/k_main_banner_3.webp",
  "/images/partners/k_main_banner_4.webp",
] as const;

/* --------------------------------------------------------------------------
   서브 페이지 상단 배너 — PC / 모바일 각각
   원본은 대메뉴 그룹별로 다른 배너를 쓴다.
   -------------------------------------------------------------------------- */
export const SUB_BANNERS = {
  /** KPSC소개 (설립 목적 / 파트너사) — 원본 20260114221127pc_1 / m_1 */
  about: { pc: "/images/sub/about_pc.webp", mobile: "/images/sub/about_m.webp" },
  /** 인사말 (인사말 / 방향성) — 원본 20240124180222pc_2 / 20240320190957m_2 */
  greeting: {
    pc: "/images/sub/greeting_pc.webp",
    mobile: "/images/sub/greeting_m.webp",
  },
  /** 조직 구성 (운영진 소개 / 갤러리) — 원본 20260114221127pc_3 / m_3 */
  organization: { pc: "/images/sub/org_pc.webp", mobile: "/images/sub/org_m.webp" },
  /** 사업 및 서비스 — 원본 20240124180222pc_4 / 20240320190957m_4 */
  services: {
    pc: "/images/sub/services_pc.webp",
    mobile: "/images/sub/services_m.webp",
  },
  /** 활동 및 소식 (게시판) — 원본 20240320190957pc_8 / m_8 */
  news: { pc: "/images/sub/news_pc.webp", mobile: "/images/sub/news_m.webp" },
  /** 회원관리 (로그인 / 회원가입) */
  member: { pc: "/images/sub/member_pc.webp", mobile: "/images/sub/member_m.webp" },
} as const;

export type SubBannerKey = keyof typeof SUB_BANNERS;

/* --------------------------------------------------------------------------
   서브 페이지 본문 이미지 — 원본 index/*.jpg
   -------------------------------------------------------------------------- */
export const CONTENT_IMAGES = {
  /** 설립 목적 — 신재생 에너지 발전소 */
  purpose: "/images/content/purpose_1.webp",
  /** 함께하는 사람들 — 여행 파트너 RETOO[레투코리아] (원본 이미지) */
  partner1: "/images/content/partner_1.webp",
  /** 함께하는 사람들 — 인쇄 파트너 프린트천국 (원본 이미지) */
  partner2: "/images/content/partner_2.webp",
  /** 함께하는 사람들 — 홈페이지 파트너 WEFLOW (Unsplash, 원본에 없는 신규) */
  partner3: "/images/content/partner_3.webp",
  /** 함께하는 사람들 — 액세서리 파트너 미니미니핸드폰 (Unsplash, 신규) */
  partner4: "/images/content/partner_4.webp",
  /** 인사말 — Office Architecture */
  greeting: "/images/content/greeting_1.webp",
  /** 방향성 — Vision */
  direction: "/images/content/direction_1.webp",
} as const;

/* --------------------------------------------------------------------------
   로고 — 원본은 흰색/컬러 두 장을 겹쳐두고 스크롤에 따라 크로스페이드한다.
     · white : 투명 헤더(최상단)에서 사용
     · color : 흰 배경 헤더(스크롤 후)에서 사용
   -------------------------------------------------------------------------- */
export const LOGO = {
  white: "/images/logo-white.webp",
  color: "/images/logo-color.webp",
} as const;

/* --------------------------------------------------------------------------
   레이어 팝업
   -------------------------------------------------------------------------- */
export const POPUP_IMAGE = "/images/popup.webp";

/* --------------------------------------------------------------------------
   우측 퀵메뉴 전화 아이콘 (22×22) — 원본 index/right_long_bar_tel.gif
   -------------------------------------------------------------------------- */
export const QUICK_TEL_ICON = "/images/quick-tel.webp";
