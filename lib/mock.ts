// 푸른안과(전주) 기본 데이터. 시드(/api/dev-seed)가 Payload 에 넣고, 시드 전에는 프론트 폴백으로도 쓴다.
// 병원 정보는 lib/site.ts(SITE·HOURS), 의료진은 lib/doctors.ts(DOCTORS) 를 그대로 가져와 블로그 타입으로 바꾼다. 한 곳만 고치면 된다.
import type { Category, ClinicInfo, Doctor } from "./types";
import { HOURS, SITE } from "./site";
import { DOCTORS } from "./doctors";

export const clinic: ClinicInfo = {
  name: SITE.name,
  nameEn: SITE.nameEn,
  homepageUrl: "/", // 같은 사이트의 홈페이지 첫 화면
  address: SITE.roadAddress, // 글 하단·소개 문단에 쓰는 주소 (끝의 병원명 없이)
  phone: SITE.tel,
  fax: SITE.fax,
  businessNumber: SITE.bizNo,
  representatives: [SITE.ceo],
  hours: [
    { label: HOURS.weekday.label, value: HOURS.weekday.time },
    { label: HOURS.saturday.label, value: HOURS.saturday.time },
    { label: "휴진", value: "일요일 및 공휴일" },
  ],
  directions: "",
  parking: [],
  mapLinks: [
    { label: "네이버 지도", href: SITE.naverMapUrl },
    { label: "카카오 지도", href: SITE.kakaoMapUrl },
  ],
  sns: [],
  legalLinks: [{ label: "개인정보처리방침", href: "/privacy" }],
  homepageMenu: [],
  consultUrl: "/contact/online", // 상담·예약 버튼 → 홈페이지 상담 신청
  kakaoChannelUrl: "",
  // 소개 문단 아래 수치 4개 (홈페이지 병원소개 페이지의 공개 수치 + 개원·의료진)
  stats: [
    { label: "연간 방문", value: "100,000명 이상" },
    { label: "연간 수술", value: "7,000명 이상" },
    { label: "전주에서 개원", value: `${SITE.since}년` },
    { label: "분야별 전문의", value: `${DOCTORS.length}명` },
  ],
  statsNote: "",
  disclaimerText: "",
  ctaTitle: "",
  ctaText: "",
};

// 블로그 카테고리 = 홈페이지 진료과목 3개 + 눈 건강 일반. slug 는 영문 (URL /blog/{slug})
export const categories: Category[] = [
  { slug: "vision", name: "시력교정", description: "스마일·라식·라섹 등 시력교정수술의 검사, 수술 과정, 수술 후 관리 안내" },
  { slug: "cataract", name: "백내장·노안", description: "백내장과 노안의 증상, 인공수정체 선택, 수술과 수술 후 관리" },
  { slug: "retina", name: "망막질환", description: "비문증·망막박리·망막혈관질환·포도막염·당뇨망막병증·황반변성의 증상, 검사, 치료 안내" },
  { slug: "eye-health", name: "눈 건강", description: "안구건조증, 녹내장, 소아안과 등 일상에서 챙기는 눈 건강 정보" },
];

export const popularKeywords = ["백내장", "비문증", "스마일라식", "황반변성"]; // 모바일은 앞 2개만 보인다

// 의료진: 홈페이지 의료진 데이터(lib/doctors.ts)를 작성자 카드용으로 변환. 약력은 "현/전" 라벨을 앞에 붙여 한 줄씩
export const doctors: Doctor[] = DOCTORS.map((d) => ({
  slug: d.slug,
  name: d.name,
  title: d.title,
  specialties: d.specialties,
  bio: d.motto,
  career: d.careers.flatMap((c) => c.items.map((item) => (c.label === "약력" ? item : `${c.label}) ${item}`))),
}));
