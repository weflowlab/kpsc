/* ==========================================================================
   서브 페이지 공통 골격 (원본 .sub_contents_box > #sub_boxT)
   구성
     서브 비주얼 배너
     └ .sub-box1 (좌측: 서브메뉴 + 고객센터 박스)  ── PC 1281px 이상에서만 노출
     └ .sub-box2 (우측: 실제 본문)
   ========================================================================== */

import type { ReactNode } from "react";
import SubVisual from "./SubVisual";
import SubNav from "./SubNav";
import { CUSTOMER_CENTER, findNavGroup, NAV } from "@/lib/site-config";

type SubLayoutProps = {
  /** 현재 페이지 경로 — 좌측 서브메뉴 그룹을 찾는 데 사용 */
  pathname: string;
  /** 서브 비주얼 배경 플레이스홀더 설명 */
  visualPlaceholder: string;
  /** 좌측 사이드바 숨김 (로그인/회원가입처럼 서브메뉴가 없는 페이지) */
  hideSidebar?: boolean;
  /** 서브 비주얼 제목 직접 지정 (기본값: 대메뉴명) */
  visualTitle?: string;
  children: ReactNode;
};

/* --------------------------------------------------------------------------
   고객센터 박스 (원본 #menu_tel)
   -------------------------------------------------------------------------- */
function CustomerCenter() {
  return (
    <div className="mt-6 rounded-lg bg-ink-50 p-6">
      <p className="font-mont text-[12px] tracking-[0.15em] text-ink-400 uppercase">
        {CUSTOMER_CENTER.titleEn}{" "}
        <strong className="font-bold text-ink-900">
          {CUSTOMER_CENTER.titleEnStrong}
        </strong>
      </p>
      <a
        href={`tel:${CUSTOMER_CENTER.tel}`}
        className="mt-1 block text-[20px] font-bold text-brand-600"
      >
        {CUSTOMER_CENTER.tel}
      </a>

      <p className="font-mont mt-5 text-[12px] tracking-[0.15em] text-ink-400 uppercase">
        {CUSTOMER_CENTER.hoursTitleEn}{" "}
        <strong className="font-bold text-ink-900">
          {CUSTOMER_CENTER.hoursTitleEnStrong}
        </strong>
      </p>
      <ul className="mt-1 space-y-0.5 text-[13px] text-ink-500">
        {CUSTOMER_CENTER.hours.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </div>
  );
}

export default function SubLayout({
  pathname,
  visualPlaceholder,
  hideSidebar = false,
  visualTitle,
  children,
}: SubLayoutProps) {
  const group = findNavGroup(pathname);
  const title = visualTitle ?? group?.label ?? NAV[0].label;

  return (
    <>
      {/* 상단 비주얼 */}
      <SubVisual title={title} placeholder={visualPlaceholder} />

      {/* 본문 영역 */}
      <div className="container-mid py-12 lg:py-20">
        <div
          className={
            hideSidebar || !group
              ? "block"
              : "grid gap-10 xl:grid-cols-[240px_minmax(0,1fr)] xl:gap-16"
          }
        >
          {/* ------------------------------------------------------------
              좌측 사이드바 — 서브메뉴 + 고객센터
              ------------------------------------------------------------ */}
          {!hideSidebar && group && (
            <aside className="xl:sticky xl:top-[150px] xl:self-start">
              <SubNav group={group} />
              <div className="hidden xl:block">
                <CustomerCenter />
              </div>
            </aside>
          )}

          {/* ------------------------------------------------------------
              우측 본문
              ------------------------------------------------------------ */}
          <div className={hideSidebar || !group ? "" : "mt-8 xl:mt-0"}>{children}</div>
        </div>
      </div>
    </>
  );
}
