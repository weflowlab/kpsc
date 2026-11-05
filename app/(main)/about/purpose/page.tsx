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
import Image from "next/image";
import { CONTENT_IMAGES } from "@/lib/images";

export const metadata: Metadata = { title: "KPSC의 설립 목적" };

/* --------------------------------------------------------------------------
   Our Purpose 카드 데이터 — 원본 텍스트 그대로
   아이콘은 원본과 동일한 Font Awesome Free 6.4.0 solid 패스를 그대로 사용
   (fa-seedling / fa-bolt — CC BY 4.0, ⓒ Fonticons, Inc.)
   색상은 원본 .card:not(.featured) i 의 --gee-primary-500(#007AFF)
   -------------------------------------------------------------------------- */
function SeedlingIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="26"
      height="26"
      viewBox="0 0 512 512"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M512 32c0 113.6-84.6 207.5-194.2 222c-7.1-53.4-30.6-101.6-65.3-139.3C290.8 46.3 364 0 448 0h32c17.7 0 32 14.3 32 32zM0 96C0 78.3 14.3 64 32 64H64c123.7 0 224 100.3 224 224v32V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V320C100.3 320 0 219.7 0 96z" />
    </svg>
  );
}

function BoltIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="26"
      height="26"
      viewBox="0 0 448 512"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M349.4 44.6c5.9-13.7 1.5-29.7-10.6-38.5s-28.6-8-39.9 1.8l-256 224c-10 8.8-13.6 22.9-8.9 35.3S50.7 288 64 288H175.5L98.6 467.4c-5.9 13.7-1.5 29.7 10.6 38.5s28.6 8 39.9-1.8l256-224c10-8.8 13.6-22.9 8.9-35.3s-16.6-20.7-30-20.7H272.5L349.4 44.6z" />
    </svg>
  );
}

const PURPOSE_CARDS = [
  {
    icon: SeedlingIcon,
    title: "사회적 분야 기여",
    desc: "에너지 복지 사각지대를 해소하고 지역사회와 상생하는 사회적 기여 모델을 운영합니다. 이익을 넘어 가치를 나눕니다.",
  },
  {
    icon: BoltIcon,
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
      banner="about"
    >
      {/* ================================================================
          1) 히어로 — PC 좌측 텍스트 + 우측 이미지 2단
          ================================================================ */}
      <section className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-[60px]">
        {/* 좌측 텍스트 */}
        <Reveal type="fade-right" className="flex-1">
          <span className="inline-block rounded-full bg-brand-50 px-4 py-1.5 text-[12px] font-extrabold tracking-[0.1em] text-brand-600">
            Innovation &amp; Future
          </span>
          <h2 className="mt-5 text-[28px] leading-tight font-bold text-ink-900 lg:text-[42px]">
            미래 에너지를 선도하는
            <br />
            {/* 원본 gee 그라데이션 (#007aff → #8e44ad) */}
            <span className="gradient-text-vision">KPSC</span>
          </h2>
          {/* 원본 .hero p — clamp(1.12rem, 2vw, 1.4rem) + letter-spacing 0.05em.
              PC 기준 "전문" / "구축" 뒤에서 줄이 꺾인다 (원본 max-width 600px 래핑) */}
          <p className="mt-5 text-[18px] leading-[1.75] tracking-[0.05em] text-ink-500 lg:text-[22px]">
            용인에너지협동조합의 정신을 계승하여, 승격된 전문
            <br className="hidden lg:inline" />
            성을 바탕으로 지속 가능한 미래 에너지 생태계를 구축
            <br className="hidden lg:inline" />
            합니다.
          </p>

          {/* CTA — 원본 "비전 더보기" 버튼 (원본은 깨진 링크라 파트너사 페이지로 연결)
              라운드 16px, hover 시 배경 어두워지며 버튼 전체 scale(1.05) — 원본 .cta-btn */}
          <Link
            href="/about/partners"
            className="group mt-8 inline-flex items-center gap-2 rounded-2xl bg-brand-600 px-9 py-[17px] text-[17px] font-extrabold text-white transition-all duration-500 hover:scale-105 hover:bg-brand-700"
          >
            비전 더보기
            <span aria-hidden className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </Reveal>

        {/* 우측 이미지 — fill 이미지가 30px 라운드 래퍼 안에 갇히도록 relative 필수 */}
        <Reveal type="fade-left" className="flex-1">
          <div className="relative h-[210px] overflow-hidden rounded-[30px] lg:h-[300px]">
            <Image
              src={CONTENT_IMAGES.purpose}
              alt="신재생 에너지 발전소"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </section>

      {/* ================================================================
          2) Our Purpose — 비대칭 벤토 그리드
          ================================================================ */}
      <section className="mt-20 lg:mt-32">
        {/* 섹션 헤더 */}
        <Reveal className="mb-6 lg:mb-8">
          <span className="inline-block rounded-full bg-brand-50 px-4 py-1.5 text-[12px] font-extrabold tracking-[0.1em] text-brand-600">
            Our Purpose
          </span>
          <h2 className="mt-4 text-[24px] font-bold text-ink-900 lg:text-[36px]">
            우리가 존재하는 이유
          </h2>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr]">
          {/* 큰 카드 (featured) — 원본 .card.featured
              배경 --gee-primary-900(#003366), 라운드 24px.
              justify-between 제거 — 내용이 위에서부터 자연스럽게 쌓여
              하단 여백 없이 잘리고, 우측 카드들이 그리드 row 를 채우며
              이 카드 높이에 맞춰 늘어난다. */}
          <Reveal className="md:col-span-2 lg:col-span-1 lg:row-span-2">
            {/* hover 인터랙션은 작은 카드와 동일 (원본 .card:hover 공통) */}
            <div className="h-full rounded-3xl bg-[#003366] p-8 text-white transition-all duration-[400ms] hover:-translate-y-2.5 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] lg:p-10">
              <h3 className="text-[22px] font-bold tracking-[0.015em] lg:text-[28px]">
                에너지의 가치를 높이다
              </h3>
              <p className="mt-5 text-[16px] leading-[1.8] tracking-[0.015em] text-white/80 lg:text-[17px]">
                용인에너지협동조합 산하 브랜드에서 독립된 협동조합으로 승격된 KPSC는
                단순한 발전을 넘어, 대한민국 미래 에너지 자립의 핵심 역할을
                수행합니다.
              </p>

              {/* 숫자 통계 — 원본 .stat-card: 반투명 흰 박스 + 20px 라운드 */}
              <dl className="mt-10 grid grid-cols-2 gap-5">
                {STATS.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-[20px] bg-white/10 p-5 lg:p-[30px]"
                  >
                    <dt className="gradient-text-vision text-[32px] lg:text-[40px]">
                      {stat.value}
                    </dt>
                    <dd className="mt-1 text-[14px] text-white/80 lg:text-[16px]">
                      {stat.label}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>

          {/* 작은 카드 2개 — 원본 .card: 라운드 24px + 1px rgba(0,0,0,0.1) 테두리,
              hover 시 translateY(-10px) scale(1.02) + 그림자 (0.4s)
              ※ 두 카드 합이 좌측 카드 내용 높이를 넘지 않게 컴팩트하게 잡고,
                h-full 로 그리드 row 를 채워 좌측 높이에 정확히 맞춘다. */}
          {PURPOSE_CARDS.map((card, i) => (
            <Reveal key={card.title} delay={0.1 + i * 0.1}>
              <div className="h-full rounded-3xl border border-black/10 bg-white p-6 transition-all duration-[400ms] hover:-translate-y-2.5 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] lg:px-8 lg:py-6">
                <card.icon className="mb-2 text-[#007AFF]" />
                <h3 className="text-[20px] font-bold tracking-[0.015em] text-ink-900 lg:text-[22px]">
                  {card.title}
                </h3>
                <p className="mt-2 text-[14px] leading-[1.65] tracking-[0.015em] text-ink-500 lg:text-[15px]">
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
