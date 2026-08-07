/* ==========================================================================
   메인 - PARTNERS 섹션 (원본 .excl- 블록)
   원본 재현 포인트
   - 배경 #F8F9FA, 섹션 패딩 120/80/40px
   - 카드 4장: PC 4열 → 1280px 이하 2열 → 480px 이하 1열
   - 카드 hover: 부양(-10px) + 이미지 1.1배 줌 + 그레이스케일 해제
     + 아이콘 컬러 반전 + "자세히 보기 →" 좌→우 페이드인 (4중 연출)
   ========================================================================== */

import Link from "next/link";
import Placeholder from "@/components/common/Placeholder";
import Reveal from "@/components/common/Reveal";
import { PARTNER_CARDS, PARTNERS_HEADING } from "@/lib/content/main";

export default function PartnersSection() {
  return (
    <section id="services" className="section-pad bg-section">
      <div className="container-wide">
        {/* ================================================================
            섹션 헤더 — 영문 배지 / 국문 제목 / 설명
            ================================================================ */}
        <Reveal className="mb-12 text-center lg:mb-16">
          <span className="font-mont inline-block rounded-full bg-brand-50 px-4 py-1.5 text-[12px] font-bold tracking-[0.15em] text-brand-600">
            {PARTNERS_HEADING.label}
          </span>
          <h2 className="font-mont mt-5 text-[28px] font-bold text-ink-800 lg:text-[48px]">
            {PARTNERS_HEADING.title}
          </h2>
          <p className="mt-3 text-[16px] font-bold text-ink-500 lg:text-[18px]">
            {PARTNERS_HEADING.description}
          </p>
        </Reveal>

        {/* ================================================================
            카드 그리드 — 4열 / 2열 / 1열
            ================================================================ */}
        <ul className="grid grid-cols-1 gap-[30px] sm:grid-cols-2 xl:grid-cols-4">
          {PARTNER_CARDS.map((card, i) => (
            <Reveal as="li" key={card.num} delay={i * 0.1}>
              <Link
                href={card.href}
                className="group block h-full overflow-hidden rounded-[10px] border border-ink-200 bg-white transition-all duration-[400ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-brand-600 hover:shadow-[var(--shadow-card-hover)] xl:hover:-translate-y-[10px]"
              >
                {/* 이미지 박스 — 높이 260px, hover 시 scale 1.1 + 그레이스케일 해제 */}
                <div className="h-[260px] overflow-hidden">
                  <div className="h-full w-full grayscale-[10%] transition-all duration-[600ms] group-hover:scale-110 group-hover:grayscale-0">
                    <Placeholder label={card.placeholder} />
                  </div>
                </div>

                {/* 텍스트 영역 */}
                <div className="p-6 lg:p-7">
                  {/* 번호 + 아이콘 (hover 시 컬러 반전) */}
                  <div className="mb-4 flex items-center justify-between">
                    <span className="font-mont text-[24px] font-semibold text-brand-600">
                      {card.num}
                    </span>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-600 transition-colors duration-300 group-hover:bg-brand-600 group-hover:text-white">
                      <span aria-hidden className="text-sm">
                        ➜
                      </span>
                    </span>
                  </div>

                  <h3 className="text-[22px] font-bold text-ink-800">{card.title}</h3>
                  <p className="mt-3 text-[16px] leading-[1.6] text-ink-500">
                    {card.description}
                  </p>

                  {/* 링크 — 평소 숨김, hover 시 좌→우 슬라이드 인 */}
                  <span className="mt-4 block -translate-x-[10px] text-[14px] font-bold text-brand-600 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                    자세히 보기 →
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
