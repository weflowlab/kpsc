import { MENU } from "@/lib/site";

/**
 * 임시 스톡 사진 (Pexels — 무료 상업 이용, 출처 표기 불필요).
 * 병원 사진을 받으면 public/images/stock/ 의 같은 파일명(.webp)으로 교체하거나, 아래 규칙을 지우면 플레이스홀더로 돌아간다.
 * 원장 사진·병원 시설·의학 설명 그림·지도·영상은 오해 소지가 있어 스톡을 쓰지 않는다 (규칙 없음 = 플레이스홀더 유지).
 */
/** 사진 키 → Pexels 원본 번호 (https://www.pexels.com/photo/{번호}/) */
export const STOCK_SOURCES = {
  "eye-green": "pexels 1925630",
  "eye-macro": "pexels 4121712",
  "eye-warm": "pexels 6153020",
  "eye-amber": "pexels 326536",
  "exam-slitlamp": "pexels 5752281",
  "exam-phoropter": "pexels 5752287",
  consult: "pexels 6749742",
  "consult-paper": "pexels 7578808",
  lobby: "pexels 8459996",
  corridor: "pexels 33812023",
  "surgery-team": "pexels 8089556",
  surgeon: "pexels 6291298",
  "senior-couple": "pexels 5637731",
  "senior-couple-2": "pexels 1653898",
  "senior-reading": "pexels 5231267",
  "young-woman": "pexels 4350178",
  "man-laptop": "pexels 5213054",
  "night-driving": "pexels 67088",
  "blue-abstract": "pexels 4871011",
  "blue-soft": "pexels 7135014",
} as const;

type StockKey = keyof typeof STOCK_SOURCES;

// 서브페이지 상단 배너: 대메뉴별 사진
const BANNER_BY_GROUP: Record<string, StockKey> = {
  about: "lobby",
  vision: "eye-green",
  cataract: "senior-couple-2",
  retina: "eye-macro",
  community: "consult",
  contact: "consult-paper",
};

// 플레이스홀더 라벨 → 사진 (위에서부터 먼저 맞는 규칙 적용)
const RULES: [RegExp, StockKey][] = [
  // 메인 비주얼 슬라이드 (썸네일 순서: 시력교정 · 백내장 · 망막 · 의료진)
  [/^메인 비주얼 1$/, "eye-green"],
  [/^메인 비주얼 2$/, "senior-couple-2"],
  [/^메인 비주얼 3$/, "exam-slitlamp"],
  [/^메인 비주얼 4$/, "consult"],
  // 메인 대표 치료 슬라이드
  [/^Smile 4 me$/, "young-woman"],
  [/^LASIK \/ LASEK$/, "man-laptop"],
  [/^프리미엄 백내장 수술$/, "senior-reading"],
  [/^레이저 백내장 수술$/, "surgeon"],
  [/^망막박리$/, "eye-macro"],
  [/^당뇨망막병증$/, "exam-slitlamp"],
  [/^황반변성$/, "senior-couple"],
  // 진료이념 페이지 대표 사진
  [/^진료이념 대표 이미지$/, "senior-couple"],
  // 띠 배경
  [/^진료시간 배경$/, "corridor"],
  [/^상담 안내 배경$/, "consult"],
  // 푸터 위 상담 띠: 상담 & 문의 탭 배너와 같은 사진
  [/^상담 문의 띠 배경$/, "consult-paper"],
  [/(진료이념|진료 철학) 배경$/, "blue-abstract"],
  [/백내장.*배경$/, "senior-reading"],
  [/(망막|BOIM|황반변성|당뇨|비문증|중심성|박리).*배경$/, "eye-warm"],
  // 메인 썸네일·진료과목 패널
  [/^시력교정$/, "young-woman"],
  [/^백내장$/, "senior-couple"],
  [/^망막클리닉 보임$/, "exam-slitlamp"],
  [/^의료진$/, "consult"],
  [/^시력교정 클리닉 대표 이미지/, "man-laptop"],
  [/^푸른 백내장 노안센터 대표 이미지/, "senior-couple-2"],
  [/^망막클리닉 보임 대표 이미지/, "exam-slitlamp"],
  // 검사·진료 장면
  // (메인 33가지 검사 카드 4장은 서로 다른 사진)
  [/^수술 전 정밀 검사/, "exam-phoropter"],
  [/^시력 · 굴절 검사$/, "exam-phoropter"],
  [/^각막 검사$/, "eye-green"],
  [/^안구 구조 · 기능 검사$/, "exam-slitlamp"],
  [/^망막 · 시신경 검사$/, "eye-macro"],
  [/^(망막 검사|비문증 안저검사)$/, "exam-slitlamp"],
  [/^수술 후 정기 검진$/, "consult"],
  [/^FACT CHECK 대표 이미지$/, "man-laptop"],
  // 진료과목 소개
  [/^Smile4me 1$/, "eye-green"],
  [/^Smile4me 2$/, "young-woman"],
  [/^푸른 백내장 노안센터 1$/, "senior-couple"],
  [/^푸른 백내장 노안센터 2$/, "senior-reading"],
  [/^프리미엄 백내장 수술이란\? 1$/, "senior-reading"],
  [/^프리미엄 백내장 수술이란\? 2$/, "night-driving"],
  [/^고난이도 백내장 수술$/, "surgery-team"],
  [/^레이저 백내장 경험 이미지$/, "surgeon"],
  // 망막 질환 소개 (분위기용 눈 사진)
  [/^(나이관련 황반변성|중심성 장액맥락망막병증|열공성 망막박리|비문증 \(날파리증 · 후유리체박리\)) 1$/, "eye-macro"],
  [/^(나이관련 황반변성|중심성 장액맥락망막병증|열공성 망막박리|비문증 \(날파리증 · 후유리체박리\)) 2$/, "eye-warm"],
];

/** 라벨에 맞는 스톡 사진 경로 (없으면 null → 플레이스홀더) */
export function stockFor(label: string): string | null {
  // "{메뉴명} 상단 배경" → 대메뉴별 배너 사진
  const banner = label.match(/^(.+) 상단 배경$/);
  if (banner) {
    const group = MENU.find((g) => g.pages.some((p) => p.label === banner[1]));
    return group ? `/images/stock/${BANNER_BY_GROUP[group.slug]}.webp` : null;
  }
  const rule = RULES.find(([re]) => re.test(label));
  return rule ? `/images/stock/${rule[1]}.webp` : null;
}
