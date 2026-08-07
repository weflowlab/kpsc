/* ==========================================================================
   메인(홈) 페이지 콘텐츠 데이터
   원본 helplus.kr 메인 페이지의 텍스트를 그대로 옮긴 정적 데이터.
   이미지 경로는 lib/images.ts 에서 별도로 관리한다.
   ========================================================================== */

/* --------------------------------------------------------------------------
   히어로 슬라이드 — 3장, 15초 루프 CSS 크로스페이드
   -------------------------------------------------------------------------- */
export type HeroSlide = {
  /** 상단 pill 배지 (영문) */
  badge: string;
  /** 2줄 구성 메인 타이틀 */
  title: [string, string];
  /** 서브 카피 */
  description: string;
};

export const HERO_SLIDES: HeroSlide[] = [
  {
    badge: "Innovation & Future",
    title: ["미래 에너지를 선도하며,", "지속 가능한 생태계를 구축합니다."],
    description: "단순 발전을 넘어, 친환경 전환으로 대한민국 에너지 자립을 이끕니다.",
  },
  {
    badge: "Social Value",
    title: ["이익을 넘어 가치를 나누며,", "지역사회와 함께 상생합니다."],
    description: "에너지 복지를 실현하며 어려운 이웃과 온기를 나눕니다.",
  },
  {
    badge: "Eco-friendly Action",
    title: ["일상 속 작은 실천으로,", "탄소중립의 내일을 약속합니다."],
    description: "일상 속 진정성 있는 실천으로 친환경 미래를 만들어갑니다.",
  },
];

/* --------------------------------------------------------------------------
   PARTNERS 섹션 — 4개 카드 (PC 4열 / 태블릿 2열 슬라이더 / 모바일 1열)
   -------------------------------------------------------------------------- */
export type PartnerCard = {
  /** 카드 좌상단 번호 */
  num: string;
  title: string;
  description: string;
  href: string;
};

export const PARTNER_CARDS: PartnerCard[] = [
  {
    num: "01",
    title: "설립목적",
    description:
      "친환경 에너지 전환으로 탄소중립을 실천하며, 지속 가능한 미래 에너지 생태계와 국가 에너지 자립을 구축합니다.",
    href: "/about/purpose",
  },
  {
    num: "02",
    title: "가치와 비전",
    description:
      "차세대 친환경 기술 혁신으로 미래 에너지를 선도하며, 수익을 나누어 지역사회와 상생하는 따뜻한 가치를 지향합니다.",
    href: "/about/partners",
  },
  {
    num: "03",
    title: "협동조합의 방향성",
    description:
      "확고한 책임 경영과 투명한 운영을 바탕으로, 조합원과 함께 명실상부한 친환경 에너지 리더로 성장해 나아갑니다.",
    href: "/greeting/direction",
  },
  {
    num: "04",
    title: "제공서비스",
    description:
      "태양광, 풍력 및 효율적인 에너지 저장 시스템(ESS) 구축을 통해, 안전하고 혁신적인 맞춤형 에너지 솔루션을 제공합니다.",
    href: "/services",
  },
];

/* --------------------------------------------------------------------------
   배너 카드 섹션 — 2개 카드 (PC 2열 1fr : 1.1fr)
   이미지 없이 CSS glow + 워터마크 숫자로 구성된 원본 구조를 따른다.
   -------------------------------------------------------------------------- */
export type BannerCard = {
  /** 배경 워터마크 숫자 */
  watermark: string;
  /** 상단 배지 (국문) */
  badge: string;
  title: string;
  /** 2줄 구성 설명 */
  description: [string, string];
  href: string;
  /** 강조(accent) 카드 여부 — true 면 어두운 배경 (원본: 01 다크 / 02 라이트) */
  accent: boolean;
};

export const BANNER_CARDS: BannerCard[] = [
  {
    watermark: "01",
    badge: "신뢰의 리더십",
    title: "운영진 소개",
    description: ["흔들림 없는 책임 경영", "고객 성공을 위한 진정한 동행을 시작합니다."],
    href: "/organization/team",
    accent: true,
  },
  {
    watermark: "02",
    badge: "분야별 전문가",
    title: "갤러리",
    description: ["다양한 작품을 기록하고", "감각적인 시선으로 담아낸 결과를 공유합니다."],
    href: "/organization/gallery",
    accent: false,
  },
];

/* --------------------------------------------------------------------------
   고객지원 센터 — 게시판 미리보기 2컬럼
   -------------------------------------------------------------------------- */
export type BoardPreview = {
  title: string;
  moreHref: string;
  posts: { title: string; date: string; href: string }[];
};

export const BOARD_PREVIEWS: BoardPreview[] = [
  {
    title: "KPSC 활동",
    moreHref: "/news/activities",
    posts: [
      {
        title: "고객의 소리 [KPSC활동] 게시판 이용안내..",
        date: "2026-06-20",
        href: "/news/activities/6",
      },
    ],
  },
  {
    title: "공지사항 / 뉴스",
    moreHref: "/news/notice",
    posts: [
      { title: "KPSC 운영시간 안내", date: "2026-07-07", href: "/news/notice/59" },
      { title: "KPSC그룹브랜드 안내", date: "2026-07-02", href: "/news/notice/58" },
      { title: "KPSCkorea서포터즈 신청서", date: "2026-06-25", href: "/news/notice/57" },
      {
        title: "다운로드 가능한 파일 및 신청서 작성관련안내..",
        date: "2026-06-24",
        href: "/news/notice/56",
      },
    ],
  },
];

/* --------------------------------------------------------------------------
   PARTNERS 섹션 헤더 문구
   -------------------------------------------------------------------------- */
export const PARTNERS_HEADING = {
  label: "PARTNERS",
  title: "KPSC",
  description: "올바른 방향으로 성공을 지원합니다.",
} as const;
