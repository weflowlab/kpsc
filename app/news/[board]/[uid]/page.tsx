/* ==========================================================================
   활동 및 소식 > 게시판 상세  (원본 /bbs.php?query=view&uid=...)
   구성
     1) 제목
     2) 메타 정보 한 줄 — 작성자 | 등록일 | 조회수  (하단 2px 검정 라인)
     3) 기능 버튼 4개 — 목록 / 답변 / 수정 / 삭제
     4) 첨부파일 영역
     5) 본문
     6) 댓글 영역 — activities 게시판에서만 노출
   ※ 원본에는 이전글/다음글 네비게이션이 없어 목록 버튼으로만 복귀한다.
   ========================================================================== */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SubLayout from "@/components/sub/SubLayout";
import { BOARDS, getBoard } from "@/lib/content/board";

/* --------------------------------------------------------------------------
   정적 경로 생성 — 두 게시판의 모든 게시물
   -------------------------------------------------------------------------- */
export function generateStaticParams() {
  return Object.entries(BOARDS).flatMap(([board, config]) =>
    config.posts.map((post) => ({ board, uid: String(post.uid) }))
  );
}

/* --------------------------------------------------------------------------
   메타데이터
   -------------------------------------------------------------------------- */
export async function generateMetadata(
  props: PageProps<"/news/[board]/[uid]">
): Promise<Metadata> {
  const { board, uid } = await props.params;
  const post = getBoard(board)?.posts.find((p) => String(p.uid) === uid);
  return post ? { title: post.title } : {};
}

export default async function BoardViewPage(props: PageProps<"/news/[board]/[uid]">) {
  const { board, uid } = await props.params;
  const config = getBoard(board);
  const post = config?.posts.find((p) => String(p.uid) === uid);
  if (!config || !post) notFound();

  /* 원본 날짜 표기 26.07.07 → 2026.07.07 로 변환 */
  const fullDate = `20${post.date.replace(/\./g, ".")}`;

  return (
    <SubLayout
      pathname={`/news/${board}`}
      banner="news"
    >
      {/* ================================================================
          1) 제목
          ================================================================ */}
      <h2 className="text-center text-[18px] font-bold text-ink-700 lg:text-[20px]">
        {post.title}
      </h2>

      {/* ================================================================
          2) 메타 정보 한 줄
          ================================================================ */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 border-b-2 border-ink-900 pb-4 text-[13px] text-ink-500">
        <span>👤 {post.author}</span>
        <span aria-hidden className="text-ink-200">
          |
        </span>
        <span>📅 {fullDate}</span>
        <span aria-hidden className="text-ink-200">
          |
        </span>
        <span>👁 {post.hit}</span>
      </div>

      {/* ================================================================
          3) 기능 버튼 4개
          ================================================================ */}
      <div className="mt-4 flex justify-center gap-2">
        <Link
          href={`/news/${board}`}
          className="border border-ink-200 px-4 py-1.5 text-[12px] text-ink-700 transition-colors hover:border-brand-600 hover:text-brand-600"
        >
          목록
        </Link>
        {["답변", "수정", "삭제"].map((label) => (
          <button
            key={label}
            type="button"
            className="border border-ink-200 px-4 py-1.5 text-[12px] text-ink-500 transition-colors hover:border-brand-600 hover:text-brand-600"
          >
            {label}
          </button>
        ))}
      </div>

      {/* ================================================================
          4) 첨부파일 영역 — 원본은 비어 있음
          ================================================================ */}
      <div className="mt-4 border-b border-ink-100" />

      {/* ================================================================
          5) 본문
          ================================================================ */}
      <article className="mt-8 mb-24 min-h-[200px] text-[15px] leading-[1.9] text-ink-700">
        {post.content ? (
          post.content.map((line, i) =>
            line === "" ? (
              <br key={i} />
            ) : (
              <p key={i}>{line}</p>
            )
          )
        ) : (
          <p className="text-ink-400">본문 내용이 없습니다.</p>
        )}
      </article>

      {/* ================================================================
          6) 댓글 영역 — activities 게시판만 사용
          ================================================================ */}
      {config.comments && (
        <section className="border-t border-ink-200 pt-8">
          <h3 className="text-[15px] font-bold text-ink-900">💬 사용자 의견입니다.</h3>

          {/* 댓글 목록 — 원본 0건 */}
          <p className="mt-4 py-8 text-center text-[13px] text-ink-400">
            등록된 의견이 없습니다.
          </p>

          {/* 입력 폼 */}
          <div className="flex flex-col gap-2 sm:flex-row">
            <textarea
              aria-label="의견 입력"
              rows={3}
              className="flex-1 border border-ink-200 p-3 text-[14px] outline-none focus:border-brand-600"
            />
            <button
              type="button"
              className="shrink-0 bg-[#1A1A1A] px-6 py-3 text-[13px] text-white transition-colors hover:bg-[#A5A5A5] sm:w-24"
            >
              등 록
            </button>
          </div>
        </section>
      )}
    </SubLayout>
  );
}
