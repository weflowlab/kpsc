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
  /** 대표 — 사람 */
  user: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  /** SNS 운영팀 — 확성기 */
  megaphone:
    "M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z",
  /** 경호팀 — 방패 체크 */
  shield:
    "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  /** CTA 버튼 화살표 */
  arrow: "M17 8l4 4m0 0l-4 4m4-4H3",
} as const;

/* --------------------------------------------------------------------------
   운영진 카드 데이터 — 원본 텍스트 그대로
   -------------------------------------------------------------------------- */
const TEAMS = [
  {
    no: "02",
    icon: ICON.megaphone,
    roleEn: "Operation Team",
    name: "운영진: SNS 운영팀",
    desc: "온라인 브랜드 커뮤니케이션 관리",
  },
  {
    no: "03",
    icon: ICON.shield,
    roleEn: "Security Team",
    name: "운영진: 경호팀 KPSM",
    desc: "자산 보호 및 전문 경호 서비스 운영",
  },
];

export default function TeamPage() {
  return (
    <SubLayout
      pathname="/organization/team"
      banner="organization"
    >
      {/* ================================================================
          1) 섹션 헤드 — 원본 .section-head (가운데, 인디고 라인)
          ================================================================ */}
      <Reveal className="mb-20 text-center">
        <h2 className="text-[30px] leading-9 font-extrabold tracking-[-0.025em] text-[#1e293b]">
          조직도 및 운영진 소개
        </h2>
        <span aria-hidden className="mx-auto mt-4 block h-[2px] w-12 bg-[#4f46e5]" />
      </Reveal>

      {/* ================================================================
          2) 대표 카드 — 단독 중앙 (원본 .representative-box max-w 28rem)
          ================================================================ */}
      <Reveal as="section" className="mb-24 flex justify-center">
        <div className="w-full max-w-md">
          <div className="offset-line rounded-3xl bg-white p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-2">
            {/* 우상단 번호 — 거의 안 보이는 #eef2ff */}
            <span className="serif-italic absolute top-6 right-8 text-[48px] leading-none text-[#eef2ff] select-none">
              01
            </span>

            {/* 세로 중앙 정렬 (원본 .center-column) */}
            <div className="flex flex-col items-center">
              {/* 원형 아이콘 — 인디고 배경, hover 시 반전 */}
              <span
                aria-hidden
                className="group mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#4f46e5] transition-colors duration-300 [.offset-line:hover_&]:bg-[#eef2ff] [.offset-line:hover_&]:text-[#4f46e5]"
              >
                <OutlineIcon
                  d={ICON.user}
                  className="h-8 w-8 text-white transition-colors duration-300 [.offset-line:hover_&]:text-[#4f46e5]"
                />
              </span>

              <span className="font-mont mb-2 text-[12px] font-semibold tracking-[0.1em] text-[#4f46e5] uppercase">
                Representative
              </span>
              <h3 className="text-[24px] leading-8 font-bold text-[#0f172a]">
                대표 이도영
              </h3>
              <p className="mt-3 text-[14px] font-light text-[#64748b]">
                KPSC의 총괄 및 비전을 이끕니다.
              </p>
            </div>
          </div>
        </div>
      </Reveal>

      {/* ================================================================
          3) 운영진 카드 2장 — 좌측 정렬 (원본 .team-grid max-w 64rem)
          ================================================================ */}
      <section className="mx-auto grid max-w-[64rem] grid-cols-1 gap-12 md:grid-cols-2 md:gap-20">
        {TEAMS.map((member, i) => (
          <Reveal key={member.no} delay={0.2 + i * 0.2}>
            <div className="offset-line h-full rounded-3xl bg-white p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-2">
              <span className="serif-italic absolute top-6 right-8 text-[48px] leading-none text-[#eef2ff] select-none">
                {member.no}
              </span>

              {/* 사각 라운드 아이콘 — 인디고 배경, hover 시 반전 */}
              <span
                aria-hidden
                className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#4f46e5] transition-colors duration-300 [.offset-line:hover_&]:bg-[#eef2ff]"
              >
                <OutlineIcon
                  d={member.icon}
                  className="h-6 w-6 text-white transition-colors duration-300 [.offset-line:hover_&]:text-[#4f46e5]"
                />
              </span>

              <p className="font-mont mb-2 text-[12px] font-semibold tracking-[0.1em] text-[#4f46e5] uppercase">
                {member.roleEn}
              </p>
              <h3 className="text-[20px] leading-7 font-bold text-[#0f172a]">
                {member.name}
              </h3>

              {/* 설명 — 앞에 1rem×1px 라인 (원본 .team-info) */}
              <div className="mt-6 flex items-center text-[14px] text-[#94a3b8]">
                <span aria-hidden className="mr-3 h-px w-4 bg-[#e2e8f0]" />
                {member.desc}
              </div>
            </div>
          </Reveal>
        ))}
      </section>

      {/* ================================================================
          4) 하단 CTA — 원본 .footer-box (#0f172a, 라운드 2.5rem)
          ================================================================ */}
      <Reveal as="section" className="mt-20 mb-10 md:mt-32 md:mb-24">
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
