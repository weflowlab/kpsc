"use client";

/* ==========================================================================
   최상단 이동 버튼 (#goTopBtn)
   원본 재현 포인트
   - scrollTop > 0 일 때만 노출 (fade in 300ms / fade out 300ms)
   - 클릭 시 700ms swing 이징으로 최상단 이동
   - 원본은 1280px 이하에서 숨김 처리했으나, 접근성을 위해 전 해상도 노출로 변경
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
        "fixed right-[1%] bottom-6 z-50 flex h-11 w-11 items-center justify-center rounded-full",
        "bg-ink-900/85 text-white shadow-lg backdrop-blur-sm transition-all duration-300",
        "hover:bg-brand-600",
        shown ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
      ].join(" ")}
    >
      <span aria-hidden className="text-sm leading-none">
        ▲
      </span>
    </button>
  );
}
