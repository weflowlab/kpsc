"use client";

/* ==========================================================================
   모바일 가로 슬라이더 메뉴 (.m_main_slider_menu)
   원본 재현 포인트
   - 767px 이하에서만 노출. 고정 헤더의 일부라 흐름에서 빠져 있다.
   - 원본 Owl Carousel 의 loop:true 재현 — 메뉴 5개를 3벌 이어붙이고
     항상 가운데 벌 안에 머물도록 스크롤 위치를 조용히 되감는다.
     (한 벌 폭의 0.5~1.5배 범위를 벗어나면 즉시 ±한 벌 폭 만큼 점프.
     내용이 동일해 사용자는 이어지는 것처럼 느낀다 = 무한 루프)
   - 우측 토글 버튼 클릭 시 하위 메뉴가 그리드로 slideToggle
   ========================================================================== */

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { NAV } from "@/lib/site-config";

/* 슬라이더에 노출되는 축약 라벨 — 원본 텍스트 그대로 */
const SLIDER_LABELS = ["KPSC소개", "인사말", "조직 구성", "사업/서비스", "활동/소식"];

/* 무한 루프용 복제 벌 수 — 가운데(1번째) 벌에서 시작한다 */
const COPIES = 3;

type Props = {
  /** 메뉴 이동 시 헤더의 열린 메뉴를 함께 닫는다 */
  onNavigate?: () => void;
};

export default function MobileSliderMenu({ onNavigate }: Props) {
  const [open, setOpen] = useState(false);
  const trackRef = useRef<HTMLUListElement>(null);

  /* 시작 위치를 가운데 벌로 — 양방향 모두 스와이프 여지가 생긴다 */
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollLeft = el.scrollWidth / COPIES;
  }, []);

  /* 가운데 벌을 벗어나면 한 벌 폭 만큼 즉시 점프해 무한 루프를 만든다 */
  const loop = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const copyWidth = el.scrollWidth / COPIES;
    if (el.scrollLeft < copyWidth * 0.5) {
      el.scrollLeft += copyWidth;
    } else if (el.scrollLeft > copyWidth * 1.5) {
      el.scrollLeft -= copyWidth;
    }
  }, []);

  return (
    <div className="border-b border-ink-200 bg-white md:hidden">
      <div className="relative flex items-stretch">
        {/* 가로 스와이프 영역 — 3벌 복제 + 위치 되감기로 끝없이 넘어간다 */}
        <ul
          ref={trackRef}
          onScroll={loop}
          className="scroll-x no-scrollbar flex flex-1 gap-1 overscroll-x-contain px-3 py-1"
        >
          {Array.from({ length: COPIES }, (_, copy) =>
            NAV.map((group, i) => (
              <li key={`${copy}-${group.label}`} className="shrink-0">
                <Link
                  href={group.children[0].href}
                  onClick={onNavigate}
                  tabIndex={copy === 1 ? 0 : -1}
                  aria-hidden={copy !== 1}
                  className="block rounded-full px-3 py-1 text-[13px] whitespace-nowrap text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-900"
                >
                  {SLIDER_LABELS[i]}
                </Link>
              </li>
            ))
          )}
        </ul>

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
