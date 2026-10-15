/* ==========================================================================
   관리자 > 보드관리 > 글 작성/수정
   ?id=N 이 있으면 수정, 없으면 새 글. 본문은 HTML 그대로 편집한다.
   ========================================================================== */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/db";
import { getBoardMeta, writableCategories } from "@/lib/boards-meta";
import AdminPostForm from "@/components/admin/AdminPostForm";

export const metadata: Metadata = { title: "글 편집" };

export default async function AdminPostEditPage(
  props: PageProps<"/admin/boards/[key]/edit">
) {
  const admin = await requireAdmin();
  const { key } = await props.params;
  const search = await props.searchParams;
  const meta = getBoardMeta(key);
  if (!meta) notFound();

  const id = Number(search?.id) || null;
  const post = id
    ? await prisma.post.findFirst({
        where: { id, boardKey: meta.key },
        include: { images: { orderBy: { sort: "asc" } } },
      })
    : null;
  if (id && !post) notFound();

  return (
    <div>
      <h1 className="mb-5 text-[20px] font-bold">
        {meta.name} — {post ? "글 수정" : "새 글 작성"}
      </h1>

      <AdminPostForm
        boardKey={meta.key}
        /* 분류 드롭다운 — 새 글은 관리자(ADMIN)가 쓸 수 있는 카테고리만
           (고객의 소리는 VVIP·최고관리자만). 기존 글 수정 시에는 재분류를 위해 전체 노출 */
        categories={post ? meta.categories : writableCategories("ADMIN", meta.key)}
        isGallery={meta.key === "gallery"}
        defaultAuthor={admin.name}
        post={
          post
            ? {
                id: post.id,
                category: post.category,
                title: post.title,
                contentHtml: post.contentHtml,
                authorName: post.authorName,
                thumbUrl: post.thumbUrl,
                images: post.images.map((img) => img.url),
              }
            : null
        }
      />
    </div>
  );
}
