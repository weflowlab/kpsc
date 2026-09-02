/* ==========================================================================
   관리자 > 보드관리 > 게시판별 글 목록
   삭제(다중) / 수정 / 새 글 작성
   ========================================================================== */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/db";
import { getBoardMeta } from "@/lib/boards-meta";
import PostsTable from "@/components/admin/PostsTable";
import { kstDate } from "@/lib/datetime";

export async function generateMetadata(
  props: PageProps<"/admin/boards/[key]">
): Promise<Metadata> {
  const { key } = await props.params;
  const meta = getBoardMeta(key);
  return meta ? { title: `보드관리 - ${meta.name}` } : {};
}

const PER_PAGE = 20;

export default async function AdminBoardPostsPage(
  props: PageProps<"/admin/boards/[key]">
) {
  await requireAdmin();
  const { key } = await props.params;
  const search = await props.searchParams;
  const meta = getBoardMeta(key);
  if (!meta) notFound();

  const page = Math.max(1, Number(search?.p ?? 1) || 1);
  const [total, posts] = await Promise.all([
    prisma.post.count({ where: { boardKey: meta.key } }),
    prisma.post.findMany({
      where: { boardKey: meta.key },
      orderBy: { id: "desc" },
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
      select: {
        id: true,
        category: true,
        title: true,
        authorName: true,
        hit: true,
        createdAt: true,
        _count: { select: { comments: true } },
      },
    }),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[20px] font-bold">
          <Link href="/admin/boards" className="text-ink-400 hover:text-brand-600">
            보드관리
          </Link>{" "}
          <span className="text-ink-300">/</span> {meta.name}{" "}
          <span className="text-[14px] font-normal whitespace-nowrap text-ink-500">
            전체 {total}개
          </span>
        </h1>
        <Link
          href={`/admin/boards/${meta.key}/edit`}
          className="h-9 shrink-0 rounded-md bg-ink-900 px-4 text-[13px] leading-9 whitespace-nowrap text-white hover:bg-brand-600"
        >
          + 새 글 작성
        </Link>
      </div>

      <PostsTable
        boardKey={meta.key}
        showComments={meta.comments}
        posts={posts.map((p, i) => ({
          id: p.id,
          /* 표시용 순번 — 최신 글이 총 개수, 마지막 글이 1 */
          no: total - (page - 1) * PER_PAGE - i,
          category: p.category,
          title: p.title,
          authorName: p.authorName,
          hit: p.hit,
          comments: p._count.comments,
          createdAt: kstDate(p.createdAt),
        }))}
      />

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-1 text-[13px]">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/boards/${meta.key}?p=${p}`}
              className={[
                "rounded px-3 py-1.5",
                p === page
                  ? "bg-ink-900 font-bold text-white"
                  : "border border-ink-200 bg-white text-ink-500 hover:border-brand-600",
              ].join(" ")}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
