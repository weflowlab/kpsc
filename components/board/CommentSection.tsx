"use client";

/* ==========================================================================
   댓글 영역 (원본 #comment_wrap — activities 스킨)
   원본 재현 포인트
   - 타이틀 바 (bg #666) + 접기 버튼(btn_comment_hide.gif) — 접기 실동작
   - 이모티콘 박스 (.comment_list_face) — 클릭 시 본문에 문자 이모티콘 삽입
   - 입력 폼 박스 — 로그인 회원 전용 (원본의 이름/비밀번호 비회원 방식 대신)
   ========================================================================== */

import { useState } from "react";
import Image from "next/image";
import { createComment, deleteComment } from "@/app/actions/board";

export type CommentItem = {
  id: number;
  content: string;
  authorName: string;
  memberId: number | null;
  createdAt: string; // "yyyy.mm.dd hh:mm"
};

export default function CommentSection({
  postId,
  comments,
  me,
}: {
  postId: number;
  comments: CommentItem[];
  /** 로그인 회원 id — 비로그인이면 null */
  me: number | null;
}) {
  const [open, setOpen] = useState(true);
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const onSubmit = async () => {
    if (pending) return;
    if (!me) return setError("회원으로 로그인해야 이용하실 수 있습니다.");
    if (!content.trim()) return setError("의견을 입력해 주세요.");
    setError(null);
    setPending(true);
    try {
      const res = await createComment({ postId, content });
      if (!res.ok) return setError(res.error);
      setContent("");
      /* revalidatePath 결과를 반영하기 위해 새로고침 */
      window.location.reload();
    } finally {
      setPending(false);
    }
  };

  const onDelete = async (id: number) => {
    if (!confirm("댓글을 삭제하시겠습니까?")) return;
    const res = await deleteComment(id);
    if (!res.ok) return alert(res.error);
    window.location.reload();
  };

  return (
    <section className="mb-[30px] px-2.5">
      {/* 타이틀 바 — bg #666, 좌 아이콘+문구 / 우 접기 버튼 */}
      <div className="mb-[3%] flex w-full items-center justify-between bg-[#666] p-2.5">
        <p className="flex items-center gap-1.5 text-[14px] text-white">
          <Image src="/images/board/ico_comment_tt.gif" alt="" width={17} height={17} unoptimized />
          사용자 의견입니다. {comments.length > 0 && `(${comments.length})`}
        </p>
        <button
          type="button"
          aria-label={open ? "댓글 접기" : "댓글 펼치기"}
          onClick={() => setOpen((v) => !v)}
          className="cursor-pointer"
        >
          <Image src="/images/board/btn_comment_hide.gif" alt="댓글 접기" width={74} height={17} unoptimized />
        </button>
      </div>

      {open && (
        <>
          {/* ============ 댓글 목록 ============ */}
          {comments.length > 0 && (
            <ul className="mb-[2%] space-y-2">
              {comments.map((c) => (
                <li
                  key={c.id}
                  className="border border-[#D7D7D7] bg-white p-3 text-[13px] text-ink-700"
                >
                  <div className="mb-1 flex items-center justify-between text-[12px] text-ink-400">
                    <span className="flex items-center gap-1 font-semibold text-ink-700">
                      <Image src="/images/board/default_icon.gif" alt="" width={16} height={16} unoptimized />
                      {c.authorName}
                    </span>
                    <span className="flex items-center gap-2">
                      {c.createdAt}
                      {me !== null && c.memberId === me && (
                        <button
                          type="button"
                          onClick={() => onDelete(c.id)}
                          className="text-[12px] text-board-tag hover:underline"
                        >
                          삭제
                        </button>
                      )}
                    </span>
                  </div>
                  <p className="leading-[1.7] whitespace-pre-line">{c.content}</p>
                </li>
              ))}
            </ul>
          )}

          {/* ============ 입력 폼 박스 ============ */}
          <div className="mt-[4%] mb-[4%] w-full border border-[#D7D7D7] bg-[#eee] p-[13px] shadow-[2px_2px_2px_0px_#eee]">
            <textarea
              aria-label="의견 입력"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={me ? "" : "회원으로 로그인해야 의견을 남길 수 있습니다."}
              disabled={!me}
              className="h-[60px] w-full resize-y border border-[#DFDFDF] bg-white p-1.5 text-[13px] outline-none disabled:bg-[#f5f5f5]"
            />

            {error && (
              <p role="alert" className="mt-1.5 text-[12px] text-board-tag">
                {error}
              </p>
            )}

            {/* 등록 바 — 원본 .comment_write_buT */}
            <button
              type="button"
              onClick={onSubmit}
              disabled={pending}
              className="mt-2.5 flex w-full cursor-pointer items-center justify-center gap-1.5 border border-[#676767] bg-[#7A7A7A] text-[14px] leading-[30px] font-bold text-white duration-700 hover:border-[#CECECE] hover:bg-[#E9E9E9] hover:text-black disabled:opacity-60"
            >
              <Image
                src="/images/board/btn_write_icon.gif"
                alt=""
                width={8}
                height={13}
                unoptimized
              />
              {pending ? "등록 중..." : "등 록"}
            </button>
          </div>
        </>
      )}
    </section>
  );
}
