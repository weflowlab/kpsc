/* ==========================================================================
   조직 구성 > 운영진 소개  (원본 /team.php?pg=31)
   구성 — 원본 인라인 CSS 수치를 그대로 반영
     1) 섹션 헤드 — 가운데 제목 + 3rem×2px 인디고 라인
     2) 대표 카드 — 단독 중앙(max-w 28rem), 세로 중앙 정렬 콘텐츠
     3) 운영진 카드 2장 — 좌측 정렬 (max-w 64rem, gap 3/5rem)
     4) 하단 CTA — #0f172a 박스 + 우하단 KPSC 세리프 워터마크
   카드 공통: 흰 배경 + 12px 오프셋 프레임(.offset-line), hover 시 카드는
   -0.5rem 부상하고 프레임은 우하단으로 4px 더 벌어진다.
   아이콘은 원본과 동일한 Heroicons outline (stroke 1) SVG.
   ========================================================================== */

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SubLayout from "@/components/sub/SubLayout";
import Reveal from "@/components/common/Reveal";

export const metadata: Metadata = { title: "운영진 소개" };

/* --------------------------------------------------------------------------
   원본 SVG 아이콘 (Heroicons outline, viewBox 24, strokeWidth 1)
   -------------------------------------------------------------------------- */
function OutlineIcon({
  d,
  className = "",
  strokeWidth = 1,
}: {
  d: string;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d={d}
      />
    </svg>
  );
}

const ICON = {
  /** CTA 버튼 화살표 */
  arrow: "M17 8l4 4m0 0l-4 4m4-4H3",
} as const;

export default function TeamPage() {
  return (
    <SubLayout
      pathname="/organization/team"
      banner="organization"
    >
      {/* ================================================================
          1) 섹션 헤드 — 원본 .section-head (가운데, 인디고 라인)
          ================================================================ */}
      <Reveal className="mb-[4.5rem] text-center">
        <h2 className="text-[30px] leading-9 font-extrabold tracking-[-0.025em] text-[#1e293b]">
          조직도 및 운영진 소개
        </h2>
        <span aria-hidden className="mx-auto mt-4 block h-[2px] w-12 bg-[#4f46e5]" />
      </Reveal>

      {/* ================================================================
          2) 조직도 이미지 — 대표/운영진 카드 대신 조직도 한 장으로 표시
          ================================================================ */}
      <Reveal as="section" className="mx-auto max-w-[64rem]">
        <Image
          src="/images/content/org-chart.webp"
          alt="KPSC 조직도"
          width={1536}
          height={1024}
          sizes="(max-width: 1024px) 100vw, 64rem"
          className="h-auto w-full"
          priority
        />
      </Reveal>

      {/* ================================================================
          4) 하단 CTA — 원본 .footer-box (#0f172a, 라운드 2.5rem)
          ================================================================ */}
      <Reveal as="section" className="mt-[4.5rem] mb-10 md:mb-24">
        <div className="group relative overflow-hidden rounded-[2.5rem] bg-[#0f172a] p-12 md:p-20">
          {/* 우하단 KPSC 세리프 워터마크 — hover 시 1.1배 확대 (0.7s) */}
          <span
            aria-hidden
            className="serif-italic pointer-events-none absolute -right-10 -bottom-10 text-[15rem] leading-none text-white/5 transition-transform duration-700 select-none group-hover:scale-110"
          >
            KPSC
          </span>

          <div className="relative z-10 flex flex-col items-center justify-between md:flex-row">
            <div className="mb-10 text-center md:mb-0 md:text-left">
              <h2 className="mb-4 text-[30px] leading-[1.25] font-bold text-white md:text-[36px]">
                함께 만드는 미래, 지금 시작하세요.
              </h2>
              <p className="font-light text-[#94a3b8]">
                KPSC는 언제나 여러분의 제안과 참여를 기다립니다.
              </p>
            </div>

            <Link
              href="/news/activities"
              className="inline-flex shrink-0 items-center rounded-full bg-[#4f46e5] px-10 py-5 font-semibold text-white transition-all duration-300 hover:bg-[#6366f1] hover:shadow-[0_15px_30px_rgba(99,102,241,0.4)]"
            >
              KPSC 활동
              <OutlineIcon d={ICON.arrow} strokeWidth={2} className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </Reveal>
    </SubLayout>
  );
}
