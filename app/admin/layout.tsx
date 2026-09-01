/* ==========================================================================
   관리자 레이아웃 — 구식 PHP 관리자(helplus.kr/admin)를 리뉴얼한 화면.
   좌측 사이드바(회원관리/보드관리/팝업창/환경설정) + 우측 콘텐츠.
   진입 시 requireAdmin() 으로 등급을 확인한다 (각 페이지·액션에서도 재확인).
   ========================================================================== */

import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import AdminNav from "@/components/admin/AdminNav";

export const metadata: Metadata = {
  title: { default: "관리자", template: "KPSC 관리자 - %s" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();

  return (
    /* 헤더/사이드바는 고정, 콘텐츠 영역만 스크롤되는 구조 */
    <div className="flex h-screen flex-col bg-[#F4F5F7] text-ink-900">
      {/* 상단 바 */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-ink-200 bg-white px-5">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-[16px] font-bold">
            KPSC <span className="text-brand-600">관리자</span>
          </Link>
        </div>
        <div className="flex items-center gap-4 text-[13px] text-ink-500">
          <span>
            <b className="text-ink-900">{admin.name}</b>님 ({admin.loginId})
          </span>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* 사이드바 (고정) */}
        <AdminNav />

        {/* 콘텐츠 — 이 영역만 스크롤 */}
        <main className="min-w-0 flex-1 overflow-y-auto p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}
