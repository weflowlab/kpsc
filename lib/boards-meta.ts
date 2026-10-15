/* ==========================================================================
   게시판 메타 정보 — 게시판 3종의 고정 설정 (클라이언트에서도 import 가능)
   게시글 데이터는 DB(posts 테이블)에 있고, 조회는 lib/boards.ts 가 담당한다.
   원본 관리자(bod_manager.php)의 게시판 구성: notice / activities / gallery
   ========================================================================== */

export type BoardKey = "notice" | "activities" | "gallery";

/** 회원 등급 (prisma MemberGrade 와 동일 — 클라이언트 번들에 prisma 타입을
    끌고 오지 않으려고 문자열 리터럴로 중복 정의한다) */
export type Grade = "NORMAL" | "VIP" | "VVIP" | "ADMIN";

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
  /** (하위호환) 일반 회원 글쓰기 허용 여부 — 갤러리에서 사용. */
  writable: boolean;
  /** 게시판 단위 글쓰기 허용 등급 (공지=ADMIN, 갤러리=전 등급).
      읽기는 등급과 무관하게 누구나(비회원 포함) 가능하다. */
  writeGrades: Grade[];
  /** 카테고리(말머리)별 글쓰기·댓글 허용 등급.
      "고객의 소리"처럼 한 게시판 안에서 카테고리로 등급 권한을 나눌 때 사용한다.
      지정되면 writeGrades 대신 이 맵이 우선한다. */
  categoryGrades?: Record<string, Grade[]>;
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
    ],
    perPage: 15,
    writable: false,
    writeGrades: ["ADMIN"], // 공지사항은 최고관리자만 게시 가능
    comments: false,
  },
  activities: {
    key: "activities",
    name: "고객의 소리",
    description:
      "등급별 소통 게시판입니다. 열람은 누구나 가능하며, 글쓰기·댓글은 카테고리(등급)별로 권한이 다릅니다.",
    categories: ["일반·VIP", "VVIP·최고관리자"],
    perPage: 15,
    writable: true,
    writeGrades: ["NORMAL", "VIP", "VVIP", "ADMIN"], // 카테고리별 세부 권한은 categoryGrades 로 판정
    categoryGrades: {
      // 계층형 권한 — 상위 등급은 하위 카테고리에도 글·댓글 작성 가능
      "일반·VIP": ["NORMAL", "VIP", "VVIP", "ADMIN"],
      "VVIP·최고관리자": ["VVIP", "ADMIN"],
    },
    comments: true,
  },
  gallery: {
    key: "gallery",
    name: "갤러리",
    description: "KPSC 갤러리",
    categories: ["행사갤러리"],
    perPage: 16,
    writable: true,
    writeGrades: ["NORMAL", "VIP", "VVIP", "ADMIN"],
    comments: false,
  },
};

export function getBoardMeta(key: string): BoardMeta | undefined {
  return BOARD_META[key as BoardKey];
}

/* --------------------------------------------------------------------------
   등급별 "새 글/댓글 작성" 권한 판정 — 읽기는 항상 공개이므로 작성에만 쓴다.
     · categoryGrades 가 있는 게시판(고객의 소리)은 카테고리(말머리)별로 판정 (계층형)
       - 일반·VIP 카테고리      : NORMAL, VIP, VVIP, ADMIN (상위 등급도 작성 가능)
       - VVIP·최고관리자 카테고리 : VVIP, ADMIN
     · 그 외 게시판은 writeGrades 로 게시판 단위 판정 (공지=ADMIN, 갤러리=전 등급)
   ※ 남의 글 수정/삭제 같은 모더레이션은 각 액션에서 isAdmin 으로 따로 허용한다.
   -------------------------------------------------------------------------- */

/** 특정 카테고리에 글/댓글을 쓸 수 있는 등급 목록 */
function gradesForCategory(meta: BoardMeta, category: string): Grade[] {
  return meta.categoryGrades?.[category] ?? meta.writeGrades;
}

/** 이 등급이 해당 게시판·카테고리에 새 글/댓글을 쓸 수 있는가 */
export function canWriteCategory(
  grade: Grade | null | undefined,
  key: string,
  category: string
): boolean {
  if (!grade) return false;
  const meta = getBoardMeta(key);
  if (!meta) return false;
  return gradesForCategory(meta, category).includes(grade);
}

/** 이 등급이 해당 게시판에서 쓸 수 있는 카테고리 목록 (글쓰기 폼의 말머리 선택지) */
export function writableCategories(
  grade: Grade | null | undefined,
  key: string
): string[] {
  if (!grade) return [];
  const meta = getBoardMeta(key);
  if (!meta) return [];
  return meta.categories.filter((c) => gradesForCategory(meta, c).includes(grade));
}

/** 이 등급이 해당 게시판에 (어느 카테고리든) 글을 쓸 수 있는가 — 글쓰기 버튼 노출용 */
export function canWriteAnyCategory(
  grade: Grade | null | undefined,
  key: string
): boolean {
  return writableCategories(grade, key).length > 0;
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
