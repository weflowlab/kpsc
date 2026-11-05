/** 사이트 전역 정보 (고객 구글폼·기존 홈페이지 기준). 링크 URL은 확정 후 교체 */
export const SITE = {
  name: "KPSC",
  nameEn: "KPSC",
  legalName: "KPSC",
  ceo: "이도영",
  privacyOfficer: "이도영",
  zip: "",
  address: "제주특별자치도 서귀포시 무릉리 651",
  /** 지도 검색·좌표 변환용 도로명 주소 */
  roadAddress: "제주특별자치도 서귀포시 무릉리 651",
  /** 좁은 폭(모바일 푸터)에서 한 줄에 들어가는 짧은 주소 */
  shortAddress: "서귀포시 무릉리 651",
  tel: "010-2406-7432",
  lasikTel: "010-2406-7432",
  fax: "",
  bizNo: "",
  since: 2017,
  kakaoUrl: "https://pf.kakao.com/_VqFIX",
  instagramUrl: "https://blog.naver.com/helplus_kr",
  /** 웹블로그 (같은 사이트의 /blog — Payload CMS 로 관리) */
  blogUrl: "/blog",
  // 지도 앱 링크: 현재는 검색 링크 — 병원에서 정확한 장소 링크를 받으면 교체
  naverMapUrl: "https://map.naver.com/p/search/%EC%A0%84%EC%A3%BC%20%ED%91%B8%EB%A5%B8%EC%95%88%EA%B3%BC%EC%9D%98%EC%9B%90",
  kakaoMapUrl: "https://map.kakao.com/link/search/%EC%A0%84%EC%A3%BC%20%ED%91%B8%EB%A5%B8%EC%95%88%EA%B3%BC%EC%9D%98%EC%9B%90",
};

/** 진료시간 (기존 홈페이지 기준) */
export const HOURS = {
  weekday: { label: "평일", time: "오전 09:00 ~ 12:30 / 오후 14:00 ~ 18:00" },
  saturday: { label: "토요일", time: "오전 08:30 ~ 12:30" },
  notes: ["대기자가 많을 경우 접수가 조기 마감됩니다.", "전화 접수는 불가합니다. 양해 부탁드립니다."],
};

export type MenuPage = { slug: string; label: string; /** 외부 링크면 지정 */ external?: string };
export type MenuGroup = { slug: string; label: string; labelEn: string; pages: MenuPage[]; /** 메뉴(PC 헤더·모바일 전체메뉴·서브페이지 경로 드롭다운)에는 표시하지 않음 */ hideInMenus?: boolean };

/** 전체 메뉴 — 기존 홈페이지 구조 기준, 커뮤니티는 구글폼 요청(공지·FAQ·후기). URL: /{group}/{page} */
export const MENU: MenuGroup[] = [
  {
    slug: "about",
    label: "푸른안과",
    labelEn: "ABOUT",
    pages: [
      { slug: "intro", label: "병원소개" },
      { slug: "doctors", label: "의료진소개" },
      { slug: "equipment", label: "첨단의료장비" },
      { slug: "location", label: "오시는 길" },
    ],
  },
  {
    slug: "vision",
    label: "시력교정 클리닉",
    labelEn: "VISION CORRECTION",
    pages: [
      { slug: "pre-care", label: "수술 전 진료 시스템" },
      { slug: "lasik", label: "LASIK / LASEK" },
      { slug: "smile", label: "Smile 4 me" },
      { slug: "post-care", label: "수술 후의 관리 시스템" },
      { slug: "fact-check", label: "FACT CHECK" },
    ],
  },
  {
    slug: "cataract",
    label: "백내장",
    labelEn: "CATARACT",
    pages: [
      { slug: "about", label: "백내장" },
      { slug: "iol", label: "인공수정체 탈구" },
    ],
  },
  {
    slug: "retina",
    label: "망막클리닉 보임",
    labelEn: "RETINA CLINIC BOIM",
    pages: [
      { slug: "boim", label: "망막클리닉 보임" },
      { slug: "floaters", label: "비문증" },
      { slug: "detachment", label: "망막박리" },
      { slug: "vascular", label: "망막혈관질환" },
      { slug: "uveitis", label: "포도막염" },
      { slug: "diabetic", label: "당뇨망막병증" },
      { slug: "macular", label: "황반변성" },
    ],
  },
  {
    slug: "community",
    label: "커뮤니티",
    labelEn: "COMMUNITY",
    pages: [
      { slug: "notice", label: "공지사항" },
      { slug: "faq", label: "자주묻는질문" },
      { slug: "reviews", label: "고객후기" },
    ],
  },
  {
    slug: "contact",
    label: "상담 문의",
    labelEn: "CONTACT",
    pages: [{ slug: "online", label: "상담 신청하기" }],
  },
  {
    slug: "blog",
    label: "웹블로그",
    labelEn: "BLOG",
    hideInMenus: true, // 메뉴에는 안 보이고 퀵메뉴·메인 블로그 섹션으로 들어간다
    // 블로그는 /{group}/{page} 구조가 아니라 /blog 자체가 페이지 (app/(site)/blog)
    pages: [{ slug: "home", label: "눈 건강 이야기", external: "/blog" }],
  },
];

/** 페이지 링크 (외부 링크 우선) */
export const pageHref = (group: MenuGroup, page: MenuPage) => page.external ?? `/${group.slug}/${page.slug}`;

/** 다른 사이트로 나가는 링크인지 (새 창으로 열 대상). 같은 사이트의 /blog 같은 경로는 아님 */
export const isExternalHref = (href: string) => /^https?:\/\//.test(href);

/** 대메뉴 링크 = 첫 하위 페이지 */
export const groupHref = (group: MenuGroup) => pageHref(group, group.pages[0]);

/** URL 조각으로 메뉴 찾기 */
export function findPage(groupSlug: string, pageSlug: string) {
  const group = MENU.find((g) => g.slug === groupSlug);
  const page = group?.pages.find((p) => p.slug === pageSlug && !p.external);
  return group && page ? { group, page } : null;
}
