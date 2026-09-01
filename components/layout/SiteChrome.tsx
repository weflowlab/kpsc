"use client";

/* ==========================================================================
   사이트 공통 UI 래퍼 — 관리자(/admin) 경로에서는 헤더/푸터/플로팅 UI 를
   숨긴다. (루트 레이아웃은 모든 경로에 적용되므로 클라이언트에서 분기)
   ========================================================================== */

import { usePathname } from "next/navigation";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return <>{children}</>;
}
