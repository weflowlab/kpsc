"use client";

/* ==========================================================================
   숫자 카운트업 (원본 .Board-Counter — jquery counterUp)
   원본 설정 그대로: 10ms 간격으로 900ms 동안 0 → 값으로 올라간다.
   마운트될 때마다 재생 — 게시판 목록은 카테고리/페이지 변경 시 Reveal 이
   리마운트되므로 그때도 다시 올라간다.
   ========================================================================== */

import { useEffect, useState } from "react";

export default function CountUp({ value }: { value: number }) {
  const [now, setNow] = useState(0);

  useEffect(() => {
    if (value <= 0) {
      setNow(value);
      return;
    }
    const TIME = 900;
    const DELAY = 10;
    const steps = Math.ceil(TIME / DELAY);
    let step = 0;
    const timer = setInterval(() => {
      step += 1;
      setNow(Math.min(value, Math.ceil((value / steps) * step)));
      if (step >= steps) clearInterval(timer);
    }, DELAY);
    return () => clearInterval(timer);
  }, [value]);

  return <>{now}</>;
}
