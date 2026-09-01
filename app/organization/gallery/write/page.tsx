/* ==========================================================================
   조직 구성 > 갤러리 > 글쓰기  (원본 /bbs.php?table=gallery&query=write&pg=32)
   원본 스킨 그대로의 폼 — 이미지 첨부 필수, 등록 시 DB 저장.
   ========================================================================== */

import type { Metadata } from "next";
import SubLayout from "@/components/sub/SubLayout";
import Reveal from "@/components/common/Reveal";
import BoardWriteForm from "@/components/board/BoardWriteForm";
import { BOARD_META } from "@/lib/boards-meta";
import { getSession } from "@/lib/session";

export const metadata: Metadata = { title: "갤러리 글쓰기" };

export default async function GalleryWritePage() {
  const session = await getSession();

  return (
    <SubLayout
      pathname="/organization/gallery"
      banner="organization"
    >
      {/* 원본 #board_wrap 의 AOS fade-up — 폼 전체가 아래에서 올라온다 */}
      <Reveal type="fade-up">
        <BoardWriteForm
          board="gallery"
          categories={BOARD_META.gallery.categories}
          categoryLabel="갤러리"
          authorName={session?.name ?? null}
          listHref="/organization/gallery"
        />
      </Reveal>
    </SubLayout>
  );
}
