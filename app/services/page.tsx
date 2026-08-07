/* ==========================================================================
   사업 및 서비스 > 제공 서비스  (원본 /services.php?pg=41)
   구성
     1) 히어로 — 좌측 정렬 배지 + 2줄 제목 + 구분선
     2) 가입 프로세스 카드 5장 — 1열 세로 스택 (PC는 카드 내부가 아이콘 좌 / 텍스트 우)
     3) 하단 CTA — 테두리 박스 안 버튼
   ========================================================================== */

import type { Metadata } from "next";
import Link from "next/link";
import SubLayout from "@/components/sub/SubLayout";
import Reveal from "@/components/common/Reveal";

export const metadata: Metadata = { title: "제공 서비스" };

/* --------------------------------------------------------------------------
   가입 절차 5단계 — 원본 텍스트 그대로
   -------------------------------------------------------------------------- */
const STEPS = [
  {
    no: "01",
    icon: "🌐",
    title: "홈페이지 접속",
    desc: "KPSC공식 웹사이트에 방문하여 최신 정보를 확인하세요.",
  },
  {
    no: "02",
    icon: "👤",
    title: "회원가입 이동",
    desc: "상단 메뉴의 '회원가입' 버튼을 클릭하여 가입 페이지로 이동합니다.",
  },
  {
    no: "03",
    icon: "📄",
    title: "약관 동의",
    desc: "안전한 서비스 이용을 위해 이용약관 및 개인정보 정책에 동의합니다.",
  },
  {
    no: "04",
    icon: "✏️",
    title: "정보 입력",
    desc: "이름, 연락처 등 가입에 필요한 필수 정보를 정확히 입력합니다.",
  },
  {
    no: "05",
    icon: "📨",
    title: "가입 완료",
    desc: "'가입하기' 버튼을 눌러 모든 절차를 마무리하고 회원이 됩니다.",
  },
];

export default function ServicesPage() {
  return (
    <SubLayout
      pathname="/services"
      visualPlaceholder="사업 및 서비스 서브 배너 (에너지 인프라)"
    >
      {/* ================================================================
          1) 히어로
          ================================================================ */}
      <Reveal as="section" className="max-w-4xl">
        <span className="font-mont inline-block rounded bg-ink-100 px-3 py-1.5 text-[11px] font-bold tracking-[0.1em] text-ink-500 uppercase">
          Onboarding
        </span>
        <h2 className="mt-5 text-[26px] leading-tight font-bold text-ink-900 lg:text-[38px]">
          KPSC
          <br />
          <span className="text-ink-400">가입 프로세스 안내</span>
        </h2>
        <span aria-hidden className="mt-8 block h-px w-full bg-ink-200" />
      </Reveal>

      {/* ================================================================
          2) 가입 절차 카드 5장 — 1열 세로 스택
          ================================================================ */}
      <section className="mt-10 flex flex-col gap-6 lg:mt-14">
        {STEPS.map((step, i) => (
          <Reveal key={step.no} delay={i * 0.08}>
            <article className="flex flex-col gap-6 rounded-3xl border border-ink-200 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-brand-600 hover:shadow-[var(--shadow-card)] lg:flex-row lg:items-center lg:gap-10 lg:p-10">
              {/* 아이콘 박스 */}
              <span
                aria-hidden
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-[26px]"
              >
                {step.icon}
              </span>

              {/* 텍스트 */}
              <div className="flex-1">
                <div className="flex items-baseline gap-3">
                  <span className="serif-italic text-[22px] text-ink-300">
                    {step.no}
                  </span>
                  <h3 className="text-[19px] font-bold text-ink-900 lg:text-[21px]">
                    {step.title}
                  </h3>
                </div>
                <p className="mt-2 text-[14px] leading-[1.75] text-ink-500 lg:text-[15px]">
                  {step.desc}
                </p>
              </div>
            </article>
          </Reveal>
        ))}
      </section>

      {/* ================================================================
          3) 하단 CTA
          ================================================================ */}
      <Reveal as="section" className="mt-14 lg:mt-20">
        <div className="rounded-2xl border border-ink-200 p-8 text-center lg:p-12">
          <Link
            href="/news/activities"
            className="group inline-flex items-center gap-2 rounded-full bg-brand-600 px-8 py-4 text-[15px] font-semibold text-white transition-colors hover:bg-brand-700"
          >
            KPSC 활동
            <span aria-hidden className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </Reveal>
    </SubLayout>
  );
}
