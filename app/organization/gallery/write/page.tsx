/* ==========================================================================
   조직 구성 > 갤러리 > 글쓰기  (원본 /bbs.php?table=gallery&query=write&pg=32)
   폼 UI 만 원본 스킨 그대로 재현 — DB 연결 전이라 등록은 준비 중 안내만.
   ========================================================================== */

import type { Metadata } from "next";
import SubLayout from "@/components/sub/SubLayout";
import Reveal from "@/components/common/Reveal";
import BoardWriteForm from "@/components/board/BoardWriteForm";

export const metadata: Metadata = { title: "갤러리 글쓰기" };

export default function GalleryWritePage() {
  return (
    <SubLayout
      pathname="/organization/gallery"
      banner="organization"
    >
      {/* 원본 #board_wrap 의 AOS fade-up — 폼 전체가 아래에서 올라온다 */}
      <Reveal type="fade-up">
        <BoardWriteForm
          categories={["미술갤러리", "행사갤러리"]}
          categoryLabel="갤러리"
        />
      </Reveal>
    </SubLayout>
  );
}
