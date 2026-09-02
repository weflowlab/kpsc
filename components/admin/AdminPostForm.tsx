"use client";

/* ==========================================================================
   관리자 글 작성/수정 폼 — adminSavePost 서버 액션 호출
   본문은 원본 데이터와 동일하게 HTML 로 저장한다 (textarea 직접 편집)
   ========================================================================== */

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { adminSavePost } from "@/app/actions/admin";
import RichTextEditor from "@/components/board/RichTextEditor";

type PostData = {
  id: number;
  category: string;
  title: string;
  contentHtml: string;
  authorName: string;
  thumbUrl: string | null;
  images: string[];
};

const FIELD =
  "w-full rounded-md border border-ink-200 bg-white px-3 py-2 text-[13px] outline-none focus:border-brand-600";
const LABEL = "mb-1.5 block text-[13px] font-semibold text-ink-700";

export default function AdminPostForm({
  boardKey,
  categories,
  isGallery,
  defaultAuthor,
  post,
}: {
  boardKey: string;
  categories: string[];
  isGallery: boolean;
  defaultAuthor: string;
  post: PostData | null;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (pending) return;
    setPending(true);
    setError(null);
    try {
      const formData = new FormData(e.currentTarget);
      formData.set("board", boardKey);
      if (post) formData.set("id", String(post.id));
      const res = await adminSavePost(formData);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      router.push(`/admin/boards/${boardKey}`);
      router.refresh();
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-lg border border-ink-200 bg-white p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="post-category" className={LABEL}>
            분류
          </label>
          <select
            id="post-category"
            name="category"
            defaultValue={post?.category ?? ""}
            className={FIELD}
          >
            <option value="" disabled>
              카테고리 선택
            </option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="post-author" className={LABEL}>
            작성자 표기
          </label>
          <input
            id="post-author"
            name="author"
            type="text"
            defaultValue={post?.authorName ?? defaultAuthor}
            className={FIELD}
          />
        </div>
      </div>

      <div>
        <label htmlFor="post-subject" className={LABEL}>
          제목
        </label>
        <input
          id="post-subject"
          name="subject"
          type="text"
          defaultValue={post?.title ?? ""}
          className={FIELD}
        />
      </div>

      <div>
        <span className={LABEL}>본문</span>
        <RichTextEditor name="content" defaultHtml={post?.contentHtml ?? ""} />
      </div>

      {/* 갤러리 이미지 — 최대 5장 */}
      {isGallery && (
        <div>
          <span className={LABEL}>
            이미지 (최대 5장){post ? " — 새로 선택하면 전체 교체" : " · 필수"}
          </span>
          {/* 현재 저장된 이미지들 */}
          {post && (post.images.length > 0 || post.thumbUrl) && (
            <div className="mb-2 flex flex-wrap gap-2">
              {(post.images.length > 0
                ? post.images
                : post.thumbUrl
                  ? [post.thumbUrl]
                  : []
              ).map((url, i) => (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  key={i}
                  src={url}
                  alt={`현재 이미지 ${i + 1}`}
                  className="h-24 w-24 rounded border border-ink-200 object-cover"
                />
              ))}
            </div>
          )}
          <input
            type="file"
            name="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            className="block cursor-pointer text-[13px] text-ink-500 file:mr-3 file:cursor-pointer file:rounded-md file:border file:border-ink-300 file:bg-white file:px-4 file:py-2 file:text-[13px] file:text-ink-700 hover:file:border-brand-600 hover:file:text-brand-600"
          />
        </div>
      )}

      {error && (
        <p role="alert" className="text-[13px] text-board-tag">
          {error}
        </p>
      )}

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-ink-900 px-6 py-2.5 text-[14px] font-semibold text-white hover:bg-brand-600 disabled:opacity-50"
        >
          {pending ? "저장 중..." : post ? "수정 저장" : "등록"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md border border-ink-200 px-6 py-2.5 text-[14px] text-ink-500 hover:border-ink-400"
        >
          취소
        </button>
      </div>
    </form>
  );
}
