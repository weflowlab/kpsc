"use client";

/* ==========================================================================
   헤더 / GNB
   원본 재현 포인트
   - 항상 상단 고정. 스크롤 0 초과 시 배경 rgba(0,0,0,.09) → #fff, 글자 #fff → #222
   - PC 드롭다운은 "커튼형": 한 항목에 hover 하면 바 전체가 50px → 190px 로
     확장되며 5개 대메뉴의 서브메뉴가 동시에 노출된다 (원본 helplus.js 동작)
   - 대메뉴 hover 컬러 #FF5700, 서브메뉴 hover 컬러 #E67825
   - 모바일은 햄버거 → 아코디언 슬라이드 다운(한 번에 하나만 열림)
   ========================================================================== */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV, UTIL_NAV, COMPANY } from "@/lib/site-config";

export default function Header() {
  /* ------------------------------------------------------------------
     상태 — 스크롤 여부 / 커튼 드롭다운 / 모바일 메뉴 / 모바일 아코디언
     ------------------------------------------------------------------ */
  const [scrolled, setScrolled] = useState(false);
  const [curtainOpen, setCurtainOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const pathname = usePathname();

  /* ------------------------------------------------------------------
     스크롤 감지 — 원본은 scrollTop > 0 기준으로 fixed-default/fixed-on 토글
     ------------------------------------------------------------------ */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ------------------------------------------------------------------
     메뉴 링크 클릭 시 열려 있던 메뉴를 모두 닫는다.
     (라우트 변경 감지 대신 이벤트 핸들러에서 처리)
     ------------------------------------------------------------------ */
  const closeAll = () => {
    setMobileOpen(false);
    setCurtainOpen(false);
    setOpenAccordion(null);
  };

  /* 스크롤 상태 또는 커튼이 열렸을 때는 어두운 배경 위 흰 글씨가 아니라 반전 적용 */
  const solid = scrolled || curtainOpen;

  return (
    <header
      className={[
        "fixed top-0 left-0 z-50 w-full transition-all duration-500",
        solid ? "bg-white shadow-[0_0_15px_0_#80808040]" : "bg-black/10",
      ].join(" ")}
    >
      {/* ================================================================
          1) 로고 행 — 좌측 로고 / 우측 유틸(로그인·회원가입·SNS)
          ================================================================ */}
      <div className="container-narrow flex h-[70px] items-center justify-between lg:h-[81px]">
        {/* 로고 — 원본은 흰색/컬러 로고 2장을 opacity 크로스페이드 */}
        <Link
          href="/"
          onClick={closeAll}
          className="flex items-center gap-3"
          aria-label="KPSC 홈"
        >
          <span
            aria-hidden
            className={[
              "flex h-9 w-9 items-center justify-center rounded-md text-[11px] font-bold transition-colors duration-500",
              solid ? "bg-brand-600 text-white" : "bg-white/90 text-brand-600",
            ].join(" ")}
          >
            {/* 이미지 자리: KPSC 심볼(악수 실루엣 + 상승 화살표) 146×47 */}
            LOGO
          </span>
          <span
            className={[
              "font-mont text-xl font-bold tracking-tight transition-colors duration-500",
              solid ? "text-ink-900" : "text-white",
            ].join(" ")}
          >
            {COMPANY.name}
          </span>
        </Link>

        {/* 우측 유틸 */}
        <div className="flex items-center gap-4">
          <ul className="hidden items-center gap-4 text-[13px] md:flex">
            {UTIL_NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={closeAll}
                  className={[
                    "transition-colors duration-500 hover:text-[#2E76BC]",
                    solid ? "text-ink-500" : "text-white/85",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* SNS 배너 2종 — 원본 index/r_kakao.png, index/r_blog.png */}
          <div className="hidden items-center gap-2 md:flex">
            {["카카오톡", "블로그"].map((sns) => (
              <span
                key={sns}
                aria-label={`이미지 자리: ${sns} 배너 아이콘`}
                className={[
                  "flex h-8 items-center rounded px-3 text-[11px] font-medium transition-colors duration-500",
                  solid
                    ? "bg-ink-100 text-ink-500"
                    : "bg-white/15 text-white/80 backdrop-blur-sm",
                ].join(" ")}
              >
                {sns}
              </span>
            ))}
          </div>

          {/* 모바일 전화 / 햄버거 */}
          <a
            href={`tel:${COMPANY.tel}`}
            className={[
              "text-sm font-semibold transition-colors duration-500 lg:hidden",
              solid ? "text-ink-900" : "text-white",
            ].join(" ")}
          >
            전화
          </a>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-label="모바일 대메뉴"
            className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] lg:hidden"
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={[
                  "block h-[2px] w-5 transition-all duration-300",
                  solid ? "bg-ink-900" : "bg-white",
                  mobileOpen && i === 0 ? "translate-y-[7px] rotate-45" : "",
                  mobileOpen && i === 1 ? "opacity-0" : "",
                  mobileOpen && i === 2 ? "-translate-y-[7px] -rotate-45" : "",
                ].join(" ")}
              />
            ))}
          </button>
        </div>
      </div>

      {/* ================================================================
          2) PC GNB 바 — 커튼형 드롭다운
          바 자체 높이 50px → hover 시 190px 로 확장되며 서브메뉴 동시 노출
          ================================================================ */}
      <nav
        className="relative hidden border-t lg:block"
        style={{ borderColor: solid ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.2)" }}
        onMouseEnter={() => setCurtainOpen(true)}
        onMouseLeave={() => setCurtainOpen(false)}
      >
        {/* 커튼 배경판 — 확장 시에만 깔리는 반투명 다크 패널 */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 -z-10 transition-all duration-[250ms] ease-out"
          style={{
            height: curtainOpen ? 190 : 50,
            background: curtainOpen ? "rgba(66,66,66,0.9)" : "transparent",
            borderBottom: curtainOpen ? "1px solid #6A6969" : "0",
          }}
        />

        <div
          className="container-narrow overflow-hidden transition-all duration-[250ms] ease-out"
          style={{ height: curtainOpen ? 190 : 50 }}
        >
          <ul className="flex">
            {NAV.map((group) => {
              const active = group.children.some((c) => pathname.startsWith(c.href));
              return (
                <li key={group.label} className="w-[250px] shrink-0">
                  {/* 1depth — 원본은 href="#" 였으나 첫 서브메뉴로 연결 */}
                  <Link
                    href={group.children[0].href}
                    onClick={closeAll}
                    className={[
                      "block h-[50px] text-[18px] leading-[50px] font-semibold transition-colors duration-500 hover:text-[#FF5700]",
                      curtainOpen
                        ? "text-white"
                        : solid
                          ? "text-[#222]"
                          : "text-white",
                      active && !curtainOpen ? "text-brand-600" : "",
                    ].join(" ")}
                  >
                    {group.label}
                  </Link>

                  {/* 2depth — 커튼이 열렸을 때만 보인다 */}
                  <ul
                    className={[
                      "mt-6 space-y-2 transition-opacity duration-300",
                      curtainOpen ? "opacity-100" : "opacity-0",
                    ].join(" ")}
                  >
                    {group.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          onClick={closeAll}
                          tabIndex={curtainOpen ? 0 : -1}
                          className="block py-[3px] text-[14px] text-[#D4D3D3] transition-colors hover:text-[#E67825]"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* ================================================================
          3) 모바일 메뉴 — 슬라이드 다운 아코디언 (한 번에 하나만 열림)
          ================================================================ */}
      <div
        className={[
          "overflow-hidden border-t border-ink-200 bg-white transition-[max-height] duration-300 lg:hidden",
          mobileOpen ? "max-h-[80vh] overflow-y-auto" : "max-h-0",
        ].join(" ")}
      >
        <ul>
          {NAV.map((group) => {
            const open = openAccordion === group.label;
            return (
              <li key={group.label} className="border-b border-dotted border-[#ddd]">
                <button
                  type="button"
                  onClick={() => setOpenAccordion(open ? null : group.label)}
                  aria-expanded={open}
                  className="flex w-full items-center justify-between px-5 py-3 text-left text-[14px] text-black hover:bg-[#eee]"
                >
                  {group.label}
                  {/* 개폐 아이콘 — 원본 mobile_menu_off/on.png (11×6px) 대체 */}
                  <span
                    aria-hidden
                    className={`text-[10px] text-ink-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                  >
                    ▼
                  </span>
                </button>
                <ul
                  className={[
                    "overflow-hidden bg-ink-50 transition-[max-height] duration-300",
                    open ? "max-h-60" : "max-h-0",
                  ].join(" ")}
                >
                  {group.children.map((child) => (
                    <li key={child.href}>
                      <Link
                        href={child.href}
                        className="block px-8 py-2.5 text-[13px] text-[#666] hover:bg-[#eee]"
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}

          {/* 모바일 전용 유틸 — 원본은 로그인/회원가입/아이디·비번찾기 3개 추가 */}
          {UTIL_NAV.map((item) => (
            <li key={item.href} className="border-b border-dotted border-[#ddd]">
              <Link
                href={item.href}
                className="block px-5 py-3 text-[14px] text-black hover:bg-[#eee]"
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li className="border-b border-dotted border-[#ddd]">
            <Link
              href="/login"
              onClick={closeAll}
              className="block px-5 py-3 text-[14px] text-black hover:bg-[#eee]"
            >
              아이디/비번찾기
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
