/* ==========================================================================
   게시판 페이지네이션 (원본 getPageLink() + bbs/lib/module/page/page.css)
   원본 재현 포인트
   - 좌우 화살표는 원본 gif 그대로 (34×34):
     prev1/next1 = 비활성, prev2/next2 = 활성(블록 이동)
   - 항목 사이 3px 간격 (원본 cutln.gif 스페이서)
   - 숫자: 현재 페이지 .page_link_1 (#1A1A1A 박스 + 흰 볼드),
     나머지 .page_link (#FAFAFA + 1px #CACACA, hover 시 #B2B2B2 배경 + 흰 글자)
   - 원본은 1페이지뿐이어도 항상 노출한다
   ========================================================================== */

import Link from "next/link";
import Image from "next/image";

type PaginationProps = {
  /** 현재 페이지 (1부터) */
  current: number;
  /** 전체 페이지 수 */
  total: number;
  /** 페이지 링크 생성 함수 */
  href: (page: number) => string;
};

/* 3px 스페이서 — 원본 cutln.gif */
function Gap() {
  return <span aria-hidden className="w-[3px] shrink-0" />;
}

export default function Pagination({ current, total, href }: PaginationProps) {
  const pages = Array.from({ length: Math.max(1, total) }, (_, i) => i + 1);

  return (
    <nav aria-label="페이지 이동" className="mt-5 text-center">
      <div className="inline-flex items-center">
        {/* 이전 블록 화살표 */}
        {current > 1 ? (
          <Link href={href(current - 1)} aria-label="이전 페이지">
            <Image src="/images/board/prev2.gif" alt="" width={34} height={34} unoptimized />
          </Link>
        ) : (
          <Image src="/images/board/prev1.gif" alt="이전 없음" width={34} height={34} unoptimized />
        )}
        <Gap />

        {/* 숫자 버튼 */}
        {pages.map((page) => (
          <span key={page} className="inline-flex items-center">
            {page === current ? (
              <span
                aria-current="page"
                className="flex h-[34px] items-center border border-[#1A1A1A] bg-[#1A1A1A] px-3 text-[13px] font-bold text-white"
              >
                {page}
              </span>
            ) : (
              <Link
                href={href(page)}
                className="flex h-[34px] items-center border border-[#CACACA] bg-[#FAFAFA] px-3 text-[13px] text-[#1A1A1A] transition-colors hover:border-[#B2B2B2] hover:bg-[#B2B2B2] hover:font-bold hover:text-white"
              >
                {page}
              </Link>
            )}
            <Gap />
          </span>
        ))}

        {/* 다음 블록 화살표 */}
        {current < total ? (
          <Link href={href(current + 1)} aria-label="다음 페이지">
            <Image src="/images/board/next2.gif" alt="" width={34} height={34} unoptimized />
          </Link>
        ) : (
          <Image src="/images/board/next1.gif" alt="다음 없음" width={34} height={34} unoptimized />
        )}
      </div>
    </nav>
  );
}
