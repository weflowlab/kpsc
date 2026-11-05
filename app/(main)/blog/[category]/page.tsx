/* 카테고리별 글 목록 (/blog/[category]) */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SubLayout from "@/components/sub/SubLayout";
import Reveal from "@/components/common/Reveal";
import { getCategories, getCategory, getPosts } from "@/lib/blog";
import { CategoryTabs, BlogGrid } from "@/components/blog/BlogParts";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = await getCategory(decodeURIComponent(category));
  return { title: cat ? `${cat.name} | 블로그` : "블로그" };
}

export default async function BlogCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const slug = decodeURIComponent(category);
  const [categories, cat] = await Promise.all([getCategories(), getCategory(slug)]);
  if (!cat) notFound();
  const posts = await getPosts({ categorySlug: slug });

  return (
    <SubLayout pathname="/blog" banner="news" visualTitle="블로그" hideSubNav>
      <Reveal className="mb-8">
        <CategoryTabs categories={categories} active={slug} />
      </Reveal>
      {cat.description && (
        <p className="mb-6 text-[14px] leading-relaxed text-ink-500">{cat.description}</p>
      )}
      <Reveal>
        <BlogGrid posts={posts} />
      </Reveal>
    </SubLayout>
  );
}
