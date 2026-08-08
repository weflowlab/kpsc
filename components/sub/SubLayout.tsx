/* ==========================================================================
   서브 페이지 공통 골격 (원본 .sub_contents_box > #sub_boxT)
   구성
     서브 비주얼 배너
     └ 가로 서브메뉴 탭바 (.m_submenu_back) — 배너 바로 아래 전체 폭
     └ 본문 (.sub-box2 가 100% 폭을 차지)
   ※ 원본의 좌측 사이드바(.sub-box1: 서브메뉴 + 고객센터 박스)는 CSS 로
     전 해상도에서 숨겨져 있어 실제로는 렌더링되지 않는다. 따라서 여기서도
     사이드바 없이 본문이 전체 폭을 쓰도록 맞췄다.
   ========================================================================== */

import type { ReactNode } from "react";
import SubVisual from "./SubVisual";
import SubNav from "./SubNav";
import QuickMenu from "@/components/layout/QuickMenu";
import { findNavGroup, NAV } from "@/lib/site-config";
import type { SubBannerKey } from "@/lib/images";

type SubLayoutProps = {
  /** 현재 페이지 경로 — 서브메뉴 그룹을 찾는 데 사용 */
  pathname: string;
  /** 서브 비주얼 배너 이미지 세트 */
  banner: SubBannerKey;
  /** 서브메뉴 탭바 숨김 (로그인/회원가입처럼 서브메뉴가 없는 페이지) */
  hideSubNav?: boolean;
  /** 서브 비주얼 제목 직접 지정 (기본값: 대메뉴명) */
  visualTitle?: string;
  children: ReactNode;
};

export default function SubLayout({
  pathname,
  banner,
  hideSubNav = false,
  visualTitle,
  children,
}: SubLayoutProps) {
  const group = findNavGroup(pathname);
  const title = visualTitle ?? group?.label ?? NAV[0].label;

  /* 원본 .sub_title — 본문 최상단 가운데 정렬 + 밑줄 페이지 타이틀.
     원본은 JS가 활성 서브메뉴(.p_submenu_bu_on) 라벨을 주입한다. */
  const subTitle = group?.children.find((c) => c.href === pathname)?.label;

  return (
    <>
      {/* 상단 비주얼 */}
      <SubVisual title={title} banner={banner} />

      {/* 가로 서브메뉴 탭바 — 배너 바로 아래 전체 폭 */}
      {!hideSubNav && group && <SubNav group={group} />}

      {/* 우측 퀵메뉴 바 — 원본과 동일하게 서브 페이지 + 1564px 이상에서만 */}
      <QuickMenu />

      {/* 본문 — 전체 폭 */}
      {subTitle ? (
        <div className="container-mid pb-12 lg:pb-20">
          {/* 원본 .sub_title: mt 15/53, mb 25px/5%, 22px→28px, 밑줄 2px #D9D9D9 */}
          <h2 className="mt-[15px] mb-[25px] w-full border-b-2 border-[#D9D9D9] text-center text-[22px] leading-[43px] font-bold text-[#222] md:mt-[53px] md:mb-[5%] md:text-[28px]">
            {subTitle}
          </h2>
          {children}
        </div>
      ) : (
        <div className="container-mid py-12 lg:py-20">{children}</div>
      )}
    </>
  );
}
