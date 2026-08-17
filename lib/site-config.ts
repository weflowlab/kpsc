/* ==========================================================================
   사이트 전역 설정 — 원본 helplus.kr 의 메뉴 구조 / 회사 정보를 한 곳에 모음
   각 페이지·헤더·푸터가 모두 이 파일을 참조한다.
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
   카카오톡 상담 채널 — 클라이언트 전달 (2026-08)
   원본 약관 표기: _VqFIX = 메인채널, _KmtfX = 당직실 채널
   (당직실/파트너톡: PM 06:00 ~ 다음날 AM 07:00, 일·월·공휴일 문의)
   -------------------------------------------------------------------------- */
export const KAKAO_CHANNELS = [
  {
    key: "KPSC",
    name: "KPSC 메인채널",
    desc: "화 ~ 토 AM 09:00 ~ PM 06:00",
    href: "https://pf.kakao.com/_VqFIX",
  },
  {
    key: "KPSM",
    name: "KPSC 온라인파트너톡(KPSM)",
    desc: "PM 06:00 이후·일/월/공휴일 문의",
    href: "https://pf.kakao.com/_KmtfX",
  },
] as const;

/* --------------------------------------------------------------------------
   문의 메일 — 클라이언트 전달 (2026-08)
   ※ kpsckoreaoffice@daum.net 은 카카오 계정이라 푸터 메일 목록에서 제외한다
     (카카오 상담은 위 KAKAO_CHANNELS 링크로 연결)
   -------------------------------------------------------------------------- */
export const CONTACT_EMAILS = [
  { label: "대표 메일", email: "skytravegroupoffice@naver.com" },
  { label: "비서실", email: "lg01024067432@gmail.com" },
  { label: "섭외 문의", email: "4534q@kakao.com" },
] as const;

/* --------------------------------------------------------------------------
   운영시간 — 클라이언트 전달 (2026-08). 퀵메뉴 바 / 푸터 공용
   -------------------------------------------------------------------------- */
export const BUSINESS_HOURS = [
  {
    brand: "KPSC",
    rows: [
      { label: "화요일 ~ 토요일", time: "AM 09:00 ~ PM 06:00" },
      { label: "점심", time: "AM 11:30 ~ PM 02:00" },
    ],
    note: "일요일 · 월요일 · 공휴일 휴무",
  },
  {
    brand: "KPSM",
    rows: [
      { label: "매일", time: "PM 06:00 ~ AM 07:00" },
      { label: "점심", time: "AM 11:30 ~ PM 02:00" },
    ],
    note: "공휴일 휴무",
  },
] as const;

/* --------------------------------------------------------------------------
   회사 정보 — 푸터 / 헤더 전화 링크 공용
   -------------------------------------------------------------------------- */
export const COMPANY = {
  name: "KPSC",
  fullName: "KPSC",
  ceo: "이도영",
  address: "제주특별자치도 서귀포시 무릉리 651",
  tel: "010-2406-7432",
  email: "kpsckoreaoffice@daum.net",
  copyright: "Copyright ⓒ 2026 helplus.kr All rights reserved.",
} as const;

/* --------------------------------------------------------------------------
   현재 경로가 속한 대메뉴 그룹 조회 — 서브메뉴 탭바 렌더링에 사용
   -------------------------------------------------------------------------- */
export function findNavGroup(pathname: string): NavItem | undefined {
  return NAV.find((group) =>
    group.children.some((child) => child.href === pathname)
  );
}
