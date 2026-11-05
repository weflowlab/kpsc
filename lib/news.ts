import { SITE } from "@/lib/site";

/** 공지사항 분류 (목록 필터) */
export const NEWS_CATEGORIES = ["진료 일정", "진료 안내", "병원 소식", "건강 정보"] as const;
export type NewsCategory = (typeof NEWS_CATEGORIES)[number];

/** 공지사항 게시글 */
export type NewsPost = {
  id: number;
  title: string;
  /** 분류 (공지사항: NEWS_CATEGORIES, 고객후기: REVIEW_CATEGORIES) */
  category?: string;
  /** 목록 맨 위 고정 */
  pinned?: boolean;
  date: string;
  views: number;
  /** 대표 이미지 자리 라벨 (없으면 이미지 미노출) */
  thumbnail?: string;
  /** 본문 문단 (빈 문자열은 빈 줄) */
  body: string[];
  /** 본문 하단 외부 링크 */
  link?: { label: string; href: string };
};

/** 샘플 게시글 — 최신순 정렬은 getNewsList에서 처리 */
const POSTS: NewsPost[] = [
  {
    id: 101,
    title: `${SITE.name}에 오신 것을 환영합니다.`,
    category: "병원 소식",
    date: "2025-01-02",
    views: 452,
    thumbnail: "개원 안내",
    body: [
      `안녕하세요, ${SITE.name}입니다.`,
      "",
      "시력교정·백내장·망막 진료 모두 정밀한 검사와 꼼꼼한 진료를 약속드립니다.",
      "환자분 한 분 한 분의 눈 건강을 위해 최선을 다하겠습니다.",
    ],
  },
  {
    id: 102,
    title: "환자의 권리와 의무",
    category: "진료 안내",
    pinned: true,
    date: "2025-01-02",
    views: 192,
    body: [
      "환자는 진료받을 권리, 알 권리 및 자기결정권, 비밀을 보호받을 권리, 상담·조정을 신청할 권리가 있습니다.",
      "",
      "환자는 의료인에게 자신의 건강 정보를 정확히 알리고, 의료인의 치료계획을 신뢰하고 존중할 의무가 있습니다.",
      "또한 부정한 방법으로 진료를 받지 않을 의무가 있습니다.",
    ],
  },
  {
    id: 103,
    title: "설 연휴 진료 안내",
    category: "진료 일정",
    date: "2025-01-20",
    views: 287,
    thumbnail: "설 연휴 진료 일정",
    body: [
      "설 연휴 기간 진료 일정을 안내드립니다.",
      "",
      "연휴 당일은 휴진하며, 연휴 전후로는 정상 진료합니다.",
      `자세한 사항은 대표번호(${SITE.tel})로 문의해 주시기 바랍니다.`,
    ],
  },
  {
    id: 104,
    title: "주차 이용 안내",
    category: "진료 안내",
    date: "2025-02-11",
    views: 341,
    body: [
      "내원 고객님께서는 건물 지하 주차장을 이용하실 수 있습니다.",
      "",
      "진료 후 접수처에서 주차 등록을 해 주시면 2시간 무료 주차가 가능합니다.",
    ],
  },
  {
    id: 105,
    title: "산동 검사 시 유의사항",
    category: "진료 안내",
    date: "2025-03-04",
    views: 518,
    body: [
      "망막 정밀검사를 위해 동공을 확장하는 산동 검사를 시행할 수 있습니다.",
      "",
      "검사 후 4~6시간 동안 눈부심과 근거리 시력 저하가 있을 수 있으니 직접 운전은 삼가 주세요.",
      "보호자 동반 또는 대중교통 이용을 권해드립니다.",
    ],
  },
  {
    id: 106,
    title: "OCT 정밀 검사 장비 도입 안내",
    category: "병원 소식",
    date: "2025-03-27",
    views: 403,
    thumbnail: "OCT 검사 장비",
    body: [
      "보다 정확한 망막 진단을 위해 최신 빛간섭단층촬영(OCT) 장비를 도입하였습니다.",
      "",
      "황반변성, 당뇨망막병증, 망막전막 등 질환의 조기 발견과 경과 관찰에 활용됩니다.",
    ],
  },
  {
    id: 107,
    title: "5월 가정의 달 휴진 안내",
    category: "진료 일정",
    date: "2025-04-28",
    views: 226,
    body: [
      "5월 공휴일 휴진 일정을 안내드립니다.",
      "",
      "공휴일 전날은 오후 진료가 조기 마감될 수 있으니 참고 부탁드립니다.",
    ],
  },
  {
    id: 108,
    title: "당뇨 환자 정기 안저검사 권고",
    category: "건강 정보",
    date: "2025-05-15",
    views: 389,
    body: [
      "당뇨를 진단받으신 분은 증상이 없더라도 1년에 한 번 이상 안저검사를 받으시길 권합니다.",
      "",
      "당뇨망막병증은 초기에 자각 증상이 거의 없어 정기 검진이 가장 중요합니다.",
    ],
  },
  {
    id: 109,
    title: "[블로그] 눈 건강 이야기 블로그 오픈",
    category: "병원 소식",
    date: "2025-06-10",
    views: 486,
    thumbnail: "블로그 배너",
    body: [
      `안녕하세요 :) ${SITE.name}입니다.`,
      "",
      "하단 링크를 누르시면 블로그를 확인하실 수 있습니다.",
      "눈 건강 정보와 진료 소식을 쉽게 알아보세요!",
    ],
    link: { label: "블로그 바로가기", href: SITE.blogUrl },
  },
  {
    id: 110,
    title: "여름 휴가 기간 진료 안내",
    category: "진료 일정",
    date: "2025-07-21",
    views: 254,
    body: [
      "여름 휴가 기간 의료진 진료 일정이 일부 변경됩니다.",
      "",
      "예약 환자분께는 개별 연락드릴 예정이며, 변경 일정은 대표번호로 문의해 주세요.",
    ],
  },
  {
    id: 111,
    title: "추석 연휴 진료 안내",
    category: "진료 일정",
    date: "2025-09-29",
    views: 198,
    body: [
      "추석 연휴 기간 진료 일정을 안내드립니다.",
      "",
      "연휴 당일은 휴진하며, 응급 상황 시 인근 응급의료기관을 이용해 주시기 바랍니다.",
    ],
  },
  {
    id: 112,
    title: "독감 유행 시기 내원 안내",
    category: "진료 안내",
    date: "2025-11-03",
    views: 177,
    body: [
      "호흡기 질환 유행 시기에는 내원 시 마스크 착용을 부탁드립니다.",
      "",
      "발열 등 증상이 있으신 경우 접수 시 미리 말씀해 주세요.",
    ],
  },
  {
    id: 113,
    title: "온라인 진료 예약 서비스 오픈",
    category: "병원 소식",
    date: "2025-12-01",
    views: 612,
    thumbnail: "온라인 예약 안내",
    body: [
      "홈페이지와 모바일에서 간편하게 진료 예약을 하실 수 있습니다.",
      "",
      "예약 확정 후 안내 문자가 발송되며, 변경·취소는 전화로 가능합니다.",
    ],
  },
  {
    id: 114,
    title: "2026년 진료 시간 변경 안내",
    category: "진료 일정",
    pinned: true,
    date: "2026-01-05",
    views: 734,
    body: [
      "2026년부터 평일 진료 시간이 일부 조정됩니다.",
      "",
      "변경된 진료 시간은 홈페이지 하단 진료시간 안내를 참고해 주세요.",
    ],
  },
  {
    id: 115,
    title: "비급여 진료비용 안내입니다.",
    category: "진료 안내",
    pinned: true,
    date: "2026-06-09",
    views: 897,
    body: [
      "의료법에 따라 비급여 진료비용을 고지합니다.",
      "",
      "항목별 상세 비용은 원내 게시물 또는 접수처에서 확인하실 수 있습니다.",
    ],
  },
];

/** 목록 한 페이지당 게시글 수 */
export const NEWS_PAGE_SIZE = 10;

/** 최신순(등록일 → id 역순) 게시글 목록 */
export function getNewsList(): NewsPost[] {
  return [...POSTS].sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);
}

/** id로 게시글 조회 */
export function getNewsPost(id: number): NewsPost | undefined {
  return POSTS.find((p) => p.id === id);
}
