/* ==========================================================================
   메인 - 고객지원 센터 (원본 .dae- 블록)
   원본 재현 포인트
   - 제목 "고객지원 센터" + 하단 장식 라인
   - 게시판 카드 2장: 1열 → 768px 이상 2열, gap 3rem
   - 카드 hover: 부양(-0.5rem) + 그림자 확대
   - 목록 항목은 1줄 말줄임(ellipsis), 날짜는 축소되지 않음(flex-shrink:0)
   ========================================================================== */

import Link from "next/link";
import Reveal from "@/components/common/Reveal";
import { BOARD_PREVIEWS } from "@/lib/content/main";

export default function CsSection() {
  return (
    <section id="cs" className="font-pretendard bg-section py-8 lg:py-20">
      <div className="container-mid">
        {/* ================================================================
            섹션 헤더
            ================================================================ */}
        <Reveal className="mb-10 text-center lg:mb-14">
          <h3 className="text-[24px] font-bold text-ink-900 lg:text-[30px]">
            고객지원 센터
          </h3>
          {/* 장식 라인 */}
          <span
            aria-hidden
            className="mx-auto mt-4 block h-[3px] w-12 rounded-full bg-ink-900"
          />
        </Reveal>

        {/* ================================================================
            게시판 카드 2열
            ================================================================ */}
        {/* min-w-0 — 그리드/플렉스 아이템의 기본 min-width:auto 를 풀어 준다.
            이게 없으면 아래 말줄임(truncate) 제목이 줄어들지 못하고 카드 밖으로
            삐져나가면서 페이지 전체에 가로 스크롤이 생긴다. */}
        <div className="grid gap-6 md:grid-cols-2 md:gap-8 lg:gap-12">
          {BOARD_PREVIEWS.map((board, i) => (
            <Reveal key={board.title} delay={i * 0.15} className="min-w-0">
              <div className="h-full min-w-0 rounded-[1.25rem] border border-ink-200 bg-white p-5 transition-all duration-[400ms] hover:-translate-y-2 hover:shadow-[0_20px_70px_-10px_rgba(15,23,42,0.15)] sm:p-6 lg:rounded-[1.5rem] lg:p-8">
                {/* 카드 헤더 — 제목 + 더보기 */}
                <div className="mb-5 flex items-center justify-between gap-3 border-b border-ink-100 pb-4">
                  <h4 className="min-w-0 truncate text-[17px] font-bold text-ink-800 sm:text-[18px] lg:text-[20px]">
                    {board.title}
                  </h4>
                  <Link
                    href={board.moreHref}
                    className="shrink-0 text-[13px] text-ink-400 transition-colors hover:text-ink-900"
                  >
                    더보기 +
                  </Link>
                </div>

                {/* 게시물 목록 */}
                <ul className="space-y-3">
                  {board.posts.map((post) => (
                    <li key={post.href} className="min-w-0">
                      <Link
                        href={post.href}
                        className="group flex items-center justify-between gap-3 sm:gap-4"
                      >
                        <span className="min-w-0 flex-1 truncate text-[14px] text-ink-900 transition-colors group-hover:text-brand-600 lg:text-[15px]">
                          {post.title}
                        </span>
                        <span className="shrink-0 text-[12px] text-ink-400">
                          {post.date}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
