"use client";

/* ==========================================================================
   메인 - PARTNERS 섹션 (원본 .excl- 블록)
   원본 재현 포인트
   - 배경 #F8F9FA, 섹션 패딩 120/80/40px
   - 카드 4장: PC 4열 → 1280px 이하 2열 → 768px 미만 가로 스와이프 슬라이더
   - 카드 hover: 부양(-10px) + 이미지 1.1배 줌 + 그레이스케일 해제
     + 아이콘 컬러 반전 + "자세히 보기 →" 좌→우 페이드인 (4중 연출)
   - 설명 줄 수가 달라도 "자세히 보기"는 모든 카드에서 같은 높이에 뜨도록
     카드를 세로 flex 로 구성하고 링크를 mt-auto 로 하단 정렬한다.
   모바일 슬라이더
   - 768px 미만에서만 트랙이 가로 스크롤 스냅으로 바뀌고 하단에 도트 표시.
     루프는 없고 첫/마지막 카드에서 멈춘다. 도트를 눌러 이동할 수도 있다.
   ========================================================================== */

import Link from "next/link";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import Reveal from "@/components/common/Reveal";
import { PARTNER_CARDS, PARTNERS_HEADING } from "@/lib/content/main";
import { PARTNER_IMAGES } from "@/lib/images";

export default function PartnersSection() {
  const trackRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);

  /* 현재 위치와 가장 가까운 카드의 인덱스를 도트에 반영한다.
     (카드 폭 + gap 을 직접 계산하지 않고 실제 offsetLeft 로 판정) */
  const syncActive = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const items = Array.from(el.children) as HTMLElement[];
    let nearest = 0;
    let min = Infinity;
    items.forEach((item, i) => {
      const distance = Math.abs(item.offsetLeft - el.scrollLeft);
      if (distance < min) {
        min = distance;
        nearest = i;
      }
    });
    setActive(nearest);
  }, []);

  const goTo = (i: number) => {
    const el = trackRef.current;
    const item = el?.children[i] as HTMLElement | undefined;
    if (!el || !item) return;
    el.scrollTo({ left: item.offsetLeft, behavior: "smooth" });
  };

  return (
    <section id="services" className="section-pad bg-section">
      <div className="container-wide">
        {/* ================================================================
            섹션 헤더 — 영문 배지 / 국문 제목 / 설명
            ================================================================ */}
        <Reveal className="mb-12 text-center lg:mb-16">
          <span className="font-mont inline-block rounded-full bg-brand-50 px-4 py-1.5 text-[13px] font-extrabold tracking-[0.15em] text-brand-600">
            {PARTNERS_HEADING.label}
          </span>
          <h2 className="font-mont mt-3 text-[34px] font-extrabold text-ink-800 lg:text-[60px]">
            {PARTNERS_HEADING.title}
          </h2>
          <p className="mt-1.5 text-[16px] font-bold text-ink-500 lg:text-[18px]">
            {PARTNERS_HEADING.description}
          </p>
        </Reveal>

        {/* ================================================================
            카드 트랙 — 모바일 가로 스와이프 / 768px 이상 2열 / 1280px 이상 4열
            ================================================================ */}
        {/* .scroll-x 대신 Tailwind 유틸을 쓴다 — overflow-x 가 md 이상에서
            visible 로 풀려야 카드 hover 부양/그림자가 잘리지 않는다 */}
        <ul
          ref={trackRef}
          onScroll={syncActive}
          className="no-scrollbar relative flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain md:grid md:grid-cols-2 md:gap-[30px] md:overflow-x-visible xl:grid-cols-4"
        >
          {PARTNER_CARDS.map((card, i) => (
            <Reveal
              as="li"
              key={card.num}
              delay={i * 0.1}
              className="w-full min-w-0 shrink-0 snap-start md:w-auto md:shrink"
            >
              <Link
                href={card.href}
                className="group flex h-full flex-col overflow-hidden rounded-[10px] border border-ink-200 bg-white transition-all duration-[400ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-brand-600 hover:shadow-[var(--shadow-card-hover)] xl:hover:-translate-y-[10px]"
              >
                {/* 이미지 박스 — 높이 260px, hover 시 scale 1.1 + 그레이스케일 해제 */}
                <div className="h-[220px] overflow-hidden md:h-[260px]">
                  <div className="relative h-full w-full grayscale-[10%] transition-all duration-[600ms] group-hover:scale-110 group-hover:grayscale-0">
                    <Image
                      src={PARTNER_IMAGES[i]}
                      alt={card.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* 텍스트 영역 */}
                <div className="flex flex-1 flex-col p-5 sm:p-6 lg:p-7">
                  {/* 번호 + 아이콘 (hover 시 컬러 반전) */}
                  <div className="mb-4 flex items-center justify-between">
                    <span className="font-mont text-[26px] font-extrabold text-brand-600">
                      {card.num}
                    </span>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-600 transition-colors duration-300 group-hover:bg-brand-600 group-hover:text-white">
                      <span aria-hidden className="text-sm">
                        ➜
                      </span>
                    </span>
                  </div>

                  <h3 className="text-[20px] font-bold text-ink-800 lg:text-[22px]">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-[1.6] text-ink-500 lg:text-[16px]">
                    {card.description}
                  </p>

                  {/* 링크 — 평소 숨김, hover 시 좌→우 슬라이드 인 */}
                  <span className="mt-auto block -translate-x-[10px] pt-5 text-[14px] font-bold text-brand-600 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                    자세히 보기 →
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>

        {/* ================================================================
            페이지네이션 도트 — 모바일 슬라이더에서만 노출
            ================================================================ */}
        <div className="mt-6 flex items-center justify-center gap-2 md:hidden">
          {PARTNER_CARDS.map((card, i) => (
            <button
              key={card.num}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`${i + 1}번째 카드 보기`}
              aria-current={active === i}
              className={[
                "h-2 rounded-full transition-all duration-300",
                active === i ? "w-6 bg-brand-600" : "w-2 bg-ink-300",
              ].join(" ")}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
