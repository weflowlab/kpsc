"use client";

/* ==========================================================================
   우측 카카오톡 플로팅 버튼 (원본 #right_layer > .right_layer_wrap_480)
   원본 재현 포인트
   - 원본의 우측 퀵메뉴 바(#right_long_bar_layer)는 마크업 자체가 주석 처리되어
     있어 실제로는 존재하지 않는다. 우측에 남는 건 이 카톡 아이콘 하나뿐이다.
   - 위치 top:300px, 화면 밖(right:-60px)에서 right:2% 로 슬라이드
   - transition: right 0.35s ease
   - 스크롤 중에는 노출, 스크롤이 멈추면 다시 오른쪽으로 들어간다.
     (원본 JS 는 최상단 복귀 시에만 숨기지만, 요청받은 동작에 맞춰
      스크롤 정지 감지 방식으로 구현)
   ========================================================================== */

import { useEffect, useRef, useState } from "react";

/** 스크롤이 멈춘 것으로 간주하기까지의 대기 시간(ms) */
const IDLE_DELAY = 900;

export default function KakaoFloat() {
  const [shown, setShown] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => {
      /* 스크롤이 발생하는 동안에는 노출 */
      setShown(true);

      /* 마지막 스크롤 이후 일정 시간이 지나면 다시 숨김 */
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setShown(false), IDLE_DELAY);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  return (
    <a
      href="https://pf.kakao.com/_VqFIX"
      target="_blank"
      rel="noreferrer noopener"
      aria-label="카카오톡 상담 (이미지 자리: 카카오 아이콘)"
      className="fixed top-[300px] z-[997] flex h-14 w-14 items-center justify-center rounded-xl bg-[#FEE500] text-[11px] font-bold text-[#3C1E1E] shadow-lg"
      style={{
        right: shown ? "2%" : -60,
        transition: "right 0.35s ease",
      }}
    >
      TALK
    </a>
  );
}
