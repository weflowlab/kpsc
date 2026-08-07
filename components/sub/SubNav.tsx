"use client";

/* ==========================================================================
   서브 페이지 내비게이션 (원본 .m_submenu_back / #mobile-position)
   원본 재현 포인트
   - 좌측 사이드바(.p_submenu_box)는 원본에서 display:none 이라 실제로는
     보이지 않는다. 실제 서브메뉴는 서브 비주얼 바로 아래의 "가로 탭바"다.
   - PC(1281px 이상): .m_submenu_back — 배경 #EAEAEC, 가운데 정렬 버튼
     · 기본  .m_submenu_bu     흰 배경 + 1px #BAB9B9 테두리, 글자 #000
     · hover/활성 .m_submenu_bu_on  배경 #303030 + 1px #000, 글자 #fff
     · 전환 0.7s (원본 transition-duration)
   - 그 이하: #mobile-position — 대메뉴/서브메뉴 2단 셀렉트 드롭다운
   ========================================================================== */

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { NAV, type NavItem } from "@/lib/site-config";

export default function SubNav({ group }: { group: NavItem }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="w-full bg-[#EAEAEC]">
      {/* ================================================================
          PC — 가로 탭바 (원본 .m_submenu_back)
          ================================================================ */}
      <nav className="container-mid hidden py-3 text-center xl:block">
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
      </nav>

      {/* ================================================================
          모바일/태블릿 — 2단 셀렉트 (원본 #mobile-position)
          왼쪽: 대메뉴 / 오른쪽: 해당 그룹의 서브메뉴
          ================================================================ */}
      <div className="container-mid grid grid-cols-2 gap-2 py-2.5 xl:hidden">
        {/* 1단 — 대메뉴 */}
        <select
          aria-label="대메뉴 선택"
          value={group.label}
          onChange={(e) => {
            const next = NAV.find((g) => g.label === e.target.value);
            if (next) router.push(next.children[0].href);
          }}
          className="h-10 w-full border border-[#BAB9B9] bg-white px-3 text-[13px] text-black outline-none"
        >
          {NAV.map((g) => (
            <option key={g.label} value={g.label}>
              {g.label}
            </option>
          ))}
        </select>

        {/* 2단 — 서브메뉴 */}
        <select
          aria-label="서브메뉴 선택"
          value={group.children.some((c) => c.href === pathname) ? pathname : ""}
          onChange={(e) => router.push(e.target.value)}
          className="h-10 w-full border border-[#BAB9B9] bg-white px-3 text-[13px] text-black outline-none"
        >
          {/* 로그인/회원가입처럼 그룹에 속하지 않는 경로일 때의 빈 옵션 */}
          {!group.children.some((c) => c.href === pathname) && (
            <option value="">선택</option>
          )}
          {group.children.map((child) => (
            <option key={child.href} value={child.href}>
              {child.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
