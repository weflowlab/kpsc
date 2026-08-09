/* ==========================================================================
   활동 및 소식 > 게시판 리스트  (원본 /bbs.php?table=activities|notice)
   구성 — 원본 default 스킨 그대로
     1) 카테고리 탭 (#item_category, 전체 활성)
     2) 총계 영역 (.total_wrap 13px #666) + write.gif 버튼(activities만)
     3) 2px #B2B2B2 라인 → 테이블형 리스트: 55px 행, 헤더 #F5F4F4 / #45545D,
        분류 [주황 #D45111], 작성자 아이콘, hover 시 #F0EEEE + 볼드(0.8s)
     4) 1px #E4E4E4 라인 → 페이지네이션(원본 gif)
     5) 검색 폼
   전체를 fade-up 으로 감싼다 (원본 #board_wrap AOS).
   ========================================================================== */

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import SubLayout from "@/components/sub/SubLayout";
import Reveal from "@/components/common/Reveal";
import BoardSearch from "@/components/board/BoardSearch";
import BoardList from "@/components/board/BoardList";
import CategoryTabs from "@/components/board/CategoryTabs";
import CountUp from "@/components/board/CountUp";
import { BOARDS, getBoard } from "@/lib/content/board";

/* --------------------------------------------------------------------------
   정적 경로 생성 — activities / notice 두 개
   -------------------------------------------------------------------------- */
export function generateStaticParams() {
  return Object.keys(BOARDS).map((board) => ({ board }));
}

/* --------------------------------------------------------------------------
   메타데이터
   -------------------------------------------------------------------------- */
export async function generateMetadata(
  props: PageProps<"/news/[board]">
): Promise<Metadata> {
  const { board } = await props.params;
  const config = getBoard(board);
  if (!config) return {};
  return { title: config.name, description: config.description };
}

export default async function BoardListPage(props: PageProps<"/news/[board]">) {
  const { board } = await props.params;
  const search = await props.searchParams;
  const config = getBoard(board);
  if (!config) notFound();

  /* 카테고리 필터 — 원본 bbs.php?category= 동작 재현 */
  const rawCategory = search?.category;
  const category =
    typeof rawCategory === "string" && config.categories.includes(rawCategory)
      ? rawCategory
      : "전체";
  const filtered =
    category === "전체"
      ? config.posts
      : config.posts.filter((post) => post.category === category);

  /* 페이지 계산 */
  const page = Math.max(1, Number(search?.p ?? 1) || 1);
  const totalPages = Math.max(1, Math.ceil(filtered.length / config.perPage));
  const start = (page - 1) * config.perPage;
  const visible = filtered.slice(start, start + config.perPage);


  return (
    <SubLayout
      pathname={`/news/${board}`}
      banner="news"
    >
      {/* 원본 #board_wrap 의 AOS fade-up
          key 로 카테고리·페이지가 바뀔 때마다 리마운트 → 진입 애니메이션 재생 */}
      <Reveal key={`${category}-${page}`} type="fade-up">
        {/* ================================================================
            1) 카테고리 탭 — 원본 #item_category (카테고리별 필터 링크)
            ================================================================ */}
        <div className="mb-5">
          <CategoryTabs
            categories={config.categories}
            variant="board"
            activeCategory={category}
            hrefs={Object.fromEntries(
              config.categories.map((cat) => [
                cat,
                cat === "전체"
                  ? `/news/${board}`
                  : `/news/${board}?category=${encodeURIComponent(cat)}`,
              ])
            )}
          />
        </div>

        {/* ================================================================
            2) 총계 영역 — 원본 .total_wrap (13px #666, pb 25px)
            ================================================================ */}
        <div className="flex items-center justify-between pb-[25px] text-[13px] text-[#666]">
          <p>
            Total : <b><CountUp value={filtered.length} /></b>개 Page :{" "}
            <b><CountUp value={page} /></b>/{totalPages}
          </p>
          {/* 글쓰기 버튼 — 원본은 activities 게시판에서만 노출 */}
          {config.writable && (
            <Link href={`/news/${board}/write`} aria-label="글쓰기">
              <Image
                src="/images/board/write.gif"
                alt="글쓰기"
                width={52}
                height={20}
                unoptimized
              />
            </Link>
          )}
        </div>

        {/* title_board_line — 2px #B2B2B2 */}
        <div aria-hidden className="h-[2px] w-full bg-[#B2B2B2]" />

        {/* ================================================================
            4) 데이터 행 + 하단 라인 + 페이지네이션 + 다중선택 레이어
            (체크박스 상태를 공유해야 해서 BoardList 가 함께 렌더링)
            ================================================================ */}
        <BoardList
          board={board}
          posts={visible}
          page={page}
          totalPages={totalPages}
          pageHrefBase={
            category === "전체"
              ? `/news/${board}?`
              : `/news/${board}?category=${encodeURIComponent(category)}&`
          }
        />

        {/* ================================================================
            5) 검색 폼
            ================================================================ */}
        <BoardSearch />
      </Reveal>
    </SubLayout>
  );
}
