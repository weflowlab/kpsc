"use client";

/* ==========================================================================
   서브 페이지 내비게이션 (원본 .m_submenu_back / #mobile-position)
   원본 재현 포인트
   - PC(1281px 이상): .m_submenu_back — 배경 #EAEAEC, 가운데 정렬 버튼
     · 기본  .m_submenu_bu     흰 배경 + 1px #BAB9B9 테두리, 글자 #000
     · hover/활성 .m_submenu_bu_on  배경 #303030 + 1px #000, 글자 #fff
     · 전환 0.7s (원본 transition-duration)
   - 그 미만: #mobile-position .mobile-select-menu — 2단 드롭다운 바
     · 46px, 배경 #F4F5F9, 상하 1px #DDD, 좌우 50% 분할 + 가운데 1px 구분선
     · 타이틀 14px/#000, pl 15px, 우측 셰브론(열리면 위로 회전)
     · 드롭다운: 바 아래(44px) 흰 패널, 1px #DDD, p 15px, 항목 13px/30px,
       활성·hover #FF9300
     · 왼쪽: 대메뉴 목록(각 첫 서브로 이동) / 오른쪽: 현재 그룹 서브메뉴
   ========================================================================== */

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV, type NavItem } from "@/lib/site-config";

/* 원본 .mobile-select-arrow — 열림 상태(showOn)면 위로 뒤집힌다 */
function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden
      width="12"
      height="8"
      viewBox="0 0 12 8"
      fill="none"
      stroke="#7b7b7b"
      strokeWidth="2"
      className={`mr-[15px] transition-transform duration-[350ms] ${open ? "rotate-180" : ""}`}
    >
      <polyline points="1,1.5 6,6.5 11,1.5" />
    </svg>
  );
}

export default function SubNav({ group }: { group: NavItem }) {
  const pathname = usePathname();
  /* 모바일 드롭다운 개폐 — 한 번에 하나만 */
  const [open, setOpen] = useState<"main" | "sub" | null>(null);

  const currentChild = group.children.find((c) => c.href === pathname);

  return (
    <div className="w-full">
      {/* ================================================================
          PC — 가로 탭바 (원본 .m_submenu_back)
          ================================================================ */}
      <nav className="hidden bg-[#EAEAEC] xl:block">
        <div className="container-mid py-3 text-center">
          <ul className="inline-flex flex-wrap justify-center gap-2">
            {group.children.map((child) => {
              const active = pathname === child.href;
              return (
                <li key={child.href}>
                  <Link
                    href={child.href}
                    aria-current={active ? "page" : undefined}
                    className={[
                      "inline-block border px-5 text-[13px] leading-[35px] duration-700",
                      active
                        ? "border-black bg-[#303030] text-white"
                        : "border-[#BAB9B9] bg-white text-black hover:border-black hover:bg-[#303030] hover:text-white",
                    ].join(" ")}
                  >
                    {child.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* ================================================================
          모바일/태블릿 — 원본 .mobile-select-menu 2단 드롭다운 바
          ================================================================ */}
      <div className="grid h-[46px] grid-cols-2 border-y border-[#DDDDDD] bg-[#F4F5F9] xl:hidden">
        {/* 1단 — 대메뉴 */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen(open === "main" ? null : "main")}
            aria-expanded={open === "main"}
            className="flex h-full w-full items-center justify-between pl-[15px] text-[14px] text-black"
          >
            {group.label}
            <Chevron open={open === "main"} />
          </button>
          {open === "main" && (
            <ul className="absolute top-[44px] left-0 z-[2000] w-full border border-[#DDDDDD] bg-white p-[15px]">
              {NAV.map((g) => (
                <li key={g.label}>
                  <Link
                    href={g.children[0].href}
                    onClick={() => setOpen(null)}
                    className={`block w-full text-[13px] leading-[30px] ${
                      g.label === group.label
                        ? "text-[#FF9300]"
                        : "text-[#333] hover:text-[#FF9300]"
                    }`}
                  >
                    {g.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 2단 — 현재 그룹 서브메뉴 (좌측에 원본 centerbar 구분선) */}
        <div className="relative">
          <span
            aria-hidden
            className="absolute top-[11px] left-0 h-[24px] w-px bg-[#DDDDDD]"
          />
          <button
            type="button"
            onClick={() => setOpen(open === "sub" ? null : "sub")}
            aria-expanded={open === "sub"}
            className="flex h-full w-full items-center justify-between pl-[15px] text-[14px] text-black"
          >
            {currentChild?.label ?? "선택"}
            <Chevron open={open === "sub"} />
          </button>
          {open === "sub" && (
            <ul className="absolute top-[44px] left-0 z-[2000] w-full border border-[#DDDDDD] bg-white p-[15px]">
              {group.children.map((child) => (
                <li key={child.href}>
                  <Link
                    href={child.href}
                    onClick={() => setOpen(null)}
                    className={`block w-full text-[13px] leading-[30px] ${
                      child.href === pathname
                        ? "text-[#FF9300]"
                        : "text-[#333] hover:text-[#FF9300]"
                    }`}
                  >
                    {child.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
