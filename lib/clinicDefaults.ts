// 글 하단 문구(안내 상자, 문의 블록)의 기본값 단일 출처. 쓰임새는 lib/homeDefaults.ts 와 같다.
// 관리자 '브랜드 정보' 메뉴를 없앴으므로 이 값이 곧 화면 문구다. 바꾸려면 이 파일을 고친다.
// "|" 는 모바일에서만 줄바꿈(components/blog/ui/MobileBreaks), "\n" 은 모든 화면에서 줄바꿈.

// 글 하단 안내 상자: 비워 두면 상자가 보이지 않는다
export const DISCLAIMER_TEXT = "";

export const CTA_TITLE = "KPSC에 궁금한 점이 있으신가요?";
export const ctaText = (clinicName: string) =>
  `나눔·여행·파트너십 등 궁금한 내용은|카카오톡 채널로 편하게 문의해 주세요.\n${clinicName}가 정성껏 안내해 드리겠습니다.`;
