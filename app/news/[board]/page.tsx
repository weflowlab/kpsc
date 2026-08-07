/* ==========================================================================
   활동 및 소식 > 게시판 리스트  (원본 /bbs.php?table=activities|notice)
   구성
     1) 카테고리 탭
     2) 총계 영역 — Total / Page + 글쓰기 버튼(activities만 노출)
     3) 테이블형 리스트 — PC는 전체 컬럼, 480px 이하는 제목만 노출
     4) 페이지네이션
     5) 검색 폼
   ========================================================================== */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SubLayout from "@/components/sub/SubLayout";
import BoardSearch from "@/components/board/BoardSearch";
import Pagination from "@/components/board/Pagination";
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

  /* 페이지 계산 */
  const page = Math.max(1, Number(search?.p ?? 1) || 1);
  const totalPages = Math.max(1, Math.ceil(config.posts.length / config.perPage));
  const start = (page - 1) * config.perPage;
  const visible = config.posts.slice(start, start + config.perPage);

  return (
    <SubLayout
      pathname={`/news/${board}`}
      banner="news"
    >
      {/* ================================================================
          1) 카테고리 탭
          ================================================================ */}
      <ul className="scroll-x flex gap-2 pb-1">
        {config.categories.map((cat, i) => (
          <li key={cat} className="shrink-0">
            <button
              type="button"
              className={[
                "border px-4 py-2 text-[13px] whitespace-nowrap transition-colors",
                i === 0
                  ? "border-[#1A1A1A] bg-[#1A1A1A] text-white"
                  : "border-ink-200 text-ink-500 hover:border-brand-600 hover:text-brand-600",
              ].join(" ")}
            >
              {cat}
            </button>
          </li>
        ))}
      </ul>

      {/* ================================================================
          2) 총계 영역
          ================================================================ */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-[13px] text-ink-500">
          Total : <strong className="text-ink-900">{config.posts.length}</strong>개 Page
          : <strong className="text-ink-900">{page}</strong>/{totalPages}
        </p>
        {/* 글쓰기 버튼 — 원본은 activities 게시판에서만 노출 */}
        {config.writable && (
          <button
            type="button"
            className="bg-[#1A1A1A] px-4 py-1.5 text-[12px] text-white transition-colors hover:bg-[#A5A5A5]"
          >
            글쓰기
          </button>
        )}
      </div>

      {/* ================================================================
          3) 테이블형 리스트
          ================================================================ */}
      <div className="mt-3 border-t-2 border-ink-900">
        {/* 헤더 — 모바일에서는 숨김 */}
        <div className="hidden bg-board-head text-[13px] font-semibold text-ink-700 sm:grid sm:grid-cols-[70px_140px_1fr_100px_90px_70px]">
          <span className="py-4 text-center">번호</span>
          <span className="py-4 text-center">분류</span>
          <span className="py-4 text-center">제목</span>
          <span className="py-4 text-center">등록일</span>
          <span className="py-4 text-center">작성자</span>
          <span className="py-4 text-center">조회수</span>
        </div>

        {/* 데이터 행 */}
        {visible.length > 0 ? (
          <ul>
            {visible.map((post) => (
              <li
                key={post.uid}
                className="border-b border-board-line transition-colors hover:bg-ink-50"
              >
                <Link
                  href={`/news/${board}/${post.uid}`}
                  className="grid items-center gap-1 px-2 py-4 sm:grid-cols-[70px_140px_1fr_100px_90px_70px] sm:gap-0 sm:px-0"
                >
                  {/* 번호 — 모바일 숨김 */}
                  <span className="hidden text-center text-[13px] text-ink-400 sm:block">
                    {post.no}
                  </span>

                  {/* 분류 */}
                  <span className="text-center text-[12px] font-semibold text-board-tag sm:text-[13px]">
                    [{post.category}]
                  </span>

                  {/* 제목 */}
                  <span className="truncate px-1 text-[14px] text-ink-800 sm:px-3">
                    {post.title}
                  </span>

                  {/* 등록일 */}
                  <span className="text-center text-[12px] text-ink-400 sm:text-[13px]">
                    {post.date}
                  </span>

                  {/* 작성자 — 모바일 숨김 */}
                  <span className="hidden text-center text-[13px] text-ink-500 sm:block">
                    {post.author}
                  </span>

                  {/* 조회수 — 모바일 숨김 */}
                  <span className="hidden text-center text-[13px] text-ink-400 sm:block">
                    {post.hit}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="border-b border-board-line py-24 text-center text-[14px] text-ink-400">
            등록된 게시물이 없습니다.
          </p>
        )}
      </div>

      {/* ================================================================
          4) 페이지네이션
          ================================================================ */}
      <Pagination
        current={page}
        total={totalPages}
        href={(p) => `/news/${board}?p=${p}`}
      />

      {/* ================================================================
          5) 검색 폼
          ================================================================ */}
      <BoardSearch />
    </SubLayout>
  );
}
