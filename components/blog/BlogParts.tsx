/* KPSC 블로그 공용 파츠 — 카테고리 탭 / 글 카드 그리드 (KPSC 사이트 톤) */
import Link from "next/link";
import Image from "next/image";
import type { BlogCategory, BlogListItem } from "@/lib/blog";

export function formatBlogDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const kst = new Date(d.getTime() + 9 * 60 * 60 * 1000);
  return `${kst.getUTCFullYear()}.${String(kst.getUTCMonth() + 1).padStart(2, "0")}.${String(kst.getUTCDate()).padStart(2, "0")}`;
}

/* 카테고리 탭 — "전체" + 각 카테고리. 현재 선택은 강조 */
export function CategoryTabs({
  categories,
  active,
}: {
  categories: BlogCategory[];
  active: string | null; // null = 전체, 아니면 카테고리 slug
}) {
  const base =
    "rounded-full border px-4 py-2 text-[14px] font-semibold transition-colors";
  const on = "border-ink-900 bg-ink-900 text-white";
  const off = "border-ink-200 text-ink-600 hover:border-brand-600 hover:text-brand-600";
  return (
    <nav className="flex flex-wrap gap-2">
      <Link href="/blog" className={`${base} ${active === null ? on : off}`}>
        전체
      </Link>
      {categories.map((c) => (
        <Link
          key={c.slug}
          href={`/blog/${encodeURIComponent(c.slug)}`}
          className={`${base} ${active === c.slug ? on : off}`}
        >
          {c.name}
        </Link>
      ))}
    </nav>
  );
}

/* 글 카드 */
function BlogCard({ post }: { post: BlogListItem }) {
  const href = post.category
    ? `/blog/${encodeURIComponent(post.category.slug)}/${encodeURIComponent(post.slug)}`
    : `/blog`;
  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-2xl border border-ink-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-ink-300 hover:shadow-[0_20px_50px_-20px_rgba(15,23,42,0.18)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-ink-50">
        {post.thumbnail ? (
          <Image
            src={post.thumbnail.url}
            alt={post.thumbnail.alt || post.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[13px] text-ink-300">
            KPSC
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center gap-2 text-[12px] text-ink-400">
          {post.category && (
            <span className="font-semibold text-brand-600">{post.category.name}</span>
          )}
          <span>{formatBlogDate(post.publishedAt)}</span>
        </div>
        <h3 className="line-clamp-2 text-[17px] font-bold text-ink-900">{post.title}</h3>
        {post.summary && (
          <p className="mt-2 line-clamp-2 text-[14px] leading-relaxed text-ink-500">
            {post.summary}
          </p>
        )}
        <div className="mt-4 flex items-center gap-3 pt-1 text-[12px] text-ink-400">
          {post.authorName && <span>{post.authorName}</span>}
          <span className="ml-auto">조회 {post.views}</span>
        </div>
      </div>
    </Link>
  );
}

/* 글 카드 그리드 (없으면 안내) */
export function BlogGrid({ posts }: { posts: BlogListItem[] }) {
  if (posts.length === 0)
    return (
      <p className="py-24 text-center text-[15px] text-ink-400">
        아직 등록된 글이 없습니다.
      </p>
    );
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((p) => (
        <BlogCard key={p.id} post={p} />
      ))}
    </div>
  );
}
