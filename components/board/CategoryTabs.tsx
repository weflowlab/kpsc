"use client";

/* ==========================================================================
   게시판 카테고리 탭 (원본 #item_category)
   원본 재현 포인트
   - PC 4열 배치 기준(23.38% + 좌 1.3% 간격)
   - 기본 버튼: 흰 배경 + #333 볼드 13px 테두리, 35px 줄높이, hover #DEDEDE(0.7s)
   - 선택 버튼(.item_category_on): #303030 배경 + 흰 글자
   - 스킨별 차이: gallery 는 테두리 #D7D7D7 + 칸 그림자, default(게시판)는
     테두리 #BAB9B9 + 그림자 없음
   - 링크 모드(getHref): 원본처럼 카테고리별 필터 URL 로 이동
     토글 모드(기본): 게시물이 없는 갤러리에서 선택 상태만 재현
   ========================================================================== */

import { useState } from "react";
import Link from "next/link";

type CategoryTabsProps = {
  categories: string[];
  /** 처음부터 선택 상태로 둘 항목 (게시판의 "전체") */
  defaultActive?: string | null;
  /** 스킨 변형 — gallery(그림자) / board(무그림자) */
  variant?: "gallery" | "board";
  /** 링크 모드 — 카테고리별 이동 URL 맵 (서버 컴포넌트에서 함수를 넘길 수
      없으므로 직렬화 가능한 객체로 받는다). 지정 시 토글 대신 링크로 동작 */
  hrefs?: Record<string, string>;
  /** 링크 모드에서 현재 활성 카테고리 */
  activeCategory?: string;
};

export default function CategoryTabs({
  categories,
  defaultActive = null,
  variant = "gallery",
  hrefs,
  activeCategory,
}: CategoryTabsProps) {
  const [toggled, setToggled] = useState<string | null>(defaultActive);
  const active = hrefs ? activeCategory : toggled;

  const border = variant === "gallery" ? "border-[#D7D7D7]" : "border-[#BAB9B9]";
  const cellShadow =
    variant === "gallery" ? "shadow-[2px_1px_2px_0px_#F1F1F1]" : "";

  const buttonClass = (cat: string) =>
    `block w-full cursor-pointer border text-center text-[13px] leading-[35px] duration-700 ${
      active === cat
        ? "border-[#303030] bg-[#303030] text-white"
        : `${border} bg-white font-bold text-[#333] hover:bg-[#DEDEDE]`
    }`;

  return (
    <ul className="flex flex-wrap">
      {categories.map((cat, i) => (
        <li
          key={cat}
          className={`mb-2.5 w-[48.7%] md:w-[23.38%] ${cellShadow} ${
            i % 4 === 0 ? "" : "ml-[2.6%] md:ml-[1.3%]"
          }`}
        >
          {hrefs ? (
            <Link
              href={hrefs[cat] ?? "#"}
              aria-current={active === cat ? "page" : undefined}
              className={buttonClass(cat)}
            >
              {cat}
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => setToggled(cat)}
              aria-pressed={active === cat}
              className={buttonClass(cat)}
            >
              {cat}
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
