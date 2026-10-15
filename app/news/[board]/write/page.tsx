/* ==========================================================================
   활동 및 소식 > 게시판 글쓰기 / 답글 / 수정  (원본 /bbs.php?query=write)
   - 기본: 새 글
   - ?reply=<uid> : 답글 — 제목에 RE: + 원문 인용 프리필
   - ?edit=<uid>  : 수정 — 작성자 본인만 (본문/제목/카테고리 불러오기)
   writable 이 아닌 게시판(공지)은 글쓰기가 없으므로 404.
   ========================================================================== */

import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import SubLayout from "@/components/sub/SubLayout";
import Reveal from "@/components/common/Reveal";
import BoardWriteForm from "@/components/board/BoardWriteForm";
import {
  getBoardMeta,
  canWriteAnyCategory,
  canWriteCategory,
  writableCategories,
} from "@/lib/boards-meta";
import { getSession } from "@/lib/session";
import { getPost, getViewer } from "@/lib/boards";

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
  const search = await props.searchParams;
  const meta = getBoardMeta(board);
  if (!meta || board === "gallery") notFound();

  const session = await getSession();
  if (!session) redirect("/login");

  const viewer = await getViewer();
  const isAdmin = viewer?.isAdmin ?? false;

  /* 답글 / 수정 대상 글 */
  const replyUid = Number(search?.reply) || null;
  const editUid = Number(search?.edit) || null;

  /* 새 글은 이 게시판에 (어느 카테고리든) 쓸 수 있는 등급만 접근 가능.
     수정(editUid)은 아래에서 작성자 본인/관리자 여부로 판정하므로 등급 제한에서 제외한다.
     (읽기는 누구나 가능하므로 목록/상세는 열린다) */
  if (!editUid && !canWriteAnyCategory(viewer?.grade, board)) notFound();

  let initialTitle = "";
  let initialCategory = "";
  let initialContent = "";
  let editing: number | null = null;

  if (editUid) {
    const post = await getPost(meta.key, editUid);
    if (!post) notFound();
    /* 본인 글 또는 관리자만 수정 가능 */
    if (post.memberId !== session.memberId && !isAdmin)
      redirect(`/news/${board}/${editUid}`);
    initialTitle = post.title;
    initialCategory = post.category;
    initialContent = post.contentHtml;
    editing = post.id;
  } else if (replyUid) {
    const post = await getPost(meta.key, replyUid);
    if (post) {
      /* 답글도 새 글 작성이므로 원글 카테고리에 쓸 수 있는 등급만 허용 */
      if (!canWriteCategory(viewer?.grade, board, post.category))
        redirect(`/news/${board}/${replyUid}`);
      initialTitle = post.title.startsWith("RE:") ? post.title : `RE: ${post.title}`;
      initialCategory = post.category;
      /* 원문 인용 — 회색 인용 블록 */
      initialContent =
        `<div><br></div><div style="color:#888;border-left:3px solid #ddd;padding-left:10px">` +
        post.contentHtml +
        `</div>`;
    }
  }

  return (
    <SubLayout pathname={`/news/${board}`} banner="news">
      {/* 원본 #board_wrap 의 AOS fade-up */}
      <Reveal type="fade-up">
        <BoardWriteForm
          board={meta.key}
          /* 말머리 선택지 — 관리자는 수정 시 모든 카테고리, 그 외에는 쓸 수 있는 등급 카테고리만 */
          categories={isAdmin ? meta.categories : writableCategories(viewer?.grade, board)}
          categoryLabel="구분"
          authorName={session.name}
          listHref={editing ? `/news/${board}/${editing}` : `/news/${board}`}
          allowSecret={meta.key === "activities"}
          allowFile={false}
          editUid={editing}
          initialTitle={initialTitle}
          initialCategory={initialCategory}
          initialContent={initialContent}
        />
      </Reveal>
    </SubLayout>
  );
}
