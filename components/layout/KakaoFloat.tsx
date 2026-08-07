"use client";

/* ==========================================================================
   우측 카카오톡 플로팅 버튼 (원본 #right_layer > .right_layer_wrap_480)
   원본 재현 포인트
   - 원본의 우측 퀵메뉴 바(#right_long_bar_layer)는 마크업 자체가 주석 처리되어
     있어 실제로는 존재하지 않는다. 우측에 남는 건 이 카톡 아이콘 하나뿐이다.
   - 위치 top:300px, 초기값 right:-60px (화면 밖)
   - 스크롤이 시작되면(scrollTop > 0) right:5px 로 슬라이드 인 → 계속 노출
   - 최상단(scrollTop === 0)으로 돌아왔을 때만 다시 right:-60px 로 숨김
   - transition: right 0.35s ease
     · 들어올 때는 transition-delay 0.65s (늦게 등장)
     · 나갈 때는 transition-delay 0s (즉시 후퇴)
   ========================================================================== */

import { useEffect, useState } from "react";
import { KakaoIcon } from "@/components/common/BrandIcons";

export default function KakaoFloat() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href="https://pf.kakao.com/_VqFIX"
      target="_blank"
      rel="noreferrer noopener"
      aria-label="카카오톡 상담"
      title="카카오톡 상담"
      className="fixed top-[300px] z-[997] block rounded-full shadow-lg hover:scale-105"
      style={{
        right: shown ? 5 : -60,
        /* right 는 원본과 동일한 0.35s, hover 확대는 별도 트랜지션 */
        transition: "right 0.35s ease, transform 0.3s ease",
        transitionDelay: shown ? "0.65s, 0s" : "0s, 0s",
      }}
    >
      <KakaoIcon size={54} className="block" />
    </a>
  );
}
