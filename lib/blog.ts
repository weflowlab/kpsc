// 블로그 데이터 계층 (서버 전용). Payload 로컬 API 로 글/카테고리/작성자/브랜드를 읽어
// KPSC 블로그 화면(app/(main)/blog)이 쓰기 좋은 lean 형태로 변환한다.
import "server-only";
import { cache } from "react";
import { getPayload, type Where } from "payload";
import config from "@payload-config";
import type { Media } from "@/payload-types";

const client = () => getPayload({ config });

export type BlogImage = { url: string; alt: string; width?: number; height?: number } | null;
export type BlogCategory = { slug: string; name: string; description?: string };
export type BlogAuthor = {
  slug: string;
  name: string;
  title?: string;
  bio?: string;
  photo: BlogImage;
};
export type BlogListItem = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  category: BlogCategory | null;
  authorName?: string;
  publishedAt: string;
  thumbnail: BlogImage;
  views: number;
};
export type BlogPost = BlogListItem & {
  content: unknown; // lexical richText (RichText 컴포넌트로 렌더)
  keyPoints: string[];
  tags: string[];
  author: BlogAuthor | null;
  images: BlogImage[];
  faq: { question: string; answer: string }[];
  sources: { label: string; href: string; description?: string }[];
};

function img(m: Media | number | null | undefined): BlogImage {
  if (!m || typeof m !== "object" || !m.url) return null;
  return { url: m.url, alt: m.alt ?? "", width: m.width ?? undefined, height: m.height ?? undefined };
}

type Cat = { slug: string; name: string; description?: string | null };
function mapCategory(c: Cat | number | null | undefined): BlogCategory | null {
  if (!c || typeof c !== "object") return null;
  return { slug: c.slug, name: c.name, description: c.description ?? undefined };
}

// 공개 조건: 발행 상태이고 발행일이 현재 이전 (미래 발행일은 예약)
function publishedWhere(): Where {
  return {
    and: [
      { _status: { equals: "published" } },
      {
        or: [
          { publishedAt: { less_than_equal: new Date().toISOString() } },
          { publishedAt: { exists: false } },
        ],
      },
    ],
  };
}

function mapListItem(p: Record<string, unknown>): BlogListItem {
  const cat = p.category as Cat | number | null;
  const author = p.author as { name?: string } | number | null;
  return {
    id: p.id as number,
    slug: (p.slug as string) ?? String(p.id),
    title: p.title as string,
    summary: (p.summary as string) ?? "",
    category: mapCategory(cat),
    authorName: author && typeof author === "object" ? author.name : undefined,
    publishedAt: (p.publishedAt as string) ?? (p.createdAt as string),
    thumbnail: img(p.thumbnail as Media | number | null),
    views: (p.views as number) ?? 0,
  };
}

// ── 카테고리 ──────────────────────────────────────────────
export const getCategories = cache(async (): Promise<BlogCategory[]> => {
  const payload = await client();
  const { docs } = await payload.find({ collection: "categories", sort: "order", limit: 100, depth: 0 });
  return docs.map((c) => ({ slug: c.slug, name: c.name, description: c.description ?? undefined }));
});

export const getCategory = cache(async (slug: string): Promise<BlogCategory | undefined> => {
  return (await getCategories()).find((c) => c.slug === slug);
});

// ── 목록 ──────────────────────────────────────────────────
type ListArgs = { categorySlug?: string; q?: string; limit?: number };

export const getPosts = cache(async ({ categorySlug, q, limit = 100 }: ListArgs = {}): Promise<BlogListItem[]> => {
  const payload = await client();
  const and: Where[] = [publishedWhere()];
  if (categorySlug) and.push({ "category.slug": { equals: categorySlug } });
  const term = q?.trim();
  if (term)
    and.push({
      or: [{ title: { like: term } }, { summary: { like: term } }, { "tags.tag": { like: term } }],
    });
  const { docs } = await payload.find({
    collection: "posts",
    where: { and },
    sort: "-publishedAt",
    limit,
    depth: 1,
  });
  return docs.map((d) => mapListItem(d as unknown as Record<string, unknown>));
});

export const getLatestPosts = cache((n = 6) => getPosts({ limit: n }));

// ── 상세 ──────────────────────────────────────────────────
export const getPost = cache(async (categorySlug: string, slug: string): Promise<BlogPost | undefined> => {
  const payload = await client();
  const { docs } = await payload.find({
    collection: "posts",
    where: {
      and: [publishedWhere(), { "category.slug": { equals: categorySlug } }, { slug: { equals: slug } }],
    },
    limit: 1,
    depth: 2,
  });
  const p = docs[0] as unknown as Record<string, unknown>;
  if (!p) return undefined;
  const base = mapListItem(p);
  const authorDoc = p.author as Record<string, unknown> | number | null;
  const author: BlogAuthor | null =
    authorDoc && typeof authorDoc === "object"
      ? {
          slug: (authorDoc.slug as string) ?? String(authorDoc.id),
          name: authorDoc.name as string,
          title: (authorDoc.title as string) ?? undefined,
          bio: (authorDoc.bio as string) ?? undefined,
          photo: img(authorDoc.photo as Media | number | null),
        }
      : null;
  return {
    ...base,
    content: p.content,
    keyPoints: ((p.keyPoints as { text: string }[]) ?? []).map((k) => k.text),
    tags: ((p.tags as { tag: string }[]) ?? []).map((t) => t.tag),
    author,
    images: ((p.images as { image: Media | number }[]) ?? []).map((i) => img(i.image)).filter((x): x is NonNullable<BlogImage> => !!x),
    faq: ((p.faq as { question: string; answer: string }[]) ?? []).map(({ question, answer }) => ({ question, answer })),
    sources: ((p.sources as { label: string; href: string; description?: string }[]) ?? []).map(({ label, href, description }) => ({ label, href, description })),
  };
});

// 조회수 +1 (초안 버전 생성 없이 DB 직접 갱신)
export async function incrementViews(id: number): Promise<void> {
  const payload = await client();
  try {
    const doc = await payload.findByID({ collection: "posts", id, depth: 0 });
    await payload.db.updateOne({ collection: "posts", id, data: { views: (doc.views ?? 0) + 1 } });
  } catch {
    /* 조회수 실패는 무시 */
  }
}
