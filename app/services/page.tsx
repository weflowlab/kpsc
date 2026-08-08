/* ==========================================================================
   사업 및 서비스 > 제공 서비스  (원본 /services.php?pg=41)
   구성 — 원본 인라인 CSS 수치를 그대로 반영
     1) 히어로 — Onboarding 배지 + 2줄 제목 + 64×4px 검정 구분선 (max-w 64rem)
     2) 가입 프로세스 카드 5장 — 세로 스택 (.glow-card):
        남색 아이콘 박스(hover 반전) + 우하단 대형 번호 워터마크(opacity 0.03)
     3) 하단 CTA — 그라데이션 1px 링 안의 #0f172a 필 버튼 (좌측 정렬)
   아이콘은 원본과 동일한 Phosphor light SVG.
   ========================================================================== */

import type { Metadata } from "next";
import Link from "next/link";
import SubLayout from "@/components/sub/SubLayout";
import Reveal from "@/components/common/Reveal";

export const metadata: Metadata = { title: "제공 서비스" };

/* --------------------------------------------------------------------------
   Phosphor light 아이콘 (viewBox 256) — 원본 CDN 아이콘과 동일 패스
   -------------------------------------------------------------------------- */
function PhIcon({ d, className = "" }: { d: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 256" fill="currentColor" aria-hidden>
      <path d={d} />
    </svg>
  );
}

const PH = {
  globe:
    "M128,26A102,102,0,1,0,230,128,102.12,102.12,0,0,0,128,26Zm81.57,64H169.19a132.58,132.58,0,0,0-25.73-50.67A90.29,90.29,0,0,1,209.57,90ZM218,128a89.7,89.7,0,0,1-3.83,26H171.81a155.43,155.43,0,0,0,0-52h42.36A89.7,89.7,0,0,1,218,128Zm-90,87.83a110,110,0,0,1-15.19-19.45A124.24,124.24,0,0,1,99.35,166h57.3a124.24,124.24,0,0,1-13.46,30.38A110,110,0,0,1,128,215.83ZM96.45,154a139.18,139.18,0,0,1,0-52h63.1a139.18,139.18,0,0,1,0,52ZM38,128a89.7,89.7,0,0,1,3.83-26H84.19a155.43,155.43,0,0,0,0,52H41.83A89.7,89.7,0,0,1,38,128Zm90-87.83a110,110,0,0,1,15.19,19.45A124.24,124.24,0,0,1,156.65,90H99.35a124.24,124.24,0,0,1,13.46-30.38A110,110,0,0,1,128,40.17Zm-15.46-.84A132.58,132.58,0,0,0,86.81,90H46.43A90.29,90.29,0,0,1,112.54,39.33ZM46.43,166H86.81a132.58,132.58,0,0,0,25.73,50.67A90.29,90.29,0,0,1,46.43,166Zm97,50.67A132.58,132.58,0,0,0,169.19,166h40.38A90.29,90.29,0,0,1,143.46,216.67Z",
  userPlus:
    "M254,136a6,6,0,0,1-6,6H230v18a6,6,0,0,1-12,0V142H200a6,6,0,0,1,0-12h18V112a6,6,0,0,1,12,0v18h18A6,6,0,0,1,254,136Zm-57.41,60.14a6,6,0,1,1-9.18,7.72C166.9,179.45,138.69,166,108,166s-58.89,13.45-79.41,37.86a6,6,0,0,1-9.18-7.72C35.14,177.41,55,164.48,77,158.25a66,66,0,1,1,62,0C161,164.48,180.86,177.41,196.59,196.14ZM108,154a54,54,0,1,0-54-54A54.06,54.06,0,0,0,108,154Z",
  fileText:
    "M212.24,83.76l-56-56A6,6,0,0,0,152,26H56A14,14,0,0,0,42,40V216a14,14,0,0,0,14,14H200a14,14,0,0,0,14-14V88A6,6,0,0,0,212.24,83.76ZM158,46.48,193.52,82H158ZM200,218H56a2,2,0,0,1-2-2V40a2,2,0,0,1,2-2h90V88a6,6,0,0,0,6,6h50V216A2,2,0,0,1,200,218Zm-34-82a6,6,0,0,1-6,6H96a6,6,0,0,1,0-12h64A6,6,0,0,1,166,136Zm0,32a6,6,0,0,1-6,6H96a6,6,0,0,1,0-12h64A6,6,0,0,1,166,168Z",
  notePencil:
    "M228.24,59.76l-32-32a6,6,0,0,0-8.48,0l-96,96A6,6,0,0,0,90,128v32a6,6,0,0,0,6,6h32a6,6,0,0,0,4.24-1.76l96-96A6,6,0,0,0,228.24,59.76ZM125.51,154H102V130.49l66-66L191.51,88ZM200,79.51,176.49,56,192,40.49,215.51,64ZM222,128v80a14,14,0,0,1-14,14H48a14,14,0,0,1-14-14V48A14,14,0,0,1,48,34h80a6,6,0,0,1,0,12H48a2,2,0,0,0-2,2V208a2,2,0,0,0,2,2H208a2,2,0,0,0,2-2V128a6,6,0,0,1,12,0Z",
  paperPlane:
    "M230.88,115.69l-168-95.88a14,14,0,0,0-20,16.87L73.66,128,42.81,219.33A14,14,0,0,0,56,238a14.15,14.15,0,0,0,6.93-1.83L230.84,140.1a14,14,0,0,0,0-24.41Zm-5.95,14L57,225.73a2,2,0,0,1-2.86-2.42.42.42,0,0,0,0-.1L84.3,134H144a6,6,0,0,0,0-12H84.3L54.17,32.8a.3.3,0,0,0,0-.1,1.87,1.87,0,0,1,.6-2.2A1.85,1.85,0,0,1,57,30.25l168,95.89a1.93,1.93,0,0,1,1,1.74A2,2,0,0,1,224.93,129.66Z",
  arrowRight:
    "M220.24,132.24l-72,72a6,6,0,0,1-8.48-8.48L201.51,134H40a6,6,0,0,1,0-12H201.51L139.76,60.24a6,6,0,0,1,8.48-8.48l72,72A6,6,0,0,1,220.24,132.24Z",
} as const;

/* --------------------------------------------------------------------------
   가입 절차 5단계 — 원본 텍스트 그대로 (아이콘: ph-globe/user-plus/file-text/
   note-pencil/paper-plane-right)
   -------------------------------------------------------------------------- */
const STEPS = [
  {
    no: "01",
    icon: PH.globe,
    title: "홈페이지 접속",
    desc: "KPSC공식 웹사이트에 방문하여 최신 정보를 확인하세요.",
  },
  {
    no: "02",
    icon: PH.userPlus,
    title: "회원가입 이동",
    desc: "상단 메뉴의 '회원가입' 버튼을 클릭하여 가입 페이지로 이동합니다.",
  },
  {
    no: "03",
    icon: PH.fileText,
    title: "약관 동의",
    desc: "안전한 서비스 이용을 위해 이용약관 및 개인정보 정책에 동의합니다.",
  },
  {
    no: "04",
    icon: PH.notePencil,
    title: "정보 입력",
    desc: "이름, 연락처 등 가입에 필요한 필수 정보를 정확히 입력합니다.",
  },
  {
    no: "05",
    icon: PH.paperPlane,
    title: "가입 완료",
    desc: "'가입하기' 버튼을 눌러 모든 절차를 마무리하고 회원이 됩니다.",
  },
];

export default function ServicesPage() {
  return (
    <SubLayout
      pathname="/services"
      banner="services"
    >
      {/* ================================================================
          1) 히어로 — 원본 .kpsc-hero (max-w 64rem, 좌측 정렬)
          ================================================================ */}
      <Reveal as="section" className="mx-auto max-w-[64rem]">
        {/* Onboarding 배지 — bg #f1f5f9, #64748b, 라운드 4px */}
        <span className="font-mont inline-block rounded bg-[#f1f5f9] px-3 py-1 text-[12px] font-extrabold tracking-[0.1em] text-[#64748b] uppercase">
          Onboarding
        </span>
        <h2 className="mt-4 text-[27px] leading-[1.25] font-bold text-[#0f172a] md:text-[32px]">
          KPSC
          <br />
          <span className="text-[#94a3b8]">가입 프로세스 안내</span>
        </h2>
        {/* 구분선 — 원본 .kpsc-divider (64×4px 검정) */}
        <span aria-hidden className="mt-8 block h-1 w-16 bg-[#0f172a]" />
      </Reveal>

      {/* ================================================================
          2) 가입 절차 카드 5장 — 원본 .glow-card + .kpsc-card
          ================================================================ */}
      <section className="mx-auto mt-5 flex max-w-[64rem] flex-col gap-6 pb-10">
        {STEPS.map((step, i) => (
          <Reveal key={step.no} delay={0.1 + i * 0.1}>
            {/* hover: -8px 부상 + 대형 소프트 섀도 + 테두리 #cbd5e1 (0.5s) */}
            <article className="group relative flex flex-col items-start gap-6 overflow-hidden rounded-3xl border border-[#e2e8f0] bg-white p-8 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-2 hover:border-[#cbd5e1] hover:shadow-[0_40px_80px_-20px_rgba(15,23,42,0.08)] md:flex-row md:items-center md:gap-10 md:p-10">
              {/* 우하단 번호 워터마크 — 8rem, opacity 0.03 (hover 0.06 + 확대) */}
              <span
                aria-hidden
                className="serif-italic pointer-events-none absolute right-5 -bottom-5 text-[8rem] leading-none opacity-[0.03] transition-all duration-500 select-none group-hover:-translate-y-2.5 group-hover:scale-105 group-hover:opacity-[0.06]"
              >
                {step.no}
              </span>

              {/* 아이콘 박스 — 남색(#1e293b), hover 시 색 반전 + 인셋 링 */}
              <span
                aria-hidden
                className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#1e293b] text-white transition-all duration-[400ms] group-hover:bg-[#f8fafc] group-hover:text-[#1e293b] group-hover:shadow-[inset_0_0_0_1px_#e2e8f0]"
              >
                <PhIcon d={step.icon} className="h-[30px] w-[30px]" />
              </span>

              {/* 텍스트 */}
              <div className="relative z-10">
                <h3 className="mb-2 text-[20px] font-bold text-[#1e293b] md:text-[24px]">
                  {step.title}
                </h3>
                <p className="text-[16px] leading-[1.625] font-light text-[#64748b]">
                  {step.desc}
                </p>
              </div>
            </article>
          </Reveal>
        ))}
      </section>

      {/* ================================================================
          3) 하단 CTA — 원본 .kpsc-cta (좌측 정렬, 그라데이션 1px 링)
          ================================================================ */}
      <Reveal as="section" className="mx-auto mt-16 mb-10 max-w-[64rem] md:mb-24">
        <span className="inline-block rounded-full bg-gradient-to-r from-[#e2e8f0] to-transparent p-px">
          <Link
            href="/news/activities"
            className="group inline-flex items-center rounded-full bg-[#0f172a] px-10 py-5 font-extrabold text-white transition-all duration-300 hover:bg-[#1e293b]"
          >
            KPSC 활동
            <PhIcon
              d={PH.arrowRight}
              className="ml-3 h-4 w-4 transition-transform duration-300 group-hover:translate-x-2"
            />
          </Link>
        </span>
      </Reveal>
    </SubLayout>
  );
}
