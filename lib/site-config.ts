/* ==========================================================================
   사이트 전역 설정 — 원본 helplus.kr 의 메뉴 구조 / 회사 정보를 한 곳에 모음
   각 페이지·헤더·푸터·퀵메뉴가 모두 이 파일을 참조한다.
   ========================================================================== */

/* --------------------------------------------------------------------------
   타입 정의
   -------------------------------------------------------------------------- */
export type SubNavItem = {
  /** 메뉴에 노출되는 국문 라벨 */
  label: string;
  /** Next.js 라우트 경로 (원본 .php 경로를 정적 라우트로 재매핑) */
  href: string;
};

export type NavItem = {
  /** 1depth 대메뉴 라벨 */
  label: string;
  /** 대메뉴 영문 표기 (드롭다운 헤딩용) */
  labelEn: string;
  /** 2depth 하위 메뉴 */
  children: SubNavItem[];
};

/* --------------------------------------------------------------------------
   GNB (글로벌 내비게이션) — 원본 5개 대메뉴 / 9개 하위 메뉴
   원본 URL 매핑:
     /kpsc_purpose.php?pg=11            → /about/purpose
     /partner.php?pg=12                 → /about/partners
     /greeting.php?pg=21                → /greeting
     /direction.php?pg=22               → /greeting/direction
     /team.php?pg=31                    → /organization/team
     /bbs.php?table=gallery&pg=32       → /organization/gallery
     /services.php?pg=41                → /services
     /bbs.php?table=activities&pg=51    → /news/activities
     /bbs.php?table=notice&pg=52        → /news/notice
   -------------------------------------------------------------------------- */
export const NAV: NavItem[] = [
  {
    label: "KPSC소개",
    labelEn: "About KPSC",
    children: [
      { label: "KPSC의 설립 목적", href: "/about/purpose" },
      { label: "KPSC와 함께하는 사람들", href: "/about/partners" },
    ],
  },
  {
    label: "인사말",
    labelEn: "Greeting",
    children: [
      { label: "운영진 또는 대표 인사말", href: "/greeting" },
      { label: "KPSC의 방향성", href: "/greeting/direction" },
    ],
  },
  {
    label: "조직 구성",
    labelEn: "Organization",
    children: [
      { label: "운영진 소개", href: "/organization/team" },
      { label: "갤러리", href: "/organization/gallery" },
    ],
  },
  {
    label: "사업 및 서비스",
    labelEn: "Services",
    children: [{ label: "제공 서비스", href: "/services" }],
  },
  {
    label: "활동 및 소식",
    labelEn: "News",
    children: [
      { label: "고객의 소리", href: "/news/activities" },
      { label: "공지사항 / 뉴스", href: "/news/notice" },
    ],
  },
];

/* --------------------------------------------------------------------------
   유틸 메뉴 (헤더 우측)
   -------------------------------------------------------------------------- */
export const UTIL_NAV: SubNavItem[] = [
  { label: "로그인", href: "/login" },
  { label: "회원가입", href: "/register" },
];

/* --------------------------------------------------------------------------
   회사 정보 — 푸터 / 고객센터 박스 / 퀵메뉴 공용
   -------------------------------------------------------------------------- */
export const COMPANY = {
  name: "KPSC",
  fullName: "KPSC 협동조합",
  ceo: "이도영",
  address: "제주특별자치도 서귀포시 무릉리 651",
  tel: "010-2406-7432",
  email: "kpsckoreaoffice@daum.net",
  copyright: "Copyright ⓒ 2026 helplus.kr All rights reserved.",
} as const;

/* --------------------------------------------------------------------------
   고객센터 안내 (좌측 사이드바 #menu_tel 영역)
   -------------------------------------------------------------------------- */
export const CUSTOMER_CENTER = {
  titleEn: "Customer",
  titleEnStrong: "Center",
  tel: COMPANY.tel,
  hoursTitleEn: "Operating",
  hoursTitleEnStrong: "Hours",
  hours: ["평일 09:00 ~ 18:00", "토, 일 및 공휴일 휴무"],
} as const;

/* --------------------------------------------------------------------------
   우측 고정 퀵메뉴 바 (#right_long_bar_layer)
   -------------------------------------------------------------------------- */
export const QUICK_MENU: SubNavItem[] = [
  { label: "설립 목적", href: "/about/purpose" },
  { label: "파트너사", href: "/about/partners" },
  { label: "인사말", href: "/greeting" },
  { label: "방향성", href: "/greeting/direction" },
  { label: "운영진 소개", href: "/organization/team" },
  { label: "갤러리", href: "/organization/gallery" },
  { label: "제공 서비스", href: "/services" },
  { label: "조합 활동", href: "/news/activities" },
  { label: "공지·뉴스", href: "/news/notice" },
];

/** 퀵메뉴 하단 상담시간 안내 (원본 우측 바 문구 그대로) */
export const QUICK_MENU_HOURS = [
  "평일 AM 09:00 ~ PM 06:00",
  "점심 AM 11:30 ~ PM 02:00",
  "일요일,월요일,공휴일 휴무",
] as const;

/* --------------------------------------------------------------------------
   서브페이지 좌측 서브메뉴 그룹
   key = 대메뉴 label, 해당 그룹의 하위 메뉴 전체를 좌측 사이드바에 노출
   -------------------------------------------------------------------------- */
export function findNavGroup(pathname: string): NavItem | undefined {
  return NAV.find((group) =>
    group.children.some((child) => child.href === pathname)
  );
}
