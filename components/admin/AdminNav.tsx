"use client";

/* ==========================================================================
   관리자 사이드바 — 원본 관리자 상단 메뉴(회원관리/보드관리/팝업창/환경설정)
   중 클라이언트 요청 4종만 리뉴얼해 배치.
   하단에는 사이트로 돌아가기 / 로그아웃 (WEFLOW 관리자 배치 참고)
   아이콘은 라인 스타일 인라인 SVG (currentColor 로 활성 색상 따라감)
   ========================================================================== */

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { logout } from "@/app/actions/auth";

/* ----- 아이콘 (18px, stroke 1.8, lucide 스타일) ----- */
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

const ITEM_BASE =
  "mx-2 my-0.5 flex items-center gap-3 rounded-md px-3 py-2.5 text-[14px] transition-colors";

export default function AdminNav() {
  const pathname = usePathname();
  /* 회원 상세를 팝업 창으로 열었을 때는 사이드바를 숨긴다 */
  const [isPopup, setIsPopup] = useState(false);
  useEffect(() => {
    if (window.opener && window.name === "kpsc-member-detail") setIsPopup(true);
  }, []);

  const onLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  if (isPopup) return null;

  return (
    <nav className="flex h-full w-[72px] shrink-0 flex-col overflow-y-auto border-r border-ink-200 bg-white md:w-[200px]">
      <ul className="py-3">
        {MENUS.map(({ href, label, Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                className={[
                  ITEM_BASE,
                  active
                    ? "bg-ink-900 font-semibold text-white"
                    : "text-ink-700 hover:bg-ink-50",
                ].join(" ")}
              >
                <Icon />
                <span className="hidden md:inline">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* 하단 — 사이트로 돌아가기 / 로그아웃 */}
      <div className="mt-auto border-t border-ink-100 py-3">
        <Link href="/" className={`${ITEM_BASE} text-ink-500 hover:bg-ink-50`}>
          <BackIcon />
          <span className="hidden md:inline">사이트로 돌아가기</span>
        </Link>
        <button
          type="button"
          onClick={onLogout}
          className={`${ITEM_BASE} w-[calc(100%-16px)] text-left text-ink-500 hover:bg-ink-50 hover:text-board-tag`}
        >
          <LogoutIcon />
          <span className="hidden md:inline">로그아웃</span>
        </button>
      </div>
    </nav>
  );
}
