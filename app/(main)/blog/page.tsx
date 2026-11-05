/* 블로그 목록 (/blog) — 전체 글 + 카테고리 탭 (+ ?q= 검색) */
import type { Metadata } from "next";
import SubLayout from "@/components/sub/SubLayout";
import Reveal from "@/components/common/Reveal";
import { getCategories, getPosts } from "@/lib/blog";
import { CategoryTabs, BlogGrid } from "@/components/blog/BlogParts";

export const metadata: Metadata = { title: "블로그" };

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : undefined;
  const [categories, posts] = await Promise.all([getCategories(), getPosts({ q })]);

  return (
    <SubLayout pathname="/blog" banner="news" visualTitle="블로그" hideSubNav>
      <Reveal className="mb-8">
        <CategoryTabs categories={categories} active={null} />
      </Reveal>
      {q && (
        <p className="mb-6 text-[14px] text-ink-500">
          <b className="text-ink-900">“{q}”</b> 검색 결과 {posts.length}건
        </p>
      )}
      <Reveal>
        <BlogGrid posts={posts} />
      </Reveal>
    </SubLayout>
  );
}
