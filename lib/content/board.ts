/* ==========================================================================
   게시판 콘텐츠 데이터 — 고객의 소리(activities) / 공지사항·뉴스(notice)
   원본 bbs.php 리스트의 제목·날짜·작성자·조회수를 그대로 옮겼다.
   ========================================================================== */

/* --------------------------------------------------------------------------
   타입 정의
   -------------------------------------------------------------------------- */
export type BoardPost = {
  /** 리스트에 표시되는 글 번호 */
  no: number;
  /** 상세 라우트에 쓰이는 원본 uid */
  uid: number;
  /** 말머리 카테고리 */
  category: string;
  title: string;
  /** 원본 표기 그대로 (yy.mm.dd) */
  date: string;
  author: string;
  hit: number;
  /** 상세 본문 (수집된 글만 채워짐) */
  content?: string[];
};

export type BoardConfig = {
  /** 라우트 키 */
  key: "activities" | "notice";
  /** 게시판 이름 */
  name: string;
  /** 서브 비주얼에 노출되는 대메뉴명 */
  groupLabel: string;
  /** 페이지 설명 (meta description) */
  description: string;
  /** 상단 카테고리 탭 */
  categories: string[];
  /** 페이지당 게시물 수 */
  perPage: number;
  /** 글쓰기 버튼 노출 여부 (원본: activities만 노출) */
  writable: boolean;
  /** 댓글 기능 사용 여부 (원본: activities 스킨만 사용) */
  comments: boolean;
  posts: BoardPost[];
};

/* --------------------------------------------------------------------------
   검색 셀렉트 옵션 — 두 게시판 공통
   -------------------------------------------------------------------------- */
export const SEARCH_OPTIONS = [
  { value: "ALL", label: "전체에서" },
  { value: "BB_SUBJECT", label: "제목" },
  { value: "BB_CONTENT", label: "본문" },
  { value: "BB_NAME", label: "작성자" },
  { value: "BB_MB_ID", label: "아이디" },
] as const;

/* --------------------------------------------------------------------------
   고객의 소리 (activities) — 총 1건
   -------------------------------------------------------------------------- */
export const ACTIVITIES: BoardConfig = {
  key: "activities",
  name: "고객의 소리",
  groupLabel: "활동 및 소식",
  description: "고객 문의 및 자유수다게시판입니다",
  categories: ["전체", "고객문의", "수다게시판"],
  perPage: 15,
  writable: true,
  comments: true,
  posts: [
    {
      no: 1,
      uid: 6,
      category: "수다게시판",
      title: "고객의 소리 [KPSC활동] 게시판 이용안내",
      date: "26.06.20",
      author: "KPSC",
      hit: 7,
      content: [
        "안녕하세요.",
        "KPSC SNS운영팀입니다.",
        "",
        "고객의 소리 [KPSC활동] 게시판은 누구나 이용가능한 게시판입니다.",
        "",
        "이용 시 서로 간의 예절을 지켜주세요.",
      ],
    },
  ],
};

/* --------------------------------------------------------------------------
   공지사항 / 뉴스 (notice) — 총 23건, 페이지당 15건
   -------------------------------------------------------------------------- */
export const NOTICE: BoardConfig = {
  key: "notice",
  name: "공지사항 / 뉴스",
  groupLabel: "활동 및 소식",
  description:
    "공지사항 메뉴를 통해 이벤트, 업데이트 등 중요한 정보를 쉽게 전달해 드립니다.",
  categories: [
    "전체",
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
  comments: false,
  posts: [
    {
      no: 23,
      uid: 59,
      category: "전체공지",
      title: "KPSC 운영시간 안내",
      date: "26.07.07",
      author: "KPSC",
      hit: 8,
      content: [
        "KPSC 운영시간 안내",
        "",
        "안녕하세요.",
        "KPSC입니다.",
        "저희 운영시간에 변동이 있어 공지합니다.",
        "",
        "홈페이지&각 SNS채널",
        "화 ~ 토 AM 09:00 ~ PM 06:00",
        "점심 AM 11:30 ~ PM 02:00",
        "*일요일,월요일/공휴일 휴무*",
        "",
        "항상 KPSC를 이용해주셔서",
        "감사합니다.",
        "",
        "- KPSC -",
      ],
    },
    { no: 22, uid: 58, category: "전체공지", title: "KPSC그룹브랜드 안내", date: "26.07.02", author: "관리자", hit: 3 },
    { no: 21, uid: 57, category: "다운로드 파일 및 신청서", title: "KPSCkorea서포터즈 신청서", date: "26.06.25", author: "KPSC", hit: 16 },
    { no: 20, uid: 56, category: "전체공지", title: "다운로드 가능한 파일 및 신청서 작성관련안내", date: "26.06.24", author: "KPSC", hit: 3 },
    { no: 19, uid: 55, category: "다운로드 파일 및 신청서", title: "KPSC 파트너사와 함께하는 공동프로젝트 참여 신청서", date: "26.06.24", author: "KPSC", hit: 3 },
    { no: 18, uid: 53, category: "전체공지", title: "(주)사이트하우스 업체 안내", date: "26.06.04", author: "KPSC", hit: 9 },
    { no: 17, uid: 52, category: "전체공지", title: "긴급상황조치 절차에 따른 상황대응안내", date: "26.06.02", author: "KPSC", hit: 5 },
    { no: 16, uid: 51, category: "SNS 관련공지", title: "긴급 전체공지", date: "26.05.21", author: "KPSC", hit: 14 },
    { no: 15, uid: 50, category: "전체공지", title: "KPSC전화 변경안내", date: "26.05.15", author: "KPSC", hit: 8 },
    { no: 14, uid: 49, category: "운영진별 공지", title: "회원가입 기능 활성화까지 기다려주셔서 진심으로 감사드립니다...", date: "26.05.14", author: "KPSC", hit: 10 },
    { no: 13, uid: 48, category: "일반공지", title: "KPSC 공지사항 안내", date: "26.05.13", author: "KPSC", hit: 4 },
    { no: 12, uid: 47, category: "홈페이지 관련공지", title: "KPSC그룹 공식홈페이지 회원등급안내", date: "26.05.07", author: "KPSC", hit: 14 },
    { no: 11, uid: 46, category: "운영진별 공지", title: "KPSC그룹 공식홈페이지 회원정보 변경관련안내", date: "26.05.06", author: "KPSC", hit: 19 },
    { no: 10, uid: 43, category: "홈페이지 관련공지", title: "홈페이지 회원가입 기능까지 정상운영", date: "26.05.03", author: "KPSC", hit: 11 },
    { no: 9, uid: 42, category: "홈페이지 관련공지", title: "KPSC그룹 홈페이지관련사항 안내", date: "26.04.29", author: "KPSC", hit: 13 },
    { no: 8, uid: 39, category: "운영진별 공지", title: "KPSC그룹 관리운영진 임명안내", date: "26.04.23", author: "KPSC", hit: 12 },
    { no: 7, uid: 37, category: "홈페이지 관련공지", title: "홈페이지 문의 및 자유수다방 안내", date: "26.04.23", author: "KPSC", hit: 7 },
    { no: 6, uid: 36, category: "운영진별 공지", title: "KPSC그룹 관리운영진 임명안내", date: "26.04.22", author: "KPSC", hit: 10 },
    { no: 5, uid: 35, category: "중요공지", title: "보안관련안내", date: "26.04.21", author: "KPSC", hit: 9 },
    { no: 4, uid: 33, category: "일반공지", title: "KPSC 부속 브랜드 KPSC협동조합 소개", date: "26.04.16", author: "KPSC", hit: 14 },
    { no: 3, uid: 31, category: "운영진별 공지", title: "블랙리스트 관리방법", date: "26.04.16", author: "KPSC", hit: 16 },
    { no: 2, uid: 29, category: "운영진별 공지", title: "저희 KPSC그룹과 협력파트너가 되어주셔서 진심으로 감사드립니다...", date: "26.04.14", author: "KPSC", hit: 17 },
    { no: 1, uid: 28, category: "홈페이지 관련공지", title: "홈페이지 오픈", date: "26.04.14", author: "KPSC", hit: 14 },
  ],
};

/* --------------------------------------------------------------------------
   조회 헬퍼
   -------------------------------------------------------------------------- */
export const BOARDS = { activities: ACTIVITIES, notice: NOTICE } as const;

export function getBoard(key: string): BoardConfig | undefined {
  return BOARDS[key as keyof typeof BOARDS];
}
