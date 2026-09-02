"use client";

/* ==========================================================================
   게시글 상세 상단 버튼 — 목록보기 / 답글 / 수정 / 삭제 (원본 .view-top-bu)
   - 목록보기: 항상
   - 답글: 로그인 회원 (writable 게시판) — RE: 프리필 글쓰기로 이동
   - 수정/삭제: 작성자 본인 또는 관리자만
   ========================================================================== */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deletePost } from "@/app/actions/board";
import LoadingOverlay from "@/components/common/LoadingOverlay";

export default function PostActions({
  uid,
  listHref,
  writeHref,
  canReply,
  canEdit,
}: {
  uid: number;
  /** 목록 경로 */
  listHref: string;
  /** 글쓰기 경로 (답글/수정 시 ?reply=/?edit= 를 붙인다) */
  writeHref: string;
  canReply: boolean;
  canEdit: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const onDelete = async () => {
    if (!confirm("이 글을 삭제하시겠습니까?\n삭제 후에는 되돌릴 수 없습니다.")) return;
    /* 스피너로 화면을 덮어 404 깜빡임을 가린 뒤 목록으로 이동한다 */
    setBusy(true);
    const res = await deletePost(uid);
    if (!res.ok) {
      setBusy(false);
      return alert(res.error);
    }
    window.location.href = listHref;
  };

  /* 4개 버튼 공통 스타일 — 높이/테두리/글자 통일 */
  const btn =
    "flex h-[30px] cursor-pointer items-center justify-center border border-[#D2D2D2] bg-[#F7F7F7] px-4 text-[13px] text-[#555] transition-colors hover:border-[#AE031B] hover:bg-white hover:text-[#AE031B]";

  return (
    <div className="mt-4 flex justify-center gap-1.5">
      {busy && <LoadingOverlay label="처리 중..." />}
      <a href={listHref} className={btn}>
        목록보기
      </a>
      {canReply && (
        <button
          type="button"
          onClick={() => router.push(`${writeHref}?reply=${uid}`)}
          className={btn}
        >
          답글
        </button>
      )}
      {canEdit && (
        <>
          <button
            type="button"
            onClick={() => router.push(`${writeHref}?edit=${uid}`)}
            className={btn}
          >
            수정
          </button>
          <button type="button" onClick={onDelete} className={btn}>
            삭제
          </button>
        </>
      )}
    </div>
  );
}
