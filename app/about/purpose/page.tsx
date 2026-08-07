/* ==========================================================================
   KPSC소개 > KPSC의 설립 목적  (원본 /kpsc_purpose.php?pg=11)
   구성
     1) 히어로 — 좌측 텍스트 + 우측 이미지 2단
     2) Our Purpose — 비대칭 벤토 그리드 (좌측 큰 카드 1 + 우측 작은 카드 2)
   ========================================================================== */

import type { Metadata } from "next";
import Link from "next/link";
import SubLayout from "@/components/sub/SubLayout";
import Reveal from "@/components/common/Reveal";
import Placeholder from "@/components/common/Placeholder";

export const metadata: Metadata = { title: "KPSC의 설립 목적" };

/* --------------------------------------------------------------------------
   Our Purpose 카드 데이터 — 원본 텍스트 그대로
   -------------------------------------------------------------------------- */
const PURPOSE_CARDS = [
  {
    icon: "🌱",
    title: "사회적 분야 기여",
    desc: "에너지 복지 사각지대를 해소하고 지역사회와 상생하는 사회적 기여 모델을 운영합니다. 이익을 넘어 가치를 나눕니다.",
  },
  {
    icon: "⚡",
    title: "미래 에너지 발전",
    desc: "차세대 태양광, 풍력 및 효율적인 에너지 저장 시스템(ESS)을 통해 기술 혁신을 주도합니다.",
  },
];

/* 큰 카드 안의 숫자 통계 */
const STATS = [
  { value: "100%", label: "친환경 전환" },
  { value: "No.1", label: "에너지 리더" },
];

export default function PurposePage() {
  return (
    <SubLayout
      pathname="/about/purpose"
      visualPlaceholder="KPSC 소개 서브 배너 (친환경 에너지 전경)"
    >
      {/* ================================================================
          1) 히어로 — PC 좌측 텍스트 + 우측 이미지 2단
          ================================================================ */}
      <section className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-[60px]">
        {/* 좌측 텍스트 */}
        <Reveal type="fade-right" className="flex-1">
          <span className="inline-block rounded-full bg-brand-50 px-4 py-1.5 text-[12px] font-bold tracking-[0.1em] text-brand-600">
            Innovation &amp; Future
          </span>
          <h2 className="mt-5 text-[28px] leading-tight font-bold text-ink-900 lg:text-[42px]">
            미래 에너지를 선도하는
            <br />
            <span className="gradient-text">KPSC</span>
          </h2>
          <p className="mt-5 text-[15px] leading-[1.75] text-ink-500 lg:text-[17px]">
            용인에너지협동조합의 정신을 계승하여, 승격된 전문성을 바탕으로 지속 가능한
            미래 에너지 생태계를 구축합니다.
          </p>

          {/* CTA — 원본 "비전 더보기" 버튼 (원본은 깨진 링크라 파트너사 페이지로 연결) */}
          <Link
            href="/about/partners"
            className="group mt-8 inline-flex items-center gap-2 rounded-full bg-brand-600 px-7 py-3.5 text-[14px] font-semibold text-white transition-colors hover:bg-brand-700"
          >
            비전 더보기
            <span aria-hidden className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </Reveal>

        {/* 우측 이미지 */}
        <Reveal type="fade-left" className="flex-1">
          <div className="h-[260px] overflow-hidden rounded-[30px] lg:h-[400px]">
            <Placeholder label="신재생 에너지 발전소" />
          </div>
        </Reveal>
      </section>

      {/* ================================================================
          2) Our Purpose — 비대칭 벤토 그리드
          ================================================================ */}
      <section className="mt-20 lg:mt-32">
        {/* 섹션 헤더 */}
        <Reveal className="mb-10 lg:mb-14">
          <span className="inline-block rounded-full bg-brand-50 px-4 py-1.5 text-[12px] font-bold tracking-[0.1em] text-brand-600">
            Our Purpose
          </span>
          <h2 className="mt-4 text-[24px] font-bold text-ink-900 lg:text-[36px]">
            우리가 존재하는 이유
          </h2>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr]">
          {/* 큰 카드 (featured) */}
          <Reveal className="md:col-span-2 lg:col-span-1 lg:row-span-2">
            <div className="flex h-full flex-col justify-between rounded-2xl bg-ink-900 p-8 text-white lg:p-10">
              <div>
                <h3 className="text-[22px] font-bold lg:text-[28px]">
                  에너지의 가치를 높이다
                </h3>
                <p className="mt-5 text-[15px] leading-[1.8] text-white/70">
                  용인에너지협동조합 산하 브랜드에서 독립된 협동조합으로 승격된 KPSC는
                  단순한 발전을 넘어, 대한민국 미래 에너지 자립의 핵심 역할을
                  수행합니다.
                </p>
              </div>

              {/* 숫자 통계 2열 */}
              <dl className="mt-10 grid grid-cols-2 gap-4 border-t border-white/15 pt-8">
                {STATS.map((stat) => (
                  <div key={stat.label}>
                    <dt className="gradient-text text-[28px] font-extrabold lg:text-[36px]">
                      {stat.value}
                    </dt>
                    <dd className="mt-1 text-[13px] text-white/60">{stat.label}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>

          {/* 작은 카드 2개 */}
          {PURPOSE_CARDS.map((card, i) => (
            <Reveal key={card.title} delay={0.1 + i * 0.1}>
              <div className="h-full rounded-2xl border border-ink-200 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-brand-600 hover:shadow-[var(--shadow-card)]">
                <span aria-hidden className="text-[28px]">
                  {card.icon}
                </span>
                <h3 className="mt-4 text-[19px] font-bold text-ink-900">{card.title}</h3>
                <p className="mt-3 text-[14px] leading-[1.75] text-ink-500">
                  {card.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </SubLayout>
  );
}
