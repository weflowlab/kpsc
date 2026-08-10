"use client";

/* ==========================================================================
   모바일 가로 슬라이더 메뉴 (.m_main_slider_menu)
   원본 재현 포인트
   - 767px 이하에서만 노출. 고정 헤더의 일부라 흐름에서 빠져 있다.
   - 원본은 Owl Carousel 의 loop:true 였는데, 클론 슬라이드가 끼어들며
     끝에서 되감길 때 빈 칸/점프가 생겼다. 여기서는 무한 루프를 쓰지 않고
     "끝에서 멈추는" 유한 스크롤 스냅으로 대체한다. (양방향 스와이프 정상)
   - 우측 토글 버튼 클릭 시 하위 메뉴가 그리드로 slideToggle
   ========================================================================== */

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { NAV } from "@/lib/site-config";

/* 슬라이더에 노출되는 축약 라벨 — 원본 텍스트 그대로 */
const SLIDER_LABELS = ["KPSC소개", "인사말", "조직 구성", "사업/서비스", "활동/소식"];

type Props = {
  /** 메뉴 이동 시 헤더의 열린 메뉴를 함께 닫는다 */
  onNavigate?: () => void;
};

export default function MobileSliderMenu({ onNavigate }: Props) {
  const [open, setOpen] = useState(false);

  /* 트랙 — 좌우 끝에 닿았는지 여부로 페이드 힌트를 켠다 */
  const trackRef = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState({ left: false, right: false });

  const syncEdge = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setEdge({ left: el.scrollLeft > 1, right: el.scrollLeft < max - 1 });
  }, []);

  useEffect(() => {
    syncEdge();
    window.addEventListener("resize", syncEdge);
    return () => window.removeEventListener("resize", syncEdge);
  }, [syncEdge]);

  /* 한 번에 트랙 폭의 70% 만큼 이동 — 끝에서는 자연스럽게 멈춘다(루프 없음) */
  const step = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.7, behavior: "smooth" });
  };

  return (
    <div className="border-b border-ink-200 bg-white md:hidden">
      <div className="relative flex items-stretch">
        {/* 좌우 페이드 — 더 스와이프할 영역이 남아 있음을 알리는 힌트 */}
        <span
          aria-hidden
          className={[
            "pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-white to-transparent transition-opacity duration-200",
            edge.left ? "opacity-100" : "opacity-0",
          ].join(" ")}
        />
        <span
          aria-hidden
          className={[
            "pointer-events-none absolute inset-y-0 right-11 z-10 w-6 bg-gradient-to-l from-white to-transparent transition-opacity duration-200",
            edge.right ? "opacity-100" : "opacity-0",
          ].join(" ")}
        />

        {/* 가로 스와이프 영역 — 터치는 네이티브 스크롤, 클릭은 아래 화살표로 */}
        <ul
          ref={trackRef}
          onScroll={syncEdge}
          className="scroll-x no-scrollbar flex flex-1 snap-x gap-1 overscroll-x-contain px-3 py-2"
        >
          {NAV.map((group, i) => (
            <li key={group.label} className="shrink-0 snap-start">
              <Link
                href={group.children[0].href}
                onClick={onNavigate}
                className="block rounded-full px-3 py-1.5 text-[13px] whitespace-nowrap text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-900"
              >
                {SLIDER_LABELS[i]}
              </Link>
            </li>
          ))}
        </ul>

        {/* 좌우 이동 버튼 — 스와이프가 어려운 환경(마우스)용 보조 조작.
            더 이동할 곳이 없으면 비활성화되어 되감기(무한 루프)가 없다. */}
        <button
          type="button"
          onClick={() => step(-1)}
          disabled={!edge.left}
          aria-label="메뉴 왼쪽으로"
          className="z-20 w-6 shrink-0 text-[11px] text-ink-400 disabled:opacity-0"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => step(1)}
          disabled={!edge.right}
          aria-label="메뉴 오른쪽으로"
          className="z-20 w-6 shrink-0 text-[11px] text-ink-400 disabled:opacity-0"
        >
          ›
        </button>

        {/* 토글 버튼 — 원본 m_main_slider_menu_off/on.gif */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="전체 메뉴 펼치기"
          className="z-20 flex w-11 shrink-0 items-center justify-center border-l border-ink-200 text-ink-400"
        >
          <span
            aria-hidden
            className={`text-[10px] transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          >
            ▼
          </span>
        </button>
      </div>

      {/* 펼침 서브 리스트 — 원본은 4열 그리드(width 23.37%) */}
      <div
        className={[
          "overflow-hidden transition-[max-height] duration-300",
          open ? "max-h-40" : "max-h-0",
        ].join(" ")}
      >
        <ul className="grid grid-cols-2 gap-px bg-ink-200 sm:grid-cols-4">
          {NAV.map((group) => (
            <li key={group.label}>
              <Link
                href={group.children[0].href}
                onClick={() => {
                  setOpen(false);
                  onNavigate?.();
                }}
                className="block bg-white px-2 py-2.5 text-center text-[11px] text-ink-500 transition-colors hover:bg-[#C5C5C5] hover:text-white"
              >
                {group.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
