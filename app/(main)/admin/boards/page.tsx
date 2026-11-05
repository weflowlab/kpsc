/* ==========================================================================
   관리자 > 보드관리  (원본 bod_manager.php 리뉴얼)
   게시판 3종의 현황(자료 수)과 관리 진입 링크
   ========================================================================== */

import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/db";
import { BOARD_META } from "@/lib/boards-meta";

export const metadata: Metadata = { title: "보드관리" };

/* 게시판별 공개 페이지 경로 */
const PUBLIC_PATHS: Record<string, string> = {
  notice: "/news/notice",
  activities: "/news/activities",
  gallery: "/organization/gallery",
};

export default async function AdminBoardsPage() {
  await requireAdmin();

  const counts = await prisma.post.groupBy({
    by: ["boardKey"],
    _count: { id: true },
  });
  const countOf = (key: string) =>
    counts.find((c) => c.boardKey === key)?._count.id ?? 0;

  return (
    <div>
      <h1 className="mb-5 text-[20px] font-bold">보드관리</h1>

      {/* 세로 스택 — 카드 내부는 고정 폭 컬럼 그리드라
          게시판 이름/카테고리/개수/버튼의 시작 라인이 모두 맞는다 */}
      <div className="space-y-4">
        {Object.values(BOARD_META).map((meta) => (
          <div
            key={meta.key}
            className="grid items-center gap-4 rounded-lg border border-ink-200 bg-white p-5 md:grid-cols-[220px_1fr_72px_auto]"
          >
            {/* 1) 게시판 이름 */}
            <div>
              <h2 className="text-[16px] font-bold">{meta.name}</h2>
              <p className="mt-1 text-[12px] text-ink-400">
                카테고리 {meta.categories.length}개
              </p>
            </div>

            {/* 2) 카테고리 태그 */}
            <div className="flex flex-wrap gap-1">
              {meta.categories.map((cat) => (
                <span
                  key={cat}
                  className="rounded bg-ink-50 px-1.5 py-0.5 text-[11px] text-ink-500"
                >
                  {cat}
                </span>
              ))}
            </div>

            {/* 3) 자료 수 */}
            <span className="justify-self-start rounded-full bg-ink-50 px-2.5 py-1 text-center text-[13px] font-semibold text-ink-700 md:justify-self-center">
              {countOf(meta.key)}개
            </span>

            {/* 4) 버튼 */}
            <div className="flex gap-2 text-[13px]">
              <Link
                href={`/admin/boards/${meta.key}`}
                className="w-[96px] rounded-md bg-ink-900 py-2 text-center text-white hover:bg-brand-600"
              >
                글 관리
              </Link>
              <a
                href={PUBLIC_PATHS[meta.key]}
                target="_blank"
                rel="noreferrer noopener"
                className="w-[96px] rounded-md border border-ink-200 py-2 text-center text-ink-500 hover:border-brand-600 hover:text-brand-600"
              >
                바로가기
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
