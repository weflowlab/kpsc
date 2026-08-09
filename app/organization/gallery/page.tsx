/* ==========================================================================
   조직 구성 > 갤러리  (원본 /bbs.php?table=gallery&pg=32)
   구성 — 원본 gallery_category 스킨 그대로
     1) 상단 정보줄 (.pm_gallery_toptext) — 자료수/페이지 + write.gif 버튼
     2) board_line → 썸네일 그리드(.pm_gallery, 0건이라 비어 있음) → board_line_2
     3) 페이지네이션 (.page_wrap) — prev1/next1 gif + 현재 페이지 박스
     4) 검색 폼 (#board_search_wrap)
   ※ 원본은 게시물 0건: 카테고리 탭 마크업도 없고, 빈 목록 안내 문구도 없다.
   ========================================================================== */

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SubLayout from "@/components/sub/SubLayout";
import Reveal from "@/components/common/Reveal";
import BoardSearch from "@/components/board/BoardSearch";
import CategoryTabs from "@/components/board/CategoryTabs";
import CountUp from "@/components/board/CountUp";

export const metadata: Metadata = { title: "갤러리" };

/* --------------------------------------------------------------------------
   카테고리 탭 (원본 #item_category)
   -------------------------------------------------------------------------- */
const CATEGORIES = ["미술갤러리", "행사갤러리"];

/* --------------------------------------------------------------------------
   게시물 목록 — 원본 기준 0건
   -------------------------------------------------------------------------- */
type GalleryItem = { uid: number; title: string; date: string; thumb?: string };
const ITEMS: GalleryItem[] = [];

export default function GalleryPage() {
  return (
    <SubLayout
      pathname="/organization/gallery"
      banner="organization"
    >
      {/* 원본 #board_wrap 의 AOS fade-up — 콘텐츠 전체가 아래에서 올라온다 */}
      <Reveal type="fade-up">
        {/* ================================================================
            0) 카테고리 탭 — 원본 #item_category
            ================================================================ */}
        <CategoryTabs categories={CATEGORIES} />

      {/* ================================================================
          1) 상단 정보줄 — 원본 .pm_gallery_toptext (13px #666, pt 30px)
          ================================================================ */}
      <div className="flex items-center justify-between pt-[30px] text-[13px] text-[#666]">
        <p>
          자료수 <b><CountUp value={ITEMS.length} /></b>개,{" "}
          <b><CountUp value={1} /></b>페이지중 <b>1</b>페이지
        </p>
        {/* 원본 write.gif 아이콘 버튼 → 글쓰기 페이지 */}
        <Link href="/organization/gallery/write" aria-label="글쓰기">
          <Image src="/images/board/write.gif" alt="글쓰기" width={52} height={20} unoptimized />
        </Link>
      </div>

      {/* board_line — 1px #E4E4E4, margin 7px 0 15px */}
      <div aria-hidden className="mt-[7px] mb-[15px] h-px w-full bg-[#E4E4E4]" />

      {/* ================================================================
          2) 썸네일 그리드 — PC 4열 / 모바일 2열 (원본 .pm_gallery)
          hover: 밝기 50% + 1.4배 확대 (0.45s ease-in-out)
          0건이면 원본처럼 아무것도 표시하지 않는다.
          ================================================================ */}
      {ITEMS.length > 0 && (
        <ul className="flex flex-wrap">
          {ITEMS.map((item) => (
            <li
              key={item.uid}
              className="mt-[2.32%] ml-[2.32%] w-[46.51%] text-center md:ml-[1.18%] md:w-[23.53%]"
            >
              <a href="#" className="group block text-[14px] text-[#666] hover:text-[#A1A1A1]">
                <figure className="m-0 overflow-hidden">
                  <div className="aspect-[4/3] w-full bg-ink-100 transition-all duration-[450ms] ease-in-out group-hover:scale-[1.4] group-hover:brightness-50" />
                </figure>
                <p className="mt-3 truncate px-2.5">{item.title}</p>
                <p className="text-[12px] text-ink-400">{item.date}</p>
              </a>
            </li>
          ))}
        </ul>
      )}

      {/* board_line_2 (원본은 목록 뒤 <br> 후 라인) */}
      <div aria-hidden className="mt-6 h-px w-full bg-[#E4E4E4]" />

      {/* ================================================================
          3) 페이지네이션 — 원본 .page_wrap / page.css
          1페이지뿐이라 prev1 · 1 · next1 (비활성 화살표) 상태
          ================================================================ */}
      <div className="mt-5 text-center">
        <div className="inline-flex items-center">
          <Image src="/images/board/prev1.gif" alt="이전" width={34} height={34} unoptimized />
          <span aria-hidden className="w-[3px]" />
          {/* 현재 페이지 (.page_link_1) */}
          <span className="flex h-[34px] items-center border border-[#1A1A1A] bg-[#1A1A1A] px-3 text-[13px] font-bold text-white">
            1
          </span>
          <span aria-hidden className="w-[3px]" />
          <Image src="/images/board/next1.gif" alt="다음" width={34} height={34} unoptimized />
        </div>
      </div>

        {/* ================================================================
            4) 검색 폼
            ================================================================ */}
        <BoardSearch />
      </Reveal>
    </SubLayout>
  );
}
