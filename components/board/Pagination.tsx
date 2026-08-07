/* ==========================================================================
   게시판 페이지네이션 (원본 getPageLink())
   원본 재현 포인트
   - 현재 페이지는 검정 배경(#1A1A1A) + 흰 글씨, 나머지는 #FAFAFA + 1px #CACACA
   - hover 시 테두리 #B2B2B2
   - 좌우 블록 이동 화살표 (원본 prev1/prev2/next1/next2.gif)
   ========================================================================== */

import Link from "next/link";

type PaginationProps = {
  /** 현재 페이지 (1부터) */
  current: number;
  /** 전체 페이지 수 */
  total: number;
  /** 페이지 링크 생성 함수 */
  href: (page: number) => string;
};

export default function Pagination({ current, total, href }: PaginationProps) {
  if (total <= 1) return null;

  const pages = Array.from({ length: total }, (_, i) => i + 1);

  /* 비활성 화살표 스타일 */
  const arrowClass =
    "flex h-[30px] w-[30px] items-center justify-center border border-[#CACACA] bg-[#FAFAFA] text-[12px] text-ink-500 transition-colors hover:border-[#B2B2B2]";

  return (
    <nav aria-label="페이지 이동" className="mt-10 flex justify-center gap-1">
      {/* 이전 블록 */}
      {current > 1 ? (
        <Link href={href(current - 1)} aria-label="이전 페이지" className={arrowClass}>
          ‹
        </Link>
      ) : (
        <span aria-hidden className={`${arrowClass} opacity-40`}>
          ‹
        </span>
      )}

      {/* 숫자 버튼 */}
      {pages.map((page) =>
        page === current ? (
          <span
            key={page}
            aria-current="page"
            className="flex h-[30px] w-[30px] items-center justify-center bg-[#1A1A1A] text-[12px] font-semibold text-white"
          >
            {page}
          </span>
        ) : (
          <Link
            key={page}
            href={href(page)}
            className="flex h-[30px] w-[30px] items-center justify-center border border-[#CACACA] bg-[#FAFAFA] text-[12px] text-ink-700 transition-colors hover:border-[#B2B2B2]"
          >
            {page}
          </Link>
        )
      )}

      {/* 다음 블록 */}
      {current < total ? (
        <Link href={href(current + 1)} aria-label="다음 페이지" className={arrowClass}>
          ›
        </Link>
      ) : (
        <span aria-hidden className={`${arrowClass} opacity-40`}>
          ›
        </span>
      )}
    </nav>
  );
}
