"use client";

/* ==========================================================================
   우측 고정 퀵메뉴 바 (#right_long_bar_layer)
   원본 재현 포인트
   - 평소에는 화면 밖(right: -180px)에 숨어 있다가 스크롤이 시작되면 슬라이드 인
   - 들어올 때는 0.65초 지연, 최상단 복귀 시에는 지연 없이 즉시 후퇴
   - 1280px 이하에서는 카카오 플로팅 버튼만 노출
   ========================================================================== */

import Link from "next/link";
import { useEffect, useState } from "react";
import { COMPANY, QUICK_MENU, QUICK_MENU_HOURS } from "@/lib/site-config";

export default function QuickBar() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* ================================================================
          PC 퀵바 — 1281px 이상에서만 노출
          ================================================================ */}
      <aside
        aria-label="퀵메뉴"
        className="fixed top-1/2 z-40 hidden w-[145px] -translate-y-1/2 rounded-l-xl bg-white shadow-[0_12px_40px_-10px_rgba(15,23,42,0.25)] xl:block"
        style={{
          right: shown ? 0 : -180,
          transition: "right .35s ease",
          transitionDelay: shown ? "0.65s" : "0s",
        }}
      >
        {/* 헤딩 */}
        <div className="rounded-tl-xl bg-brand-600 px-4 py-3 text-center">
          <span className="font-mont text-[11px] font-bold tracking-[0.15em] text-white">
            QUICK MENU
          </span>
        </div>

        {/* 링크 목록 */}
        <ul className="border-b border-ink-200 py-2">
          {QUICK_MENU.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block px-4 py-[7px] text-[12px] text-ink-500 transition-colors hover:text-brand-600"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* 고객센터 / 상담시간 */}
        <div className="px-4 py-4">
          <p className="mb-1 text-[10px] font-bold tracking-[0.1em] text-ink-400 uppercase">
            고객센터
          </p>
          <a
            href={`tel:${COMPANY.tel}`}
            className="block text-[14px] font-bold text-ink-900"
          >
            {COMPANY.tel}
          </a>

          <p className="mt-3 mb-1 text-[10px] font-bold tracking-[0.1em] text-ink-400 uppercase">
            상담시간
          </p>
          <ul className="space-y-0.5 text-[11px] leading-snug text-ink-500">
            {QUICK_MENU_HOURS.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      </aside>

      {/* ================================================================
          모바일 카카오 플로팅 버튼 — 원본 index/kakao_icon.png
          ================================================================ */}
      <a
        href="https://pf.kakao.com/_VqFIX"
        target="_blank"
        rel="noreferrer noopener"
        aria-label="카카오톡 상담 (이미지 자리: 카카오 아이콘)"
        className="fixed top-[300px] z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#FEE500] text-[10px] font-bold text-[#3C1E1E] shadow-lg xl:hidden"
        style={{
          right: shown ? "2%" : -60,
          transition: "right .35s ease",
          transitionDelay: shown ? "0.65s" : "0s",
        }}
      >
        TALK
      </a>
    </>
  );
}
