/* ==========================================================================
   활동 및 소식 > 게시판 글쓰기  (원본 /bbs.php?table=activities&query=write)
   원본 default 스킨 글쓰기 폼 — 카테고리 셀렉트 라벨은 "구분".
   writable 이 아닌 게시판(공지)은 원본처럼 글쓰기가 없으므로 404.
   ========================================================================== */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SubLayout from "@/components/sub/SubLayout";
import Reveal from "@/components/common/Reveal";
import BoardWriteForm from "@/components/board/BoardWriteForm";
import { getBoardMeta } from "@/lib/boards-meta";
import { getSession } from "@/lib/session";

export async function generateMetadata(
  props: PageProps<"/news/[board]/write">
): Promise<Metadata> {
  const { board } = await props.params;
  const meta = getBoardMeta(board);
  if (!meta) return {};
  return { title: `${meta.name} 글쓰기` };
}

export default async function BoardWritePage(props: PageProps<"/news/[board]/write">) {
  const { board } = await props.params;
  const meta = getBoardMeta(board);
  if (!meta || !meta.writable || board === "gallery") notFound();

  const session = await getSession();

  return (
    <SubLayout
      pathname={`/news/${board}`}
      banner="news"
    >
      {/* 원본 #board_wrap 의 AOS fade-up */}
      <Reveal type="fade-up">
        <BoardWriteForm
          board={meta.key}
          categories={meta.categories}
          categoryLabel="구분"
          authorName={session?.name ?? null}
          listHref={`/news/${board}`}
        />
      </Reveal>
    </SubLayout>
  );
}
