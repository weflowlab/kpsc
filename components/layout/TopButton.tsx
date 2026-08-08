"use client";

/* ==========================================================================
   최상단 이동 버튼 (#goTopBtn)
   원본 재현 포인트
   - scrollTop > 0 일 때만 노출 (fade in / out 300ms)
   - 원본 #goTopBtn 과 동일하게 right:1% / bottom:0 (화면 하단에 붙음)
   - 클릭 시 최상단으로 부드럽게 이동
   - 파란 사각 버튼(44×44, 위쪽 모서리만 라운드) + 흰색 ^(셰브론) 아이콘
   - 버튼 배경은 고정, ^ 아이콘만 천천히 깜빡인다 (prefers-reduced-motion 이면 정지)
   - 원본 z-index:10000 — 헤더(9999)·퀵메뉴(998)보다 항상 위에 온다.
     여기서는 헤더 z-50 / 퀵메뉴 z-40 이므로 z-[60] 으로 최상위 유지.
   ========================================================================== */

import { useEffect, useState } from "react";

export default function TopButton() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="맨 위로 이동"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={[
        "fixed right-[1%] bottom-0 z-[60] flex h-11 w-11 items-center justify-center rounded-t-md",
        "bg-brand-600 text-white shadow-lg transition-opacity duration-300 hover:bg-brand-700",
        shown ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
      ].join(" ")}
    >
      {/* ^ 셰브론 아이콘 — 이 아이콘만 깜빡인다 */}
      <svg
        className="animate-blink"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M5 15l7-7 7 7" />
      </svg>
    </button>
  );
}
