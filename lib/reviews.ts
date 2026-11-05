import type { NewsPost } from "@/lib/news";

/**
 * 고객후기 게시글 — 게시판 형태 확인용 샘플. 실제 후기는 관리자 페이지 연동 후 교체.
 * 오픈 전 반드시 샘플 삭제 (의료법상 환자 치료경험담 광고 주의 — docs/content-review/about-home.md)
 */
/** 후기 분류 (수술 항목별 목록 필터) */
export const REVIEW_CATEGORIES = ["시력교정", "백내장", "망막"] as const;

const REVIEWS: NewsPost[] = [
  {
    id: 3,
    title: "[샘플] 시력교정 수술 후기",
    category: "시력교정",
    date: "2026-10-20",
    views: 0,
    body: ["게시판 형태를 확인하기 위한 샘플 글입니다.", "실제 고객후기로 교체될 예정입니다."],
  },
  {
    id: 2,
    title: "[샘플] 백내장 수술 후기",
    category: "백내장",
    date: "2026-10-15",
    views: 0,
    body: ["게시판 형태를 확인하기 위한 샘플 글입니다.", "실제 고객후기로 교체될 예정입니다."],
  },
  {
    id: 1,
    title: "[샘플] 망막클리닉 보임 진료 후기",
    category: "망막",
    date: "2026-10-10",
    views: 0,
    body: ["게시판 형태를 확인하기 위한 샘플 글입니다.", "실제 고객후기로 교체될 예정입니다."],
  },
];

/** 최신순 후기 목록 */
export function getReviewList(): NewsPost[] {
  return [...REVIEWS].sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);
}

/** id로 후기 조회 */
export function getReview(id: number): NewsPost | undefined {
  return REVIEWS.find((p) => p.id === id);
}

/** 후기 게시판 안내 문구 */
export const REVIEW_NOTICE = "고객후기는 개인의 경험이며, 치료 결과는 개인에 따라 다를 수 있습니다.";
