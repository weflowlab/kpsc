"use client";

/* ==========================================================================
   우측 퀵메뉴 바 (원본 #right_long_bar_layer / css/right_long_bar.css)
   원본 재현 포인트
   - 서브 페이지에만 존재한다. (메인 index 는 마크업이 주석 처리되어 없음)
   - 뷰포트 1564px 이상에서만 노출 — 그 미만에서는 퀵바가 숨고 카카오톡
     플로트(.right_layer_wrap_480)가 대신 노출된다. (미디어쿼리 상호 배타)
   - position:fixed; top:0; width:180px; height:100vh; background:#1E1E1E
   - 초기값 right:-181px (화면 밖). 스크롤이 시작되면(scrollTop > 0)
     right:0 으로 슬라이드 인, 최상단 복귀 시에만 다시 숨김
   - transition: all 0.65s ease
     · 들어올 때 transition-delay 0s / 나갈 때 0.35s
   - 콘텐츠: QUICK MENU 박스 버튼 4 → 라인 버튼 3 → 2열 그리드 버튼 2
     → 고객센터 전화 → 운영시간(KPSC/KPSM). 수치는 원본 CSS 그대로.
   - 레이어 순서: 원본은 퀵바(998) < 헤더(#fixed-menu 9999) < 최상단
     버튼(#goTopBtn 10000). 여기서는 헤더가 z-50 이므로 퀵바를 z-40 으로
     내려 헤더/메뉴바를 덮지 않게 한다. (TopButton 은 z-[60])
   - 전화 아이콘 깜빡임: 원본은 2프레임 gif(0.5초)지만, 여기서는 정지
     이미지에 최상단 버튼(TopButton)과 동일한 .animate-blink(0.9s)를 걸어
     두 요소의 깜빡임 타이밍을 일치시켰다.
   ========================================================================== */

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { QUICK_TEL_ICON } from "@/lib/images";
import { BUSINESS_HOURS, COMPANY } from "@/lib/site-config";

/* 원본 마크업의 링크·라벨 그대로 (라벨은 GNB 와 달리 축약형이다) */
const BOX_LINKS = [
  { label: "설립 목적", href: "/about/purpose" },
  { label: "파트너사", href: "/about/partners" },
  { label: "인사말", href: "/greeting" },
  { label: "방향성", href: "/greeting/direction" },
];

const LINE_LINKS = [
  { label: "운영진 소개", href: "/organization/team" },
  { label: "갤러리", href: "/organization/gallery" },
  { label: "제공 서비스", href: "/services" },
];

const GRID_LINKS = [
  { label: "조합 활동", href: "/news/activities" },
  { label: "공지/뉴스", href: "/news/notice" },
];

/* QUICK MENU / 고객센터 / 상담시간 제목 위의 노란 포인트 바 */
function TitleBar({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`mb-[2px] h-[2px] w-[14px] bg-[#FFB200] ${className}`} />
  );
}

export default function QuickMenu() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <aside
      aria-label="퀵메뉴"
      /* 운영시간이 두 벌로 늘어나 화면이 낮으면 아래가 잘린다.
         no-scrollbar 로 스크롤바는 감추고 세로 스크롤만 허용한다. */
      className="no-scrollbar fixed top-0 right-0 z-40 hidden h-screen w-[180px] overflow-x-hidden overflow-y-auto bg-[#1E1E1E] min-[1564px]:block"
      style={{
        /* 숨김을 right:-181px 로 두면 문서 폭이 늘어나 가로 스크롤이 생긴다.
           right:0 으로 붙여 두고 이동은 transform 으로 처리한다. */
        transform: shown ? "translateX(0)" : "translateX(101%)",
        transition: "transform 0.65s ease",
        transitionDelay: shown ? "0s" : "0.35s",
      }}
    >
      <div className="mt-[210px] pb-[40px]">
        {/* ============ QUICK MENU — 박스 버튼 4 ============ */}
        <TitleBar className="ml-[20px]" />
        <div className="pl-[20px] text-[13px] leading-[normal] font-bold text-[#F5F5F5]">
          QUICK MENU
        </div>
        {BOX_LINKS.map((link) => (
          <Link key={link.href} href={link.href} className="block">
            <div className="mx-auto mt-[5px] w-[140px] cursor-pointer border-b border-[#7F7F7F] bg-[#7F7F7F] pl-[9px] text-left text-[12px] leading-[30px] text-[#F5F5F5] duration-700 hover:border-[#999] hover:bg-[#454545] hover:text-white">
              {link.label}
            </div>
          </Link>
        ))}

        {/* ============ 라인 버튼 3 ============ */}
        <div className="mt-[27px]">
          {LINE_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="block">
              <div className="mx-auto w-[140px] cursor-pointer border-b border-[#555] pl-[9px] text-left text-[12px] leading-[30px] text-[#F5F5F5] duration-700 hover:bg-[#454545] hover:text-white">
                {link.label}
              </div>
            </Link>
          ))}
        </div>

        {/* ============ 2열 그리드 버튼 ============ */}
        <ul className="mx-auto mt-[27px] flex w-[152px] flex-wrap">
          {GRID_LINKS.map((link) => (
            <li key={link.href} className="mt-[6px] ml-[6px] w-[67px] text-center">
              <Link
                href={link.href}
                className="inline-block w-full cursor-pointer bg-[#7F7F7F] text-[11px] leading-[30px] text-[#F5F5F5] duration-700 hover:bg-[#E0E0E0] hover:text-[#222]"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* ============ 고객센터 ============ */}
        <div className="mx-auto mt-[27px] w-[140px]">
          <TitleBar />
          <div className="text-[13px] leading-[normal] font-bold text-[#F5F5F5]">
            고객센터
          </div>
          <div className="mt-[3px] flex items-center gap-1 text-[15px] font-bold text-[#F5F5F5]">
            {/* TopButton 셰브론과 같은 keyframes — 깜빡임 동기화 */}
            <Image
              src={QUICK_TEL_ICON}
              alt=""
              width={22}
              height={22}
              className="animate-blink"
            />
            {COMPANY.tel}
          </div>
        </div>

        {/* ============ 운영시간 — KPSC / KPSM 두 벌 ============
            바 폭이 140px 뿐이라 라벨 박스를 옆에 두면 시간이 꺾인다.
            라벨을 윗줄, 시간을 아랫줄로 쌓아 한 줄씩 온전히 보이게 한다. */}
        <div className="mx-auto mt-[27px] w-[140px]">
          <TitleBar />
          <div className="text-[13px] leading-[normal] font-bold text-[#F5F5F5]">
            운영시간
          </div>

          {BUSINESS_HOURS.map((group) => (
            <div key={group.brand} className="mt-[10px]">
              <div className="font-mont text-[12px] leading-[16px] font-bold text-[#FFB200]">
                {group.brand}
              </div>
              {group.rows.map((row) => (
                <div key={row.label} className="mt-[3px]">
                  <div className="text-[11px] leading-[15px] text-[#BDBDBD]">
                    {row.label}
                  </div>
                  <div className="text-[12px] leading-[16px] text-[#F5F5F5]">
                    {row.time}
                  </div>
                </div>
              ))}
              <div className="mt-[4px] text-[11px] leading-[15px] font-bold text-[#FFB200]">
                {group.note}
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
