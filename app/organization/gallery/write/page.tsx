/* ==========================================================================
   조직 구성 > 갤러리 > 글쓰기 / 수정  (원본 /bbs.php?table=gallery&query=write)
   - 기본: 새 글 (이미지 최대 5장 필수)
   - ?edit=<uid> : 수정 — 작성자 본인만 (제목/카테고리/본문 불러오기,
     이미지는 새로 올릴 때만 교체)
   ========================================================================== */

import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import SubLayout from "@/components/sub/SubLayout";
import Reveal from "@/components/common/Reveal";
import BoardWriteForm from "@/components/board/BoardWriteForm";
import { BOARD_META } from "@/lib/boards-meta";
import { getSession } from "@/lib/session";
import { getPost } from "@/lib/boards";

export const metadata: Metadata = { title: "갤러리 글쓰기" };

export default async function GalleryWritePage(
  props: PageProps<"/organization/gallery/write">
) {
  const session = await getSession();
  if (!session) redirect("/login");

  const search = await props.searchParams;
  const editUid = Number(search?.edit) || null;

  let initialTitle = "";
  let initialCategory = "";
  let initialContent = "";
  let editing: number | null = null;

  if (editUid) {
    const post = await getPost("gallery", editUid);
    if (!post) notFound();
    if (post.memberId !== session.memberId)
      redirect(`/organization/gallery/${editUid}`);
    initialTitle = post.title;
    initialCategory = post.category;
    initialContent = post.contentHtml;
    editing = post.id;
  }

  return (
    <SubLayout pathname="/organization/gallery" banner="organization">
      {/* 원본 #board_wrap 의 AOS fade-up — 폼 전체가 아래에서 올라온다 */}
      <Reveal type="fade-up">
        <BoardWriteForm
          board="gallery"
          categories={BOARD_META.gallery.categories}
          categoryLabel="갤러리"
          authorName={session.name}
          listHref={editing ? `/organization/gallery/${editing}` : "/organization/gallery"}
          allowFile
          editUid={editing}
          initialTitle={initialTitle}
          initialCategory={initialCategory}
          initialContent={initialContent}
        />
      </Reveal>
    </SubLayout>
  );
}
