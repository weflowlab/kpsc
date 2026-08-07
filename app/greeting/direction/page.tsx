/* ==========================================================================
   인사말 > KPSC의 방향성  (원본 /direction.php?pg=22)
   구성
     1) Intro — PC 좌측 이미지 + 우측 텍스트 2단 + 체크 리스트
     2) Our Action — 카드 3장 (큰 이탤릭 숫자 + 아이콘 + 제목 + 설명)
     3) CTA — 잎사귀 워터마크 박스
   ※ 원본에는 내용이 비어 있는 height:0 히어로 섹션이 남아 있었으나 제거했다.
   ========================================================================== */

import type { Metadata } from "next";
import Link from "next/link";
import SubLayout from "@/components/sub/SubLayout";
import Reveal from "@/components/common/Reveal";
import Placeholder from "@/components/common/Placeholder";

export const metadata: Metadata = { title: "KPSC의 방향성" };

/* --------------------------------------------------------------------------
   Intro 체크 리스트
   -------------------------------------------------------------------------- */
const CHECKLIST = ["용인에너지협동조합 핵심 파트너십", "탄소중립 로드맵 실천 기여"];

/* --------------------------------------------------------------------------
   Our Action 카드 3장 — 원본 텍스트 그대로
   -------------------------------------------------------------------------- */
const ACTIONS = [
  {
    no: "01",
    icon: "🚲",
    title: "도보 및 대중교통",
    desc: "가까운 거리는 도보로 이동하며 장거리 이동 시 대중교통 이용을 지향합니다.",
  },
  {
    no: "02",
    icon: "☕",
    title: "일회용품 줄이기",
    desc: "개인 텀블러 사용을 습관화하여 불필요한 일회용품 배출을 최소화하고 있습니다.",
  },
  {
    no: "03",
    icon: "🤝",
    title: "사회공헌 활동",
    desc: "다양한 도우미 활동을 통해 주변의 어려운 이웃에게 따뜻한 도움을 전하고 있습니다.",
  },
];

export default function DirectionPage() {
  return (
    <SubLayout
      pathname="/greeting/direction"
      visualPlaceholder="인사말 서브 배너 (오피스 아키텍처)"
    >
      {/* ================================================================
          1) Intro — 좌측 이미지 + 우측 텍스트
          ================================================================ */}
      <section className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        {/* 좌측 이미지 */}
        <Reveal type="fade-right">
          <div className="h-[280px] overflow-hidden rounded-2xl shadow-[0_30px_60px_-20px_rgba(15,23,42,0.25)] lg:h-[420px]">
            <Placeholder label="Vision" />
          </div>
        </Reveal>

        {/* 우측 텍스트 */}
        <Reveal type="fade-left">
          <h2 className="text-[26px] leading-tight font-bold text-ink-900 lg:text-[36px]">
            친환경 에너지로 향하는
            <br />
            KPSC의 약속
          </h2>
          <p className="mt-6 text-[15px] leading-[1.9] text-ink-500 lg:text-[16px]">
            저희 KPSC는 용인에너지협동조합의 소속된 구성원으로서 탄소중립실천 및 미래
            에너지 발전에 기여하여 친환경 에너지 발전으로 나아가겠습니다.
          </p>

          {/* 체크 리스트 */}
          <ul className="mt-8 space-y-3">
            {CHECKLIST.map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-[11px] text-brand-600"
                >
                  ✓
                </span>
                <span className="text-[15px] text-ink-700 lg:text-[16px]">{item}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* ================================================================
          2) Our Action — 카드 3장
          ================================================================ */}
      <section className="mt-20 lg:mt-32">
        <Reveal className="mb-10 lg:mb-14">
          <h3 className="font-mont text-[12px] font-bold tracking-[0.2em] text-brand-600 uppercase">
            Our Action
          </h3>
          <h2 className="mt-3 text-[24px] font-bold text-ink-900 lg:text-[36px]">
            일상 속 친환경 실천
          </h2>
        </Reveal>

        <ul className="grid gap-6 lg:grid-cols-3">
          {ACTIONS.map((action, i) => (
            <Reveal as="li" key={action.no} delay={i * 0.1}>
              <div className="h-full rounded-2xl border border-ink-200 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-accent-500 hover:shadow-[var(--shadow-card)]">
                {/* 큰 이탤릭 숫자 */}
                <span className="serif-italic block text-[40px] leading-none text-ink-200">
                  {action.no}
                </span>

                {/* 아이콘 박스 */}
                <span
                  aria-hidden
                  className="mt-6 flex h-14 w-14 items-center justify-center rounded-xl bg-ink-50 text-[24px]"
                >
                  {action.icon}
                </span>

                <h4 className="mt-6 text-[19px] font-bold text-ink-900">
                  {action.title}
                </h4>
                <p className="mt-3 text-[14px] leading-[1.8] text-ink-500">
                  {action.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* ================================================================
          3) CTA — 잎사귀 워터마크 박스
          ================================================================ */}
      <Reveal as="section" className="mt-16 lg:mt-24">
        <div className="relative overflow-hidden rounded-2xl border border-ink-200 bg-ink-50 p-10 text-center lg:p-20">
          <span
            aria-hidden
            className="pointer-events-none absolute -top-6 -right-6 text-[160px] leading-none opacity-[0.06]"
          >
            🍃
          </span>

          <h2 className="relative text-[22px] leading-tight font-bold text-ink-900 lg:text-[32px]">
            지속 가능한 에너지를 위한 여정,
            <br />
            KPSC가 함께합니다.
          </h2>

          <Link
            href="/news/activities"
            className="group relative mt-8 inline-flex items-center gap-2 rounded-full bg-brand-600 px-8 py-4 text-[15px] font-semibold text-white transition-colors hover:bg-brand-700"
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
