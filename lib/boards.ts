/* ==========================================================================
   게시판 DB 조회 레이어 (서버 전용)
   기존 페이지들이 쓰던 BoardPost 형태({no, uid, category, ...})로 변환해
   돌려주므로 페이지 쪽 마크업 수정을 최소화한다.
   ========================================================================== */

import "server-only";
import { prisma } from "@/lib/db";
import {
  formatBoardDate,
  getBoardMeta,
  type BoardKey,
  type BoardRow,
} from "@/lib/boards-meta";
import type { Prisma } from "@/lib/generated/prisma/client";

export type { BoardRow };

export type BoardQuery = {
  category?: string; // "전체" 또는 undefined 면 전체
  page?: number;
  /** 검색 대상 — 원본 셀렉트 값 (ALL/BB_SUBJECT/BB_CONTENT/BB_NAME) */
  where?: string;
  keyword?: string;
};

/* 검색 조건 조립 — 원본 bbs.php 검색 셀렉트 값을 그대로 받는다 */
function searchFilter(where?: string, keyword?: string): Prisma.PostWhereInput {
  const kw = keyword?.trim();
  if (!kw || kw.length < 2) return {};
  const contains = { contains: kw, mode: "insensitive" as const };
  switch (where) {
    case "BB_SUBJECT":
      return { title: contains };
    case "BB_CONTENT":
      return { contentHtml: contains };
    case "BB_NAME":
    case "BB_MB_ID":
      return { authorName: contains };
    default:
      return {
        OR: [{ title: contains }, { contentHtml: contains }, { authorName: contains }],
      };
  }
}

/* --------------------------------------------------------------------------
   목록 조회 — 총계 + 현재 페이지 행
   -------------------------------------------------------------------------- */
export async function getBoardPage(boardKey: BoardKey, query: BoardQuery = {}) {
  const meta = getBoardMeta(boardKey)!;
  const page = Math.max(1, query.page ?? 1);

  const where: Prisma.PostWhereInput = {
    boardKey,
    ...(query.category && query.category !== "전체"
      ? { category: query.category }
      : {}),
    ...searchFilter(query.where, query.keyword),
  };

  const [total, rows] = await Promise.all([
    prisma.post.count({ where }),
    prisma.post.findMany({
      where,
      orderBy: { id: "desc" },
      skip: (page - 1) * meta.perPage,
      take: meta.perPage,
      select: {
        id: true,
        category: true,
        title: true,
        authorName: true,
        hit: true,
        createdAt: true,
        thumbUrl: true,
        secret: true,
        memberId: true,
      },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / meta.perPage));
  const posts: BoardRow[] = rows.map((r, i) => ({
    no: total - (page - 1) * meta.perPage - i,
    uid: r.id,
    category: r.category,
    title: r.title,
    date: formatBoardDate(r.createdAt),
    author: r.authorName,
    hit: r.hit,
    thumbUrl: r.thumbUrl,
    secret: r.secret,
    memberId: r.memberId,
  }));

  return { meta, posts, total, page, totalPages };
}

/* --------------------------------------------------------------------------
   상세 조회 (+조회수 증가)
   -------------------------------------------------------------------------- */
export async function getPost(boardKey: BoardKey, uid: number) {
  if (!Number.isInteger(uid)) return null;
  const post = await prisma.post.findFirst({
    where: { id: uid, boardKey },
    include: {
      comments: { orderBy: { createdAt: "asc" } },
      images: { orderBy: { sort: "asc" } },
    },
  });
  return post;
}

/* 현재 열람자 정보 — 비밀글 열람 판정용 (회원 id + 관리자 여부) */
export async function getViewer(): Promise<{ id: number; isAdmin: boolean } | null> {
  const { getSession } = await import("@/lib/session");
  const session = await getSession();
  if (!session) return null;
  const member = await prisma.member.findUnique({
    where: { id: session.memberId },
    select: { grade: true },
  });
  return { id: session.memberId, isAdmin: member?.grade === "ADMIN" };
}

export async function incrementHit(id: number) {
  /* 실패해도 페이지 렌더에 영향 없도록 조용히 무시 */
  try {
    await prisma.post.update({ where: { id }, data: { hit: { increment: 1 } } });
  } catch {}
}
