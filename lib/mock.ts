// 푸른안과(전주) 기본 데이터. 시드(/api/dev-seed)가 Payload 에 넣고, 시드 전에는 프론트 폴백으로도 쓴다.
// 병원 정보는 lib/site.ts(SITE·HOURS), 의료진은 lib/doctors.ts(DOCTORS) 를 그대로 가져와 블로그 타입으로 바꾼다. 한 곳만 고치면 된다.
import type { Category, ClinicInfo, Doctor } from "./types";
import { SITE } from "./site";

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
    { label: "월 ~ 일", value: "AM 09:00 ~ PM 06:00" },
    { label: "휴무", value: "금요일 · 공휴일" },
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
  consultUrl: SITE.kakaoUrl, // 문의 버튼 → 카카오채널
  kakaoChannelUrl: "",
  // 소개 문단 아래 수치 (관리자에서 채우기 전에는 비움)
  stats: [],
  statsNote: "",
  disclaimerText: "",
  ctaTitle: "",
  ctaText: "",
};

// 블로그 카테고리 (시드 전 폴백). slug 는 영문 (URL /blog/{slug})
export const categories: Category[] = [
  { slug: "news", name: "KPSC 소식", description: "KPSC의 새로운 소식과 공지를 전합니다." },
  { slug: "share", name: "나눔·사회공헌", description: "Save the Children 파트너로서의 나눔과 사회공헌 활동." },
  { slug: "travel", name: "여행 이야기", description: "KPSC여행사와 함께하는 여행 이야기." },
  { slug: "partners", name: "파트너", description: "KPSC와 함께하는 파트너들의 이야기." },
];

export const popularKeywords = ["나눔", "여행", "파트너십", "KPSC여행사"]; // 모바일은 앞 2개만 보인다

// 작성자 (시드 전 폴백 — 관리자에서 추가하기 전에는 비움)
export const doctors: Doctor[] = [];
