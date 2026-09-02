"use client";

/* ==========================================================================
   관리자 > 보드관리 글 목록 테이블 — 다중 선택 삭제 + 수정 링크
   ========================================================================== */

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { adminDeletePosts } from "@/app/actions/admin";

type PostRow = {
  id: number;
  /** 표시용 순번 (최신 글이 총 개수) */
  no: number;
  category: string;
  title: string;
  authorName: string;
  hit: number;
  comments: number;
  createdAt: string;
};

export default function PostsTable({
  boardKey,
  posts,
  showComments,
}: {
  boardKey: string;
  posts: PostRow[];
  showComments: boolean;
}) {
  const router = useRouter();
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [busy, setBusy] = useState(false);

  /* 게시글 공개 URL — 클릭 시 새 창으로 실제 글을 연다 */
  const publicUrl = (id: number) =>
    boardKey === "gallery"
      ? `/organization/gallery/${id}`
      : `/news/${boardKey}/${id}`;

  const toggle = (id: number) => {
    const next = new Set(checked);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setChecked(next);
  };

  const onDelete = async () => {
    if (checked.size === 0) return alert("삭제할 글을 선택해 주세요.");
    if (!confirm(`선택한 ${checked.size}개 글을 삭제하시겠습니까?\n(댓글도 함께 삭제됩니다)`))
      return;
    setBusy(true);
    const res = await adminDeletePosts({ boardKey, ids: [...checked] });
    setBusy(false);
    if (!res.ok) return alert(res.error);
    setChecked(new Set());
    router.refresh();
  };

  /* 행 단위 삭제 — 수정 버튼 옆 */
  const onDeleteOne = async (post: PostRow) => {
    if (!confirm(`'${post.title}' 글을 삭제하시겠습니까?\n(댓글도 함께 삭제됩니다)`))
      return;
    const res = await adminDeletePosts({ boardKey, ids: [post.id] });
    if (!res.ok) return alert(res.error);
    router.refresh();
  };

  return (
    <div className="overflow-hidden rounded-lg border border-ink-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-[13px]">
          <thead>
            <tr className="border-b border-ink-200 bg-ink-50 text-left text-ink-500">
              <th className="w-10 p-3 text-center">
                <input
                  type="checkbox"
                  aria-label="전체 선택"
                  checked={checked.size === posts.length && posts.length > 0}
                  onChange={(e) =>
                    setChecked(
                      e.target.checked ? new Set(posts.map((p) => p.id)) : new Set()
                    )
                  }
                />
              </th>
              <th className="p-3">번호</th>
              <th className="p-3">분류</th>
              <th className="p-3">제목</th>
              {showComments && <th className="p-3 text-center">댓글</th>}
              <th className="p-3">작성자</th>
              <th className="p-3 text-center">조회</th>
              <th className="p-3">등록일</th>
              <th className="p-3 text-center">관리</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id} className="border-b border-ink-100 last:border-0 hover:bg-ink-50/50">
                <td className="p-3 text-center">
                  <input
                    type="checkbox"
                    aria-label={`${p.title} 선택`}
                    checked={checked.has(p.id)}
                    onChange={() => toggle(p.id)}
                  />
                </td>
                <td className="p-3 text-ink-400">{p.no}</td>
                <td className="p-3 whitespace-nowrap text-[#D45111]">[{p.category}]</td>
                <td className="max-w-[320px] truncate p-3 font-medium">
                  {/* 제목 클릭 시 실제 게시글을 새 창으로 연다 */}
                  <a
                    href={publicUrl(p.id)}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="hover:text-brand-600 hover:underline"
                    title="새 창에서 글 보기"
                  >
                    {p.title}
                  </a>
                </td>
                {showComments && <td className="p-3 text-center">{p.comments}</td>}
                <td className="p-3 whitespace-nowrap">{p.authorName}</td>
                <td className="p-3 text-center">{p.hit}</td>
                <td className="p-3 whitespace-nowrap text-ink-400">{p.createdAt}</td>
                <td className="p-3 text-center whitespace-nowrap">
                  <Link
                    href={`/admin/boards/${boardKey}/edit?id=${p.id}`}
                    className="rounded border border-ink-200 px-2.5 py-1 text-[12px] text-ink-700 hover:border-brand-600 hover:text-brand-600"
                  >
                    수정
                  </Link>
                  <button
                    type="button"
                    onClick={() => onDeleteOne(p)}
                    className="ml-1 rounded border border-board-tag px-2.5 py-1 text-[12px] text-board-tag hover:bg-board-tag hover:text-white"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={showComments ? 9 : 8} className="p-10 text-center text-ink-400">
                  등록된 글이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-ink-200 bg-ink-50 p-3 text-[13px]">
        <span className="mr-2 whitespace-nowrap text-ink-500">선택 {checked.size}개 →</span>
        <button
          type="button"
          onClick={onDelete}
          disabled={busy}
          className="rounded-md border border-board-tag px-3 py-1.5 text-board-tag hover:bg-board-tag hover:text-white disabled:opacity-50"
        >
          삭제
        </button>
      </div>
    </div>
  );
}
