"use client";

/* ==========================================================================
   서브 페이지 내비게이션 (원본 .p_submenu_box / .m_submenu_back)
   원본 재현 포인트
   - PC(1281px 이상): 좌측 세로 사이드바. 대메뉴명 헤딩 + 하위 메뉴 목록
   - 그 이하: 상단 가로 탭 바로 전환
   - 현재 페이지는 p_submenu_bu_on 활성 스타일
   ========================================================================== */

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/lib/site-config";

export default function SubNav({ group }: { group: NavItem }) {
  const pathname = usePathname();

  return (
    <>
      {/* ================================================================
          PC — 좌측 세로 사이드바
          ================================================================ */}
      <nav className="hidden xl:block">
        {/* 대메뉴명 헤딩 */}
        <div className="rounded-t-lg bg-brand-600 px-6 py-7 text-center">
          <p className="text-[22px] font-bold text-white">{group.label}</p>
          <p className="font-mont mt-1 text-[11px] tracking-[0.2em] text-white/60 uppercase">
            {group.labelEn}
          </p>
        </div>

        {/* 하위 메뉴 */}
        <ul className="rounded-b-lg border border-t-0 border-ink-200">
          {group.children.map((child) => {
            const active = pathname === child.href;
            return (
              <li key={child.href} className="border-b border-ink-100 last:border-b-0">
                <Link
                  href={child.href}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "flex items-center justify-between px-5 py-3.5 text-[14px] transition-colors",
                    active
                      ? "bg-ink-50 font-bold text-brand-600"
                      : "text-ink-500 hover:bg-ink-50 hover:text-ink-900",
                  ].join(" ")}
                >
                  {child.label}
                  <span aria-hidden className="text-[10px] opacity-50">
                    ›
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ================================================================
          모바일/태블릿 — 상단 가로 탭 바
          ================================================================ */}
      <nav className="xl:hidden">
        <ul className="scroll-x flex border-b border-ink-200">
          {group.children.map((child) => {
            const active = pathname === child.href;
            return (
              <li key={child.href} className="flex-1">
                <Link
                  href={child.href}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "block border-b-2 px-4 py-3 text-center text-[13px] whitespace-nowrap transition-colors",
                    active
                      ? "border-brand-600 font-bold text-brand-600"
                      : "border-transparent text-ink-400 hover:text-ink-900",
                  ].join(" ")}
                >
                  {child.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
