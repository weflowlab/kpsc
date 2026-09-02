"use client";

/* ==========================================================================
   관리자 셸 — 상단 바(햄버거 + 로고 + 이름) / 사이드바 / 콘텐츠
   - 데스크톱(md+): 사이드바 고정 노출 (아이콘 + 글씨)
   - 모바일: 사이드바 숨김. 헤더 왼쪽 햄버거로 드로어를 열고 닫는다.
     드로어는 아이콘 + 글씨를 모두 보여준다.
   - 회원 상세 팝업 창(kpsc-member-detail)에서는 헤더/사이드바를 숨긴다.
   ========================================================================== */

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { logout } from "@/app/actions/auth";

/* ----- 아이콘 (18px, lucide 스타일) ----- */
const icon = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function UsersIcon() {
  return (
    <svg {...icon}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function BoardIcon() {
  return (
    <svg {...icon}>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 8h8M8 12h8M8 16h5" />
    </svg>
  );
}
function PopupIcon() {
  return (
    <svg {...icon}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18" />
      <path d="M6.5 6.5h.01" />
    </svg>
  );
}
function SettingsIcon() {
  return (
    <svg {...icon}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.56V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1.11-1.56 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1.03H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.56-1.11 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34h.01A1.7 1.7 0 0 0 10 4.09V4a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87v.01A1.7 1.7 0 0 0 20.91 11H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1Z" />
    </svg>
  );
}
function BackIcon() {
  return (
    <svg {...icon}>
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </svg>
  );
}
function LogoutIcon() {
  return (
    <svg {...icon}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}

const MENUS = [
  { href: "/admin/members", label: "회원관리", Icon: UsersIcon },
  { href: "/admin/boards", label: "보드관리", Icon: BoardIcon },
  { href: "/admin/popups", label: "팝업창", Icon: PopupIcon },
  { href: "/admin/settings", label: "환경설정", Icon: SettingsIcon },
];

const ITEM =
  "flex items-center gap-3 rounded-md px-3 py-2.5 text-[14px] leading-none transition-colors";

/* 메뉴 목록 (드로어/사이드바 공통) — 모듈 레벨 컴포넌트로 두어야
   부모 렌더마다 재마운트되지 않는다 (재마운트 시 첫 탭이 씹히는 버그 방지) */
function NavList({
  pathname,
  showLabel,
  onLogout,
}: {
  pathname: string;
  showLabel: boolean;
  onLogout: () => void;
}) {
  return (
    <nav className="flex h-full flex-col">
      <ul className="py-3">
        {MENUS.map(({ href, label, Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <li key={href} className="px-2">
              <Link
                href={href}
                className={`${ITEM} ${
                  active ? "bg-ink-900 font-semibold text-white" : "text-ink-700 hover:bg-ink-50"
                }`}
              >
                <span className="flex shrink-0 items-center">
                  <Icon />
                </span>
                <span className={showLabel ? "" : "hidden md:inline"}>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto border-t border-ink-100 px-2 py-3">
        <Link href="/" className={`${ITEM} text-ink-500 hover:bg-ink-50`}>
          <span className="flex shrink-0 items-center">
            <BackIcon />
          </span>
          <span className={showLabel ? "" : "hidden md:inline"}>사이트로 돌아가기</span>
        </Link>
        <button
          type="button"
          onClick={onLogout}
          className={`${ITEM} w-full text-left text-ink-500 hover:bg-ink-50 hover:text-board-tag`}
        >
          <span className="flex shrink-0 items-center">
            <LogoutIcon />
          </span>
          <span className={showLabel ? "" : "hidden md:inline"}>로그아웃</span>
        </button>
      </div>
    </nav>
  );
}

export default function AdminChrome({
  admin,
  children,
}: {
  admin: { name: string; loginId: string };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false); // 모바일 드로어
  const [isPopup, setIsPopup] = useState(false);

  useEffect(() => {
    if (window.opener && window.name === "kpsc-member-detail") setIsPopup(true);
  }, []);

  /* 경로가 바뀌면 드로어 닫기 */
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const onLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  /* 팝업 창에서는 크롬 없이 콘텐츠만 */
  if (isPopup) {
    return <div className="min-h-screen bg-[#F4F5F7] p-5 md:p-8 text-ink-900">{children}</div>;
  }

  return (
    /* 모바일: 일반 문서 스크롤(min-h-screen) + 헤더 sticky
       데스크톱: 화면 고정(h-screen) + 콘텐츠만 내부 스크롤 */
    <div className="flex min-h-screen flex-col bg-[#F4F5F7] text-ink-900 md:h-screen">
      {/* 상단 바 — 모바일에서 스크롤해도 상단에 고정(sticky) */}
      <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between border-b border-ink-200 bg-white px-3 md:px-5">
        <div className="flex items-center gap-2">
          {/* 햄버거 — 모바일에서만 (KPSC 관리자 로고 왼쪽) */}
          <button
            type="button"
            aria-label="메뉴 열기"
            onClick={() => setOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-md text-ink-700 hover:bg-ink-50 md:hidden"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
          <Link href="/admin" className="text-[16px] font-bold">
            KPSC <span className="text-brand-600">관리자</span>
          </Link>
        </div>
        <div className="text-[13px] text-ink-500">
          <b className="text-ink-900">{admin.name}</b>님{" "}
          <span className="hidden sm:inline">({admin.loginId})</span>
        </div>
      </header>

      <div className="flex flex-1 md:min-h-0">
        {/* 데스크톱 사이드바 (고정) */}
        <aside className="hidden shrink-0 overflow-y-auto border-r border-ink-200 bg-white md:block md:w-[200px]">
          <NavList pathname={pathname} showLabel={false} onLogout={onLogout} />
        </aside>

        {/* 모바일 드로어 */}
        {open && (
          <div className="fixed inset-0 z-[9999] md:hidden">
            {/* 딤 */}
            <button
              type="button"
              aria-label="메뉴 닫기"
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-black/40"
            />
            {/* 패널 — 아이콘 + 글씨 모두 노출 */}
            <div className="absolute inset-y-0 left-0 flex w-[240px] flex-col bg-white shadow-xl">
              <div className="flex h-14 shrink-0 items-center justify-between border-b border-ink-200 px-4">
                <span className="text-[15px] font-bold">
                  KPSC <span className="text-brand-600">관리자</span>
                </span>
                <button
                  type="button"
                  aria-label="메뉴 닫기"
                  onClick={() => setOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-ink-500 hover:bg-ink-50"
                >
                  ✕
                </button>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto">
                <NavList pathname={pathname} showLabel onLogout={onLogout} />
              </div>
            </div>
          </div>
        )}

        {/* 콘텐츠
            - 모바일: 일반 문서 흐름 + 하단 여백(pb)으로 마지막 내용이 안 잘리게
            - 데스크톱: 이 영역만 내부 세로 스크롤 */}
        <main className="min-w-0 flex-1 overflow-x-hidden bg-[#F4F5F7] p-5 pb-14 md:overflow-y-auto md:overscroll-contain md:p-8 md:pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}
