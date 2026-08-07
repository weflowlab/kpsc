/* ==========================================================================
   KPSC소개 > KPSC와 함께하는 사람들  (원본 /partner.php?pg=12)
   구성
     1) 히어로 — 텍스트 전용 중앙 정렬
     2) 파트너 카드 2장 (PC 2열) — 상단 이미지 + 하단 텍스트
     3) 파트너 모집 카드 — 3단계 타임라인 + 전화 CTA
   ========================================================================== */

import type { Metadata } from "next";
import SubLayout from "@/components/sub/SubLayout";
import Reveal from "@/components/common/Reveal";
import Image from "next/image";
import { CONTENT_IMAGES } from "@/lib/images";
import { COMPANY } from "@/lib/site-config";

export const metadata: Metadata = { title: "KPSC와 함께하는 사람들" };

/* --------------------------------------------------------------------------
   협력 파트너사 — 원본 텍스트 그대로
   -------------------------------------------------------------------------- */
const PARTNERS = [
  {
    title: "협력파트너사 : 레투코리아",
    desc: "KPSC와 함께 미래에너지 혁신과 더 나은 세상을 위한 변화를 실천하는 국내 No.1 여행캐리어 전문업체입니다.",
    image: CONTENT_IMAGES.partner1,
  },
  {
    title: "협력파트너사 : 프린트천국",
    desc: "KPSC와 함께 미래에너지 혁신과 더 나은 세상을 위한 변화를 실천하는 국내 전문 프린트업체입니다.",
    image: CONTENT_IMAGES.partner2,
  },
];

/* --------------------------------------------------------------------------
   파트너 모집 3단계 타임라인
   -------------------------------------------------------------------------- */
const TIMELINE = [
  { no: "1", title: "가치 공유", desc: "미래에너지 혁신을 위한 첫 걸음" },
  { no: "2", title: "전략 제안", desc: "업체별 최적화된 협력 모델 구축" },
  { no: "3", title: "혁신 실행", desc: "더 나은 세상을 위한 변화의 실천" },
];

export default function PartnersPage() {
  return (
    <SubLayout
      pathname="/about/partners"
      banner="services"
    >
      {/* ================================================================
          1) 히어로 — 텍스트 전용
          ================================================================ */}
      <Reveal as="section" className="text-center">
        <span className="inline-block rounded-full bg-brand-50 px-4 py-1.5 text-[12px] font-bold tracking-[0.1em] text-brand-600">
          Our Partners
        </span>
        <h2 className="mt-5 text-[24px] leading-tight font-bold text-ink-900 lg:text-[38px]">
          저희는 다양한 업체와 협력하여
          <br />
          미래에너지 혁신을 실천하고 있습니다.
        </h2>
      </Reveal>

      {/* ================================================================
          2) 파트너 카드 2장
          ================================================================ */}
      <section className="mt-14 grid gap-8 lg:mt-20 lg:grid-cols-2">
        {PARTNERS.map((partner, i) => (
          <Reveal key={partner.title} delay={i * 0.15}>
            <article className="group h-full overflow-hidden rounded-2xl border border-ink-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card)]">
              {/* 상단 이미지 */}
              <div className="h-[220px] overflow-hidden lg:h-[280px]">
                <div className="relative h-full w-full transition-transform duration-[600ms] group-hover:scale-105">
                  <Image
                    src={partner.image}
                    alt={partner.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </div>

              {/* 하단 텍스트 */}
              <div className="p-7 lg:p-8">
                <h3 className="text-[18px] font-bold text-brand-600 lg:text-[20px]">
                  {partner.title}
                </h3>
                <p className="mt-3 text-[14px] leading-[1.75] text-ink-500 lg:text-[15px]">
                  {partner.desc}
                </p>
              </div>
            </article>
          </Reveal>
        ))}
      </section>

      {/* ================================================================
          3) 파트너 모집 카드 — 전체 폭
          ================================================================ */}
      <Reveal as="section" className="mt-8 lg:mt-10">
        <div className="rounded-2xl bg-ink-50 p-8 lg:p-14">
          <div className="text-center">
            <span className="font-mont inline-block rounded-full bg-white px-4 py-1.5 text-[11px] font-bold tracking-[0.15em] text-ink-500">
              Network Expansion
            </span>
            <h3 className="mt-5 text-[22px] leading-tight font-bold text-ink-900 lg:text-[32px]">
              저희는 이렇게 저희와 함께할
              <br />
              파트너를 모집합니다.
            </h3>
          </div>

          {/* 3단계 타임라인 */}
          <ol className="mt-12 grid gap-8 md:grid-cols-3">
            {TIMELINE.map((step, i) => (
              <Reveal as="li" key={step.no} delay={i * 0.1} className="text-center">
                {/* 원형 번호 */}
                <span className="font-mont mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-[20px] font-bold text-white">
                  {step.no}
                </span>
                <h4 className="mt-5 text-[17px] font-bold text-ink-900">{step.title}</h4>
                <p className="mt-2 text-[14px] text-ink-500">{step.desc}</p>
              </Reveal>
            ))}
          </ol>

          {/* 전화 CTA */}
          <div className="mt-12 text-center">
            <a
              href={`tel:${COMPANY.tel}`}
              className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-8 py-4 text-[15px] font-semibold text-white transition-colors hover:bg-brand-600"
            >
              파트너 참여하기 : {COMPANY.tel}
            </a>
          </div>
        </div>
      </Reveal>
    </SubLayout>
  );
}
