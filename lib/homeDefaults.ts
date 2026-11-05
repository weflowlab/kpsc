// 블로그 메인(/blog) 기본 문구의 단일 출처.
// - 프론트 컴포넌트: Payload 'home' 글로벌 값이 비어 있을 때 이 문구를 보여 준다.
// - Payload 설정(globals/HomePage.ts): 필드 defaultValue 로 써서 새 DB 에서도 관리자 화면에 미리 채워진다.
// - 시드(/api/dev-seed): 비어 있는 필드를 이 문구로 채워 관리자가 "지금 보이는 글"을 그대로 수정할 수 있게 한다.
// 사실 위주로 쓰고 "최고·최상" 같은 과장 표현은 쓰지 않는다 (의료광고법).
// "|" 는 모바일에서만 줄바꿈(components/blog/ui/MobileBreaks), "\n" 은 모든 화면에서 줄바꿈.
import type { ClinicInfo, FaqItem } from "./types";

// 히어로
export const heroTitle = (clinic: Pick<ClinicInfo, "name">) => `${clinic.name}가 전하는 이야기`;
export const HERO_TEXT = "나눔·여행·파트너십·소식까지, |KPSC의 이야기를 웹블로그에서 만나보세요.";
export const SEARCH_PLACEHOLDER = "궁금한 주제를 검색해 보세요";

// 배너 슬라이드 (이미지 없이 문구만. 이미지는 관리자에서 올린다)
export const BANNERS: { label: string; text: string }[] = [
  {
    label: "함께 성장하고 가치를 나누는 KPSC",
    text: "믿음과 신뢰로 성장하는|KPSC의 이야기를 전합니다.",
  },
  {
    label: "KPSC여행사",
    text: "함께 성장하고 가치를 나누는|아름다운 동행의 시작.",
  },
];

// 작성자 소개 (왼쪽 문구만. 카드는 작성자 컬렉션에서 온다)
export const doctorsTitle = (clinic: Pick<ClinicInfo, "name">) => `${clinic.name} 작성자 소개`;
export const DOCTORS_TEXT = "KPSC 운영진·필진이 |직접 이야기를 전합니다.";
export const DOCTORS_BUTTON = "작성자 소개";
export const DOCTORS_LINK = "/"; // KPSC 홈페이지

// 핵심 요약 (ABOUT)
export const SUMMARY_TITLE = "함께 성장하고 |가치를 나누는 KPSC";
export const summaryText = (clinic: Pick<ClinicInfo, "name" | "address">) =>
  `${clinic.name}는 믿음과 신뢰로 성장하는 성장형 브랜드로,\n나눔·여행·파트너십 등 다양한 이야기를 |웹블로그에서 함께 나눕니다.`;

// 장점 카드 4개 (WHY). 아이콘은 components/blog/home/StrengthsSection 에서 순서대로 붙는다.
export const KEY_POINTS: { title: string; text: string }[] = [
  { title: "함께 성장", text: "믿음과 신뢰를 바탕으로\n파트너와 함께 성장합니다." },
  { title: "나눔·사회공헌", text: "Save the Children 파트너로서\n나눔과 사회공헌을 실천합니다." },
  { title: "KPSC여행사", text: "KPSC의 또 다른 브랜드로\n아름다운 동행을 만들어갑니다." },
  { title: "파트너십", text: "여러 파트너와 협력하여\n더 나은 가치를 전합니다." },
];

// 자주 묻는 질문. 병원 정보(진료시간·전화)는 clinic 에서 가져온다.
export const faq = (clinic: Pick<ClinicInfo, "name" | "hours" | "parking" | "directions" | "phone">): FaqItem[] => [
  {
    question: `${clinic.name}는 어떤 곳인가요?`,
    answer: "믿음과 신뢰로 성장하는 성장형 브랜드로, 나눔·사회공헌과 KPSC여행사 등 다양한 활동을 이어가고 있습니다.",
  },
  {
    question: "운영시간은 어떻게 되나요?",
    answer: `${clinic.hours.map((h) => `${h.label} ${h.value}`).join(" / ")} 입니다.`,
  },
  {
    question: "문의·상담은 어떻게 하나요?",
    answer: `대표전화 ${clinic.phone} 또는 카카오톡 채널로 문의하실 수 있습니다.`,
  },
  {
    question: "블로그에는 어떤 글이 올라오나요?",
    answer: "KPSC 소식, 나눔·사회공헌 활동, 여행 이야기, 파트너십 등 KPSC가 전하는 다양한 이야기를 만나보실 수 있습니다.",
  },
];
