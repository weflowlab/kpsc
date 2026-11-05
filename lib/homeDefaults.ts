// 블로그 메인(/blog) 기본 문구의 단일 출처.
// - 프론트 컴포넌트: Payload 'home' 글로벌 값이 비어 있을 때 이 문구를 보여 준다.
// - Payload 설정(globals/HomePage.ts): 필드 defaultValue 로 써서 새 DB 에서도 관리자 화면에 미리 채워진다.
// - 시드(/api/dev-seed): 비어 있는 필드를 이 문구로 채워 관리자가 "지금 보이는 글"을 그대로 수정할 수 있게 한다.
// 사실 위주로 쓰고 "최고·최상" 같은 과장 표현은 쓰지 않는다 (의료광고법).
// "|" 는 모바일에서만 줄바꿈(components/blog/ui/MobileBreaks), "\n" 은 모든 화면에서 줄바꿈.
import type { ClinicInfo, FaqItem } from "./types";

// 히어로
export const heroTitle = (clinic: Pick<ClinicInfo, "name">) => `${clinic.name} 의료진이\n직접 쓰는 눈 건강 이야기`;
export const HERO_TEXT = "시력교정·백내장·망막 분야 전문의가 직접 집필한 |안과 정보에서 궁금한 점의 해답을 찾아보세요.";
export const SEARCH_PLACEHOLDER = "증상이나 질환명을 검색해 보세요";

// 배너 슬라이드 (이미지 없이 문구만. 이미지는 관리자에서 올린다)
export const BANNERS: { label: string; text: string }[] = [
  {
    label: "2001년부터 전주에서, 분야별 전문의가 함께 보는 안과",
    text: "시력교정·백내장·망막 질환을|분야별 전문의가 직접 진료합니다.",
  },
  {
    label: "망막클리닉 보임",
    text: "비문증·망막박리·황반변성 등 망막 질환을\n검사부터 치료, 수술 후 관리까지|한곳에서 진료합니다.",
  },
];

// 의료진 소개 (왼쪽 문구만. 카드는 의료진 컬렉션에서 온다)
export const doctorsTitle = (clinic: Pick<ClinicInfo, "name">) => `${clinic.name} 의료진 소개`;
export const DOCTORS_TEXT = "시력교정·백내장·망막 |분야별 전문의가 직접 진료합니다.";
export const DOCTORS_BUTTON = "의료진 소개";
export const DOCTORS_LINK = "/about/doctors"; // 홈페이지 의료진 소개

// 핵심 요약 (ABOUT)
export const SUMMARY_TITLE = "전주 덕진구 |시력교정·백내장·망막 전문 안과"; // "|" 앞 공백: 데스크톱 한 줄일 때 띄어쓰기
export const summaryText = (clinic: Pick<ClinicInfo, "name" | "address">) =>
  `${clinic.name}는 ${clinic.address.replace("덕진구 ", "덕진구 |")}에 있는 안과로,\n시력교정·백내장·망막 분야별 전문의가 |검사부터 수술 후 관리까지 한곳에서 진료합니다.`;

// 장점 카드 4개 (WHY). 아이콘은 components/blog/home/StrengthsSection 에서 순서대로 붙는다.
export const KEY_POINTS: { title: string; text: string }[] = [
  { title: "분야별 전문의", text: "시력교정·백내장·망막 분야별 전문의가 각자의 전문 분야를 진료합니다." },
  { title: "2001년부터 전주에서", text: "오랜 기간 지역에서 쌓아 온 진료 경험으로\n환자의 눈 상태에 맞는 치료 방향을 안내합니다." },
  { title: "원스톱 진료", text: "검사·진단·수술·수술 후 관리까지\n한곳에서 이어집니다." },
  { title: "망막클리닉 보임", text: "망막 질환 전담 클리닉에서\n정밀 검사와 치료를 받을 수 있습니다." },
];

// 자주 묻는 질문. 병원 정보(진료시간·전화)는 clinic 에서 가져온다.
export const faq = (clinic: Pick<ClinicInfo, "name" | "hours" | "parking" | "directions" | "phone">): FaqItem[] => [
  {
    question: `${clinic.name}는 어떤 질환을 진료하나요?`,
    answer: "시력교정수술(스마일·라식·라섹), 백내장·노안, 망막질환(비문증·망막박리·망막혈관질환·포도막염·당뇨망막병증·황반변성)을 분야별 전문의가 나누어 진료합니다.",
  },
  {
    question: "진료시간은 어떻게 되나요?",
    answer: `${clinic.hours.map((h) => `${h.label} ${h.value}`).join(" / ")} 입니다. 대기자가 많을 경우 접수가 조기 마감될 수 있습니다.`,
  },
  {
    question: "예약·상담은 어떻게 하나요?",
    answer: `홈페이지 상담 신청 페이지에 남겨 주시면 확인 후 연락드리고, 대표전화 ${clinic.phone}로 문의하실 수도 있습니다.`,
  },
  {
    question: "검사 당일 준비할 것이 있나요?",
    answer: "정밀 검사를 위해 동공을 키우는 안약을 넣으면 몇 시간 동안 눈부심과 근거리 흐림이 있을 수 있으니, 직접 운전은 피하시고 콘택트렌즈 대신 안경을 쓰고 오시는 것이 좋습니다.",
  },
];
