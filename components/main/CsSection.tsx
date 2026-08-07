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
    <section id="cs" className="bg-section py-8 lg:py-20">
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
            className="mx-auto mt-4 block h-[3px] w-12 rounded-full bg-brand-600"
          />
        </Reveal>

        {/* ================================================================
            게시판 카드 2열
            ================================================================ */}
        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          {BOARD_PREVIEWS.map((board, i) => (
            <Reveal key={board.title} delay={i * 0.15}>
              <div className="h-full rounded-[1.5rem] border border-ink-200 bg-white p-6 transition-all duration-[400ms] hover:-translate-y-2 hover:shadow-[0_20px_70px_-10px_rgba(15,23,42,0.15)] lg:p-8">
                {/* 카드 헤더 — 제목 + 더보기 */}
                <div className="mb-5 flex items-center justify-between border-b border-ink-100 pb-4">
                  <h4 className="text-[18px] font-bold text-ink-800 lg:text-[20px]">
                    {board.title}
                  </h4>
                  <Link
                    href={board.moreHref}
                    className="text-[13px] text-ink-400 transition-colors hover:text-ink-900"
                  >
                    더보기 +
                  </Link>
                </div>

                {/* 게시물 목록 */}
                <ul className="space-y-3">
                  {board.posts.map((post) => (
                    <li key={post.href}>
                      <Link
                        href={post.href}
                        className="group flex items-center justify-between gap-4"
                      >
                        <span className="truncate text-[14px] text-ink-500 transition-colors group-hover:text-ink-900 lg:text-[15px]">
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
