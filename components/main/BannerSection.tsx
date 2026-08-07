/* ==========================================================================
   메인 - 벤토 배너 섹션 (원본 .money- 블록)
   원본 재현 포인트
   - 섹션 헤더 없이 카드 2장만 배치. PC 그리드 1fr 1.1fr (비대칭 2열)
   - 이미지 없이 CSS glow + 워터마크 숫자(opacity .06)로 구성
   - 카드 1 = 라이트, 카드 2 = #0f172a 다크 (비대칭 대비)
   - hover: 부양(-8px) + glow scale 1.2 + 화살표 -45° 회전 + 버튼 색 반전
   - 두 번째 카드는 0.15초 지연 stagger
   ========================================================================== */

import Link from "next/link";
import Reveal from "@/components/common/Reveal";
import { BANNER_CARDS } from "@/lib/content/main";

export default function BannerSection() {
  return (
    <section className="py-[60px] lg:py-[140px]">
      <div className="container-wide">
        <div className="grid gap-5 md:grid-cols-[1fr_1.1fr] xl:gap-10">
          {BANNER_CARDS.map((card, i) => (
            <Reveal key={card.watermark} type="fade-up-sm" delay={i * 0.15}>
              <Link
                href={card.href}
                className={[
                  "group relative flex h-full flex-col justify-between overflow-hidden rounded-[15px] p-8 lg:p-12",
                  "transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2",
                  "hover:shadow-[0_24px_48px_-12px_rgba(59,130,246,0.15),0_8px_16px_-8px_rgba(15,23,42,0.04)]",
                  card.accent
                    ? "bg-ink-900 text-white"
                    : "border border-ink-200 bg-white text-ink-900",
                ].join(" ")}
              >
                {/* 배경 글로우 — hover 시 1.2배 확대 */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -top-1/4 -right-1/4 h-[400px] w-[400px] rounded-full blur-[60px] transition-transform duration-[600ms] group-hover:scale-125"
                  style={{
                    background: card.accent
                      ? "radial-gradient(circle, rgba(99,102,241,0.35), transparent 70%)"
                      : "radial-gradient(circle, rgba(148,163,184,0.28), transparent 70%)",
                  }}
                />

                {/* 워터마크 숫자 — 우하단, opacity .06 */}
                <span
                  aria-hidden
                  className="font-mont pointer-events-none absolute right-6 -bottom-6 text-[120px] leading-none font-black opacity-[0.06] lg:text-[180px]"
                >
                  {card.watermark}
                </span>

                {/* 상단 — 배지 + 화살표 아이콘 */}
                <div className="relative flex items-start justify-between">
                  <span
                    className={[
                      "inline-block rounded-full px-3.5 py-1.5 text-[12px] font-semibold",
                      card.accent
                        ? "bg-white/10 text-brand-300"
                        : "bg-brand-50 text-brand-600",
                    ].join(" ")}
                  >
                    {card.badge}
                  </span>
                  <span
                    aria-hidden
                    className={[
                      "flex h-11 w-11 items-center justify-center rounded-full text-lg transition-transform duration-[400ms] group-hover:-rotate-45",
                      card.accent ? "bg-white/10 text-white" : "bg-ink-100 text-ink-900",
                    ].join(" ")}
                  >
                    →
                  </span>
                </div>

                {/* 하단 — 제목 / 설명 / 버튼 */}
                <div className="relative mt-16 lg:mt-24">
                  <h3
                    className={[
                      "text-[22px] leading-[1.2] font-extrabold tracking-[-0.5px] lg:text-[32px]",
                      card.accent ? "text-white" : "gradient-text",
                    ].join(" ")}
                  >
                    {card.title}
                  </h3>
                  <p
                    className={[
                      "mt-4 text-[15px] leading-[1.6] font-medium lg:text-[17px]",
                      card.accent ? "text-white/70" : "text-ink-500",
                    ].join(" ")}
                  >
                    {card.description[0]}
                    <br />
                    {card.description[1]}
                  </p>

                  <span
                    className={[
                      "mt-7 inline-block rounded-full border px-6 py-2.5 text-[14px] font-semibold transition-colors duration-300",
                      card.accent
                        ? "border-white/25 text-white group-hover:bg-white group-hover:text-brand-900"
                        : "border-ink-200 text-ink-900 group-hover:bg-brand-600 group-hover:text-white",
                    ].join(" ")}
                  >
                    자세히 보기
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
