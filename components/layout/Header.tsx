"use client";

/* ==========================================================================
   헤더 / GNB
   원본 재현 포인트
   - 항상 상단 고정. 최상단에서는 완전 투명(배경이 그대로 비침),
     스크롤 0 초과 시 배경 #fff, 글자 #fff → #222
   - PC 드롭다운은 "커튼형": 한 항목에 hover 하면 바 전체가 64px → 210px 로
     확장되며 5개 대메뉴의 서브메뉴가 동시에 노출된다 (원본 helplus.js 동작)
   - 대메뉴 hover 컬러 #FF5700, 서브메뉴 hover 컬러 #E67825
   - 모바일은 햄버거 → 아코디언 슬라이드 다운(한 번에 하나만 열림)
   ========================================================================== */

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV, UTIL_NAV, COMPANY } from "@/lib/site-config";
import { LOGO } from "@/lib/images";
import { openIdPwPopup } from "@/components/layout/IdPwFindPopup";
import { KakaoIcon, NaverBlogIcon } from "@/components/common/BrandIcons";
import MobileSliderMenu from "@/components/layout/MobileSliderMenu";

/* 모바일 좌측 전화 버튼 아이콘 — 원본 m_top_tel.png 대체 SVG */
function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.2.4 2.4.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .7-.2 1l-2.3 2.2z" />
    </svg>
  );
}

/* --------------------------------------------------------------------------
   헤더 우측 SNS 링크
   원본 PNG(38×38)는 해상도가 낮아 확대 시 깨지므로 SVG 재현본을 쓴다.
   -------------------------------------------------------------------------- */
const SNS_LINKS = [
  {
    label: "카카오톡 채널",
    href: "https://pf.kakao.com/_VqFIX",
    Icon: KakaoIcon,
  },
  {
    label: "네이버 블로그",
    href: "https://section.blog.naver.com",
    Icon: NaverBlogIcon,
  },
];

/* 메뉴 바 전용 컨테이너 — 로고 행(1200px)보다 살짝 넓게 잡아
   메뉴 사이 간격만 조금 벌린다. 드롭다운도 같은 폭이라 정렬이 유지된다. */
const MENU_CONTAINER = "mx-auto w-full max-w-[1280px] px-6";

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

  /* 배경 반전은 스크롤 여부로만 결정한다.
     (커튼을 열어도 헤더는 투명을 유지해 뒤 배경이 계속 보이게 한다) */
  const solid = scrolled;

  return (
    <header
      className={[
        "fixed top-0 left-0 z-50 w-full transition-all duration-500",
        solid ? "bg-white shadow-[0_0_15px_0_#80808040]" : "bg-transparent",
      ].join(" ")}
    >
      {/* ================================================================
          1) 로고 행 — 좌측 로고 / 우측 유틸(로그인·회원가입·SNS)
          ================================================================ */}
      <div className="container-narrow relative flex h-[64px] items-center justify-between lg:h-[72px]">
        {/* 모바일 좌측 전화 버튼 — 원본 모바일 헤더와 동일한 위치.
            투명 헤더 위에서도 보이도록 밝은 반투명 박스에 어두운 글리프를 쓴다. */}
        <a
          href={`tel:${COMPANY.tel}`}
          aria-label="전화 문의"
          title={COMPANY.tel}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[6px] bg-white/85 text-[#222] shadow-sm backdrop-blur-sm lg:hidden"
        >
          <PhoneIcon />
        </a>

        {/* 로고 — 원본은 흰색/컬러 로고 2장을 opacity 크로스페이드 */}
        {/* 로고는 Link 대신 a 태그를 써서 클릭 시 페이지를 새로 불러온다.
            Link 를 쓰면 홈에서 눌렀을 때 클라이언트 라우팅이라 아무 일도
            일어나지 않는다. 새로고침 동작이 의도이므로 규칙을 끈다. */}
        {/* 모바일은 전화/햄버거 버튼 사이 정중앙, PC 는 원본대로 좌측 정렬 */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a
          href="/"
          onClick={closeAll}
          className="absolute left-1/2 flex -translate-x-1/2 items-center gap-3 lg:static lg:translate-x-0"
          aria-label="KPSC 홈"
        >
          {/* 로고 — 원본과 동일하게 흰색/컬러 두 장을 겹쳐두고 opacity 로
              크로스페이드한다. 최상단(투명 헤더)에서는 흰색,
              스크롤 후(흰 배경)에는 컬러 로고가 보인다. */}
          {/* 원본은 스크롤 시 로고가 오른쪽으로 20px 밀린다(transition 0.5s).
              모바일은 로고가 정중앙 고정이므로 .logo-shift 는 1024px 이상에서만
              적용된다. (인라인 style 로는 미디어쿼리를 걸 수 없어 클래스 사용) */}
          <span
            className={[
              "logo-shift relative block h-[40px] w-[124px] lg:h-[50px] lg:w-[155px]",
              solid ? "is-shifted" : "",
            ].join(" ")}
          >
            <Image
              src={LOGO.white}
              alt=""
              fill
              priority
              sizes="155px"
              className={[
                "object-contain object-left transition-opacity duration-500",
                solid ? "opacity-0" : "opacity-100",
              ].join(" ")}
            />
            <Image
              src={LOGO.color}
              alt={COMPANY.name}
              fill
              priority
              sizes="155px"
              className={[
                "object-contain object-left transition-opacity duration-500",
                solid ? "opacity-100" : "opacity-0",
              ].join(" ")}
            />
          </span>
        </a>

        {/* 우측 유틸 */}
        <div className="flex items-center gap-4">
          <ul className="hidden items-center gap-4 text-[13px] font-semibold md:flex">
            {UTIL_NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={closeAll}
                  className={[
                    "transition-colors duration-500 hover:text-[#2E76BC]",
                    solid ? "text-ink-900" : "text-white/85",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* SNS 배너 2종 — 원본 index/r_kakao.png, index/r_blog.png (새 창) */}
          <div className="hidden items-center gap-2 md:flex">
            {SNS_LINKS.map((sns) => (
              <a
                key={sns.label}
                href={sns.href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={sns.label}
                title={sns.label}
                className="flex items-center transition-transform duration-300 hover:-translate-y-0.5"
              >
                <sns.Icon size={40} />
              </a>
            ))}
          </div>

          {/* 모바일 햄버거 — 전화 버튼과 같은 밝은 박스 (원본 모바일 헤더) */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-label="모바일 대메뉴"
            className="flex h-9 w-9 shrink-0 flex-col items-center justify-center gap-[5px] rounded-[6px] bg-white/85 shadow-sm backdrop-blur-sm lg:hidden"
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={[
                  "block h-[2px] w-5 bg-[#222] transition-all duration-300",
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
          원본 구조: 메뉴 바 자체는 항상 투명(배경이 비침)이고, 바 위아래의
          가는 라인만 남는다. hover 하면 "라인 아래로만" 반투명 다크 패널이
          내려오면서 5개 대메뉴의 서브메뉴가 동시에 노출된다.
          ================================================================ */}
      <nav
        className="relative hidden border-t border-b lg:block"
        style={{ borderColor: solid ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.2)" }}
        onMouseEnter={() => setCurtainOpen(true)}
        onMouseLeave={() => setCurtainOpen(false)}
      >
        {/* 메뉴 바 — 높이 56px 고정, 배경 없음.
            로고 행과 같은 컨테이너를 써서 좌우 여백을 맞춘다. */}
        <div className={MENU_CONTAINER}>
          {/* 5개 대메뉴를 균등 분할 — 고정폭(250px)을 쓰면 컨테이너를 넘쳐
              좌우 여백이 어긋나므로 grid 로 같은 폭을 나눠 갖게 한다 */}
          <ul className="grid grid-cols-5">
            {NAV.map((group) => {
              const active = group.children.some((c) => pathname.startsWith(c.href));
              return (
                <li key={group.label} className="text-center">
                  {/* 1depth — 원본은 href="#" 였으나 첫 서브메뉴로 연결 */}
                  <Link
                    href={group.children[0].href}
                    onClick={closeAll}
                    className={[
                      "block h-[56px] text-[18px] leading-[56px] font-extrabold transition-colors duration-500 hover:text-[#FF5700]",
                      solid ? "text-[#222]" : "text-white",
                      active ? "text-[#FF5700]" : "",
                    ].join(" ")}
                  >
                    {group.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* 드롭다운 패널 — 메뉴 바 아래(top-full)에서만 펼쳐진다 */}
        <div
          className="absolute inset-x-0 top-full overflow-hidden transition-all duration-[250ms] ease-out"
          style={{
            height: curtainOpen ? 136 : 0,
            background: "rgba(66,66,66,0.9)",
            borderBottom: curtainOpen ? "1px solid #6A6969" : "0",
          }}
        >
          <div className={`${MENU_CONTAINER} pt-6`}>
            {/* 위 메뉴 바와 같은 5분할이라 서브메뉴가 대메뉴 아래로 정렬된다 */}
            <ul className="grid grid-cols-5">
              {NAV.map((group) => (
                <li key={group.label} className="space-y-2 text-center">
                  {group.children.map((child) => (
                    <div key={child.href}>
                      <Link
                        href={child.href}
                        onClick={closeAll}
                        tabIndex={curtainOpen ? 0 : -1}
                        className="block py-[4px] text-[15px] text-[#D4D3D3] transition-colors hover:text-[#E67825]"
                      >
                        {child.label}
                      </Link>
                    </div>
                  ))}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      {/* ================================================================
          3) 모바일 가로 슬라이더 메뉴 (767px 이하)
          원본과 동일하게 고정 헤더의 일부다. 문서 흐름에서 빠져 있어야
          히어로/서브 비주얼이 헤더 뒤로 깔리면서 배경이 그대로 비친다.
          ================================================================ */}
      <MobileSliderMenu onNavigate={closeAll} />

      {/* ================================================================
          4) 모바일 메뉴 — 슬라이드 다운 아코디언 (한 번에 하나만 열림)
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
                        onClick={closeAll}
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
                onClick={closeAll}
                className="block px-5 py-3 text-[14px] text-black hover:bg-[#eee]"
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li className="border-b border-dotted border-[#ddd]">
            {/* 원본처럼 페이지 이동 없이 전역 레이어 팝업을 연다 */}
            <button
              type="button"
              onClick={() => {
                closeAll();
                openIdPwPopup();
              }}
              className="block w-full px-5 py-3 text-left text-[14px] text-black hover:bg-[#eee]"
            >
              아이디/비번찾기
            </button>
          </li>
        </ul>
      </div>
    </header>
  );
}
