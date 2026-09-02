/* ==========================================================================
   관리자 레이아웃 — 구식 PHP 관리자(helplus.kr/admin)를 리뉴얼한 화면.
   진입 시 requireAdmin() 으로 등급을 확인한다 (각 페이지·액션에서도 재확인).
   헤더/사이드바/모바일 드로어는 AdminChrome(클라이언트)이 담당한다.
   ========================================================================== */

import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin";
import AdminChrome from "@/components/admin/AdminChrome";

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
    <AdminChrome admin={{ name: admin.name, loginId: admin.loginId }}>
      {children}
    </AdminChrome>
  );
}
