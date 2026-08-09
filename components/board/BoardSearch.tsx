"use client";

/* ==========================================================================
   게시판 검색 폼 (원본 #board_search_wrap)
   원본 재현 포인트
   - 래퍼 폭: 80% → 70%(481~) → 50%(768~) → 65%(원본 1200~, 여기선 xl 1280)
   - 3분할 레이아웃: 셀렉트 20% / 입력 60% / 버튼 20% (모바일 28/50/22%)
   - 셀렉트 옵션: 전체에서 / 제목 / 본문 / 작성자 / 아이디
   - 셀렉트 bg #F9F9F9, 입력 96% 폭, 모두 30px 높이 + #E4E4E4 테두리
   - 버튼 배경 #1A1A1A, hover #A5A5A5 (0.7s)
   - 2자 미만 검색 시 원본과 동일한 안내 문구 노출
   ========================================================================== */

import { useState, type FormEvent } from "react";
import { SEARCH_OPTIONS } from "@/lib/content/board";

export default function BoardSearch() {
  const [where, setWhere] = useState<string>("ALL");
  const [keyword, setKeyword] = useState("");
  const [error, setError] = useState<string | null>(null);

  /* 검색 실행 — 정적 사이트라 실제 조회 대신 원본 검증 로직만 재현 */
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (keyword.trim().length < 2) {
      setError("검색어를 입력하지 않으셨거나 너무 짧습니다.");
      return;
    }
    setError(null);
  };

  return (
    <div className="mx-auto w-[80%] pt-5 min-[481px]:w-[70%] md:w-1/2 xl:w-[65%]">
      <form onSubmit={onSubmit} className="flex">
        {/* 검색 대상 셀렉트 — 원본 .board_search_select */}
        <div className="w-[28%] min-[481px]:w-[25%] md:w-[20%]">
          <select
            value={where}
            onChange={(e) => setWhere(e.target.value)}
            aria-label="검색 대상"
            className="h-[30px] w-full border border-[#E4E4E4] bg-[#F9F9F9] px-1 text-[13px] text-ink-700 outline-none"
          >
            {SEARCH_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* 검색어 입력 — 원본 .board_search_input (96% 폭) */}
        <div className="w-[50%] min-[481px]:w-[53%] md:w-[60%]">
          {/* mx-auto 로 양옆 2% 씩 — 셀렉트/버튼과의 간격을 동일하게 */}
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            aria-label="검색어"
            className="mx-auto block h-[30px] w-[96%] border border-[#E4E4E4] px-2 text-[13px] outline-none"
          />
        </div>

        {/* 검색 버튼 — 원본 .board_search_buT */}
        <div className="w-[22%] min-[481px]:w-[22%] md:w-[20%]">
          <button
            type="submit"
            className="h-[30px] w-full cursor-pointer bg-[#1A1A1A] text-center text-[13px] leading-[30px] text-white duration-700 hover:bg-[#A5A5A5]"
          >
            검색하기
          </button>
        </div>
      </form>

      {/* 검증 안내 */}
      {error && (
        <p role="alert" className="mt-3 text-center text-[12px] text-board-tag">
          {error}
        </p>
      )}
    </div>
  );
}
