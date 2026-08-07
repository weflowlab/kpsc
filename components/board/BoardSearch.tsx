"use client";

/* ==========================================================================
   게시판 검색 폼 (원본 #board_search_wrap)
   원본 재현 포인트
   - 3분할 레이아웃: 셀렉트 20% / 입력 60% / 버튼 20% (모바일 28/50/22%)
   - 셀렉트 옵션: 전체에서 / 제목 / 본문 / 작성자 / 아이디
   - 버튼 배경 #1A1A1A, hover #A5A5A5
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
    <div className="mt-10">
      <form onSubmit={onSubmit} className="flex justify-center gap-2">
        {/* 검색 대상 셀렉트 */}
        <select
          value={where}
          onChange={(e) => setWhere(e.target.value)}
          aria-label="검색 대상"
          className="h-[34px] w-[28%] max-w-[120px] border border-ink-200 px-2 text-[13px] text-ink-700 outline-none focus:border-brand-600"
        >
          {SEARCH_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* 검색어 입력 */}
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          aria-label="검색어"
          className="h-[34px] w-[50%] max-w-[300px] border border-ink-200 px-3 text-[13px] outline-none focus:border-brand-600"
        />

        {/* 검색 버튼 */}
        <button
          type="submit"
          className="h-[34px] w-[22%] max-w-[100px] bg-[#1A1A1A] text-[13px] text-white transition-colors hover:bg-[#A5A5A5]"
        >
          검색하기
        </button>
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
