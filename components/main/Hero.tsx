/* ==========================================================================
   메인 히어로 — CSS 전용 3장 크로스페이드 배너
   원본 재현 포인트
   - 슬라이더 라이브러리 없이 div 3장을 겹쳐두고 animation-delay 음수값으로
     위상차를 준다. 총 15초 루프 / 3장 → 전환 간격 5초
   - 배경은 Ken Burns 줌(scale 1.0 → 1.05), 최초 진입 시 blur(25px) → 0
   - 텍스트는 3D 플립 인(rotateX 15deg → 0) + 배지·제목·설명 0.3초 간격 stagger
   - 페이지네이션/화살표 없음 (원본에 조작 UI 자체가 없음)
   ========================================================================== */

import { Fragment } from "react";
import Image from "next/image";
import { HERO_SLIDES } from "@/lib/content/main";
import { HERO_IMAGES } from "@/lib/images";

/* 슬라이드별 애니메이션 위상차 — 원본 0s / -10s / -5s */
const DELAYS = ["0s", "-10s", "-5s"];

/* 히어로 카피 렌더 — "\n" 은 항상 줄바꿈, "||" 는 모바일에서만 줄바꿈(PC 는 공백) */
function renderCopy(text: string) {
  return text.split("\n").map((line, li) => (
    <Fragment key={li}>
      {li > 0 && <br />}
      {line.split("||").map((seg, si, arr) => (
        <Fragment key={si}>
          {seg}
          {si < arr.length - 1 && (
            <>
              <br className="lg:hidden" />
              <span className="hidden lg:inline"> </span>
            </>
          )}
        </Fragment>
      ))}
    </Fragment>
  ));
}

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
            {/* 딤 오버레이 — 슬라이드별. 어두운 사진은 진하게(흰 글씨),
                밝은 배경은 아주 연하게(어두운 글씨가 흰 이미지에서 읽히게) */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background: slide.lightBg
                  ? // 밝은 배경: 상단만 어둡게(흰 헤더 가시성). 본문 영역은 흰색 반투명 막을
                    // 얹어 배경 로고를 흐리게 → 어두운 글씨가 또렷하게 읽히도록
                    "linear-gradient(to bottom, rgba(0,0,0,.45) 0%, rgba(0,0,0,.25) 10%, rgba(255,255,255,.35) 20%, rgba(255,255,255,.62) 45%, rgba(255,255,255,.62) 80%, rgba(255,255,255,.5) 100%)"
                  : "linear-gradient(to bottom, rgba(0,0,0,.4) 0%, rgba(0,0,0,.35) 20%, rgba(0,0,0,.45) 100%)",
              }}
            />
          </div>
        ))}
      </div>

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

                {/* 제목 — stagger +0.5s. 밝은 배경 슬라이드는 어두운 글씨 */}
                <h2
                  className={`hero-line text-[20px] leading-[30px] font-semibold tracking-[-0.04em] lg:text-[41px] lg:leading-[1.25] lg:tracking-[0.08em] ${
                    slide.lightBg ? "text-ink-900" : "text-white"
                  }`}
                  style={{ ["--hero-step" as string]: "0.5s" }}
                >
                  {renderCopy(slide.title[0])}
                  <br />
                  {renderCopy(slide.title[1])}
                </h2>

                {/* 설명 — stagger +0.8s. "||" 지점에서 모바일만 줄바꿈 */}
                <p
                  className={`hero-line mt-4 text-[14px] tracking-[-0.02em] lg:mt-6 lg:text-[20px] lg:tracking-[0.04em] ${
                    slide.lightBg ? "text-ink-800" : "text-white/85"
                  }`}
                  style={{ ["--hero-step" as string]: "0.8s" }}
                >
                  {renderCopy(slide.description)}
                </p>

                {/* 보조 설명 — 있는 슬라이드만, stagger +1.1s
                    박스 없이 글자만으로 강조한다. 흰색 100% + 세미볼드에
                    그림자를 얹어 배경 사진 위에서도 또렷하게 읽히게 한다. */}
                {slide.descriptionSub && (
                  <p
                    className={`hero-line text-[13px] leading-[1.6] font-semibold tracking-[-0.04em] lg:text-[19px] lg:tracking-[0.02em] ${
                      slide.lightBg
                        ? "mt-1 text-ink-900 lg:mt-1.5"
                        : "mt-3 text-white lg:mt-6"
                    }`}
                    style={{
                      ["--hero-step" as string]: "1.1s",
                      textShadow: slide.lightBg
                        ? "none"
                        : "0 2px 10px rgba(0,0,0,0.6)",
                    }}
                  >
                    {renderCopy(slide.descriptionSub)}
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
