/* ==========================================================================
   메인 히어로 — CSS 전용 3장 크로스페이드 배너
   원본 재현 포인트
   - 슬라이더 라이브러리 없이 div 3장을 겹쳐두고 animation-delay 음수값으로
     위상차를 준다. 총 15초 루프 / 3장 → 전환 간격 5초
   - 배경은 Ken Burns 줌(scale 1.0 → 1.05), 최초 진입 시 blur(25px) → 0
   - 텍스트는 3D 플립 인(rotateX 15deg → 0) + 배지·제목·설명 0.3초 간격 stagger
   - 페이지네이션/화살표 없음 (원본에 조작 UI 자체가 없음)
   ========================================================================== */

import Image from "next/image";
import { HERO_SLIDES } from "@/lib/content/main";
import { HERO_IMAGES } from "@/lib/images";

/* 슬라이드별 애니메이션 위상차 — 원본 0s / -10s / -5s */
const DELAYS = ["0s", "-10s", "-5s"];

export default function Hero() {
  return (
    <section className="font-pretendard relative h-[70vh] w-full overflow-hidden lg:h-[100vh]">
      {/* ================================================================
          배경 레이어 — 3장 크로스페이드
          ================================================================ */}
      <div className="hero-stage absolute inset-0">
        {HERO_SLIDES.map((slide, i) => (
          <div
            key={slide.badge}
            className="hero-slide absolute inset-0"
            style={{ animationDelay: DELAYS[i] }}
            aria-hidden={i > 0}
          >
            <Image
              src={HERO_IMAGES[i]}
              alt=""
              fill
              sizes="100vw"
              priority={i === 0}
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* 딤 오버레이 — 원본 rgba(0,0,0,.4) → .35(20%) → .45(100%) 세로 그라데이션 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,.4) 0%, rgba(0,0,0,.35) 20%, rgba(0,0,0,.45) 100%)",
        }}
      />

      {/* ================================================================
          텍스트 패널 — grid 겹침 + 부유(±12px, 6초) 애니메이션
          ================================================================ */}
      {/* 투명 헤더가 상단을 덮고 있어 100vh 정중앙에 두면 위로 치우쳐 보인다.
          헤더 높이의 절반만큼 내려서 눈에 보이는 영역의 가운데에 가깝게 맞춘다.
          (모바일 헤더 = 로고행 64px + 슬라이더 메뉴 41px ≒ 105px) */}
      <div className="relative z-10 flex h-full items-center pt-[52px] lg:pt-[64px]">
        <div className="container-wide">
          <div className="hero-panel grid">
            {HERO_SLIDES.map((slide, i) => (
              <div
                key={slide.badge}
                className="hero-text text-center"
                style={{ ["--hero-delay" as string]: DELAYS[i] }}
              >
                {/* 배지 — stagger +0.2s */}
                <span
                  className="hero-line mb-5 inline-block rounded-full px-5 py-2 text-[13px] font-semibold tracking-[1px] text-white lg:text-[15px]"
                  style={{
                    ["--hero-step" as string]: "0.2s",
                    background: "linear-gradient(135deg, #0072FF, #00C6FF)",
                    boxShadow: "0 8px 24px rgba(0,114,255,0.3)",
                  }}
                >
                  ✨ {slide.badge}
                </span>

                {/* 제목 — stagger +0.5s */}
                <h2
                  className="hero-line text-[20px] leading-[30px] font-semibold tracking-[-0.04em] text-white lg:text-[41px] lg:leading-[1.25] lg:tracking-[0.08em]"
                  style={{ ["--hero-step" as string]: "0.5s" }}
                >
                  {slide.title[0]}
                  <br />
                  {slide.title[1]}
                </h2>

                {/* 설명 — stagger +0.8s */}
                <p
                  className="hero-line mt-4 text-[14px] tracking-[-0.02em] text-white/85 lg:mt-6 lg:text-[20px] lg:tracking-[0.04em]"
                  style={{ ["--hero-step" as string]: "0.8s" }}
                >
                  {slide.description}
                </p>

                {/* 보조 설명 — 있는 슬라이드만, stagger +1.1s */}
                {slide.descriptionSub && (
                  <p
                    className="hero-line mx-auto mt-2 max-w-[34ch] text-[13px] tracking-[-0.02em] text-white/70 lg:mt-3 lg:max-w-none lg:text-[17px] lg:tracking-[0.04em]"
                    style={{ ["--hero-step" as string]: "1.1s" }}
                  >
                    {slide.descriptionSub}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
