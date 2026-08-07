/* ==========================================================================
   조직 구성 > 갤러리  (원본 /bbs.php?table=gallery&pg=32)
   구성
     1) 카테고리 탭 — 미술갤러리 / 행사갤러리 (PC 4열 배치 기준)
     2) 상단 정보줄 — 자료수 / 페이지 + 글쓰기 버튼
     3) 썸네일 그리드 — PC 4열 / 모바일 2열, hover 시 밝기 50% + 1.4배 확대
     4) 검색 폼
   ※ 원본은 두 카테고리 모두 게시물 0건이라 빈 상태로 렌더링된다.
   ========================================================================== */

import type { Metadata } from "next";
import SubLayout from "@/components/sub/SubLayout";
import BoardSearch from "@/components/board/BoardSearch";

export const metadata: Metadata = { title: "갤러리" };

/* --------------------------------------------------------------------------
   카테고리 탭 — 원본 #item_category
   -------------------------------------------------------------------------- */
const CATEGORIES = ["미술갤러리", "행사갤러리"];

/* --------------------------------------------------------------------------
   게시물 목록 — 원본 기준 0건
   -------------------------------------------------------------------------- */
type GalleryItem = { uid: number; title: string; date: string };
const ITEMS: GalleryItem[] = [];

export default function GalleryPage() {
  return (
    <SubLayout
      pathname="/organization/gallery"
      visualPlaceholder="조직 구성 서브 배너 (팀 이미지)"
    >
      {/* ================================================================
          1) 카테고리 탭
          ================================================================ */}
      <ul className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        {CATEGORIES.map((cat) => (
          <li key={cat}>
            <button
              type="button"
              className="w-full border border-ink-200 py-2 text-[13px] text-ink-500 shadow-sm transition-colors hover:border-brand-600 hover:text-brand-600"
            >
              {cat}
            </button>
          </li>
        ))}
      </ul>

      {/* ================================================================
          2) 상단 정보줄
          ================================================================ */}
      <div className="mt-6 flex items-center justify-between border-b border-board-line pb-3">
        <p className="text-[13px] text-ink-500">
          자료수 <strong className="text-ink-900">{ITEMS.length}</strong>개,{" "}
          <strong className="text-ink-900">1</strong>페이지중{" "}
          <strong className="text-ink-900">1</strong>페이지
        </p>
        <button
          type="button"
          className="bg-[#1A1A1A] px-4 py-1.5 text-[12px] text-white transition-colors hover:bg-[#A5A5A5]"
        >
          글쓰기
        </button>
      </div>

      {/* ================================================================
          3) 썸네일 그리드 — PC 4열 / 모바일 2열
          ================================================================ */}
      {ITEMS.length > 0 ? (
        <ul className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {ITEMS.map((item) => (
            <li key={item.uid}>
              <a href="#" className="group block">
                {/* 썸네일 — hover 시 어두워지며 확대 */}
                <div className="aspect-[4/3] overflow-hidden bg-ink-100">
                  <div className="h-full w-full transition-all duration-500 group-hover:scale-[1.4] group-hover:brightness-50" />
                </div>
                <p className="mt-2 truncate text-center text-[13px] text-ink-700">
                  {item.title}
                </p>
                <p className="text-center text-[12px] text-ink-400">{item.date}</p>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        /* 빈 상태 */
        <div className="mt-6 border-b border-board-line py-24 text-center">
          <p className="text-[14px] text-ink-400">등록된 게시물이 없습니다.</p>
        </div>
      )}

      {/* ================================================================
          4) 검색 폼
          ================================================================ */}
      <BoardSearch />
    </SubLayout>
  );
}
