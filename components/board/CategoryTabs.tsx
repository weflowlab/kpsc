"use client";

/* ==========================================================================
   게시판 카테고리 탭 (원본 #item_category)
   원본 재현 포인트
   - PC 4열 배치 기준(23.38% + 좌 1.3% 간격), 칸 그림자 2px 1px 2px #F1F1F1
   - 기본 버튼: 흰 배경 + #333 볼드 13px + 1px #D7D7D7 테두리, 35px 줄높이,
     hover 시 #DEDEDE (0.7s)
   - 선택 버튼(.item_category_on): #303030 배경 + 흰 글자
   - 정적 클론이라 실제 필터링 대신 선택 토글만 재현한다.
   ========================================================================== */

import { useState } from "react";

export default function CategoryTabs({ categories }: { categories: string[] }) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <ul className="flex flex-wrap">
      {categories.map((cat, i) => (
        <li
          key={cat}
          className={`mb-2.5 w-[48.7%] shadow-[2px_1px_2px_0px_#F1F1F1] md:w-[23.38%] ${
            i % 4 === 0 ? "" : "ml-[2.6%] md:ml-[1.3%]"
          }`}
        >
          <button
            type="button"
            onClick={() => setActive(active === cat ? null : cat)}
            aria-pressed={active === cat}
            className={`w-full cursor-pointer border border-[#D7D7D7] text-[13px] leading-[35px] duration-700 ${
              active === cat
                ? "bg-[#303030] text-white"
                : "bg-white font-bold text-[#333] hover:bg-[#DEDEDE]"
            }`}
          >
            {cat}
          </button>
        </li>
      ))}
    </ul>
  );
}
