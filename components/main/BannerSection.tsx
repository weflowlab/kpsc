/* ==========================================================================
   메인 - 벤토 배너 섹션 (원본 .money- 블록)
   원본 재현 포인트
   - 섹션 헤더 없이 카드 2장만 배치. PC 그리드 1fr 1.1fr (비대칭 2열)
   - 이미지 없이 CSS glow + 워터마크 숫자(opacity .06)로 구성
   - 섹션 배경은 어두운 #0f172a (원본 다크 모드 --money-surface-100)
   - 카드 1(운영진 소개) = 다크 #1e293b, 카드 2(갤러리) = 라이트 #f8fafc
     + 좌하단 짙은 파랑 글로우
   - hover: 부양(-8px) + glow scale 1.2 + 화살표 -45° 회전 + 버튼 색 반전
   - 두 번째 카드는 0.15초 지연 stagger
   ========================================================================== */

import Link from "next/link";
import Reveal from "@/components/common/Reveal";
import { BANNER_CARDS } from "@/lib/content/main";

export default function BannerSection() {
  return (
    <section className="font-pretendard bg-ink-900 py-[60px] lg:py-[140px]">
      {/* 원본 .money-container — max-width 1400px, 좌우 패딩 clamp(24px, 5vw, 60px) */}
      <div className="mx-auto w-full max-w-[1400px] px-6 lg:px-[60px]">
        <div className="grid gap-5 md:grid-cols-[1fr_1.1fr] xl:gap-10">
          {BANNER_CARDS.map((card, i) => (
            <Reveal key={card.watermark} type="fade-up-sm" delay={i * 0.15}>
              <Link
                href={card.href}
                className={[
                  "group relative flex h-full flex-col justify-between overflow-hidden rounded-[15px] p-7 lg:p-10",
                  "transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2",
                  "hover:shadow-[0_24px_48px_-12px_rgba(59,130,246,0.15),0_8px_16px_-8px_rgba(15,23,42,0.04)]",
                  card.accent
                    ? "border border-[rgba(150,150,150,0.25)] bg-ink-800 text-white"
                    : "border-0 bg-[#F8FAFC] text-ink-900",
                ].join(" ")}
              >
                {/* 배경 글로우 (원본 .money-card-glow) — 300×300 / blur 60px
                    · 다크 카드  : 우상단, 은은한 회색
                    · 갤러리 카드: 좌하단, 짙은 파랑 #1e3a8a (opacity .8)
                    hover 시 1.2배 확대 */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute h-[300px] w-[300px] rounded-full blur-[60px] transition-transform duration-[600ms] group-hover:scale-125"
                  style={
                    card.accent
                      ? {
                          top: -100,
                          right: -100,
                          opacity: 0.5,
                          background:
                            "radial-gradient(circle, rgba(150,150,150,0.15) 0%, transparent 70%)",
                        }
                      : {
                          bottom: -100,
                          left: -100,
                          opacity: 0.8,
                          background:
                            "radial-gradient(circle, #1e3a8a 0%, transparent 70%)",
                        }
                  }
                />

                {/* 워터마크 숫자 — 원본 .money-watermark
                    우하단 모서리 밖으로 밀어내 카드의 overflow-hidden 에
                    오른쪽·아래가 잘리게 한다.
                    원본은 font-family 를 따로 지정하지 않아 본문 폰트(Pretendard)를
                    그대로 상속받는다. Montserrat 를 쓰지 않는 이유. */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-[3%] -bottom-[10%] text-[clamp(120px,15vw,180px)] leading-none font-black opacity-[0.06] select-none"
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
                      card.accent
                        ? "bg-brand-600 text-white"
                        : "bg-white/70 text-ink-500",
                    ].join(" ")}
                  >
                    →
                  </span>
                </div>

                {/* 하단 — 제목 / 설명 / 버튼 */}
                <div className="relative mt-8 lg:mt-10">
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
                        ? "border-transparent bg-white/95 text-brand-900 group-hover:bg-brand-600 group-hover:text-white"
                        : "border-transparent bg-white text-ink-900 group-hover:bg-brand-600 group-hover:text-white",
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
