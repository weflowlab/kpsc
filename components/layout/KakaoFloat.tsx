"use client";

/* ==========================================================================
   우측 카카오톡 플로팅 버튼 (원본 #right_layer > .right_layer_wrap_480)
   원본 재현 포인트
   - 뷰포트 1564px 이상에서는 우측 퀵메뉴 바(QuickMenu)가 대신 노출되고
     이 버튼은 미디어쿼리로 숨겨진다. (원본 right_long_bar.css 상호 배타)
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
      className="fixed top-[300px] right-[5px] z-[997] block rounded-full shadow-lg min-[1564px]:hidden"
      style={{
        /* 숨김을 right:-60px 로 두면 iOS 에서 문서 폭이 늘어나 가로 스크롤이
           생긴다. right 는 5px 로 고정하고 이동은 transform 으로 처리한다. */
        transform: shown ? "translateX(0)" : "translateX(120%)",
        /* 원본과 동일한 0.35s — 들어올 때만 0.65s 지연 */
        transition: "transform 0.35s ease",
        transitionDelay: shown ? "0.65s" : "0s",
      }}
    >
      <KakaoIcon size={54} className="block" />
    </a>
  );
}
