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
import { getBoardMeta } from "@/lib/boards-meta";
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

  /* 공지처럼 일반 글쓰기가 막힌 게시판은 최고관리자만 작성 가능 */
  const viewer = await getViewer();
  const isAdmin = viewer?.isAdmin ?? false;
  if (!meta.writable && !isAdmin) notFound();

  /* 답글 / 수정 대상 글 */
  const replyUid = Number(search?.reply) || null;
  const editUid = Number(search?.edit) || null;

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
          categories={meta.categories}
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
