/* ==========================================================================
   게시판 메타 정보 — 게시판 3종의 고정 설정 (클라이언트에서도 import 가능)
   게시글 데이터는 DB(posts 테이블)에 있고, 조회는 lib/boards.ts 가 담당한다.
   원본 관리자(bod_manager.php)의 게시판 구성: notice / activities / gallery
   ========================================================================== */

export type BoardKey = "notice" | "activities" | "gallery";

export type BoardMeta = {
  key: BoardKey;
  /** 게시판 이름 */
  name: string;
  /** 페이지 설명 (meta description) */
  description: string;
  /** 상단 카테고리 탭 — "전체" 제외한 실제 말머리 */
  categories: string[];
  /** 페이지당 게시물 수 */
  perPage: number;
  /** 일반 회원 글쓰기 허용 여부 (원본: activities/gallery 만) */
  writable: boolean;
  /** 댓글 기능 (원본: activities 스킨만) */
  comments: boolean;
};

export const BOARD_META: Record<BoardKey, BoardMeta> = {
  notice: {
    key: "notice",
    name: "공지사항 / 뉴스",
    description:
      "공지사항 메뉴를 통해 이벤트, 업데이트 등 중요한 정보를 쉽게 전달해 드립니다.",
    categories: [
      "전체공지",
      "운영진별 공지",
      "중요공지",
      "일반공지",
      "홈페이지 관련공지",
      "SNS 관련공지",
      "신청서",
      "다운로드 파일 및 신청서",
    ],
    perPage: 15,
    writable: false,
    comments: false,
  },
  activities: {
    key: "activities",
    name: "고객의 소리",
    description: "고객 문의 및 자유수다게시판입니다",
    categories: ["고객문의", "수다게시판"],
    perPage: 15,
    writable: true,
    comments: true,
  },
  gallery: {
    key: "gallery",
    name: "갤러리",
    description: "KPSC 갤러리",
    categories: ["미술갤러리", "행사갤러리"],
    perPage: 16,
    writable: true,
    comments: false,
  },
};

export function getBoardMeta(key: string): BoardMeta | undefined {
  return BOARD_META[key as BoardKey];
}

/** 목록 행 — 기존 하드코딩 BoardPost 형태를 승계 (클라이언트 컴포넌트 공용) */
export type BoardRow = {
  /** 리스트 표시용 번호 (전체 중 역순) */
  no: number;
  /** 상세 라우트 id (원본 uid 승계) */
  uid: number;
  category: string;
  title: string;
  /** "yy.mm.dd" */
  date: string;
  author: string;
  hit: number;
  thumbUrl?: string | null;
  /** 비밀글 여부 */
  secret?: boolean;
  /** 작성자 회원 id (비밀글 열람 판정용) */
  memberId?: number | null;
};

/** 검색 셀렉트 옵션 — 원본 bbs.php 값 그대로 */
export const SEARCH_OPTIONS = [
  { value: "ALL", label: "전체에서" },
  { value: "BB_SUBJECT", label: "제목" },
  { value: "BB_CONTENT", label: "본문" },
  { value: "BB_NAME", label: "작성자" },
  { value: "BB_MB_ID", label: "아이디" },
] as const;

/** DB Date(UTC 저장) → 원본 리스트 표기 "yy.mm.dd" (KST 기준) */
export function formatBoardDate(d: Date): string {
  const kst = new Date(d.getTime() + 9 * 60 * 60 * 1000);
  const yy = String(kst.getUTCFullYear()).slice(2);
  const mm = String(kst.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(kst.getUTCDate()).padStart(2, "0");
  return `${yy}.${mm}.${dd}`;
}
