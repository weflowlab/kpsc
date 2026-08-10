"use client";

/* ==========================================================================
   게시판 카테고리 탭 (원본 #item_category)
   원본 재현 포인트
   - PC 4열 배치 기준(23.38% + 좌 1.3% 간격)
     ※ 원본은 고정 % 폭이라 카테고리가 4개 미만이면(갤러리 = 2개) 오른쪽이
       휑하게 남았다. 여기서는 grid 로 바꿔 개수에 맞춰 열을 나눠 가지므로
       모바일·PC 어디서든 탭이 가로 폭을 꽉 채운다.
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

  /* 카테고리 개수에 맞춰 열을 나눠 가진다 — 2개(갤러리)면 한 칸이 절반씩,
     4개 이상이면 원본과 같은 4열. 어느 폭에서든 탭이 가로를 꽉 채운다. */
  const mdCols =
    { 1: "md:grid-cols-1", 2: "md:grid-cols-2", 3: "md:grid-cols-3" }[
      categories.length
    ] ?? "md:grid-cols-4";

  return (
    <ul
      className={`grid grid-cols-2 gap-x-[2.6%] gap-y-2.5 md:gap-x-[1.3%] ${mdCols}`}
    >
      {categories.map((cat) => (
        <li key={cat} className={cellShadow}>
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
