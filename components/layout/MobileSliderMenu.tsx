"use client";

/* ==========================================================================
   모바일 가로 슬라이더 메뉴 (.m_main_slider_menu)
   원본 재현 포인트
   - 767px 이하에서만 노출. Owl Carousel 대신 CSS 가로 스크롤 스냅으로 대체
   - 우측 토글 버튼 클릭 시 하위 메뉴가 4열 그리드로 slideToggle
   ========================================================================== */

import Link from "next/link";
import { useState } from "react";
import { NAV } from "@/lib/site-config";

/* 슬라이더에 노출되는 축약 라벨 — 원본 텍스트 그대로 */
const SLIDER_LABELS = [
  "KPSC소개",
  "인사말",
  "조직 구성",
  "사업/서비스",
  "활동/소식",
];

export default function MobileSliderMenu() {
  const [open, setOpen] = useState(false);

  return (
    /* 헤더가 fixed 이므로 모바일에서는 헤더 높이(64px)만큼 내려서 겹치지 않게 한다.
       768px 이상에서는 이 메뉴 자체가 숨겨지므로 여백이 필요 없다. */
    <div className="mt-[64px] border-b border-ink-200 bg-white md:hidden md:mt-0">
      <div className="flex items-stretch">
        {/* 가로 스와이프 영역 — 스크롤 스냅으로 Owl Carousel 동작 대체 */}
        <ul className="scroll-x flex flex-1 snap-x snap-mandatory gap-1 px-3 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {NAV.map((group, i) => (
            <li key={group.label} className="shrink-0 snap-start">
              <Link
                href={group.children[0].href}
                className="block rounded-full px-3 py-1.5 text-[12px] whitespace-nowrap text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-900"
              >
                {SLIDER_LABELS[i]}
              </Link>
            </li>
          ))}
        </ul>

        {/* 토글 버튼 — 원본 m_main_slider_menu_off/on.gif */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="전체 메뉴 펼치기"
          className="flex w-11 shrink-0 items-center justify-center border-l border-ink-200 text-ink-400"
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
