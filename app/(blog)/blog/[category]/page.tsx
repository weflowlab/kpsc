// 카테고리 글 목록 페이지 (/retina, /glaucoma, ...). Payload categories 컬렉션의 slug 가 경로.
// 구성: 빵부스러기 > 제목 > 탭(전체 + 모든 주제, 현재 주제 활성) > 카드 그리드 + View more
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategories, getCategory, getPostsByCategory } from "@/lib/payload";
import { Breadcrumb } from "@/components/blog/ui/Breadcrumb";
import { PageTitle } from "@/components/blog/posts/PageTitle";
import { CategoryTabs } from "@/components/blog/posts/CategoryTabs";
import { PostBrowser } from "@/components/blog/posts/PostBrowser";

// 요청 시마다 Payload 에서 조회 (빌드 때 DB 를 미리 조회하지 않는다)
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/blog/[category]">): Promise<Metadata> {
  const { category } = await params;
  const cat = await getCategory(decodeURIComponent(category));
  return cat ? { title: cat.name, description: cat.description } : {};
}

// params 를 최상위에서 읽어 없는 카테고리는 진짜 404 상태코드를 돌려준다 (SEO).
export default async function CategoryPage({ params }: PageProps<"/blog/[category]">) {
  const { category } = await params;
  const cat = await getCategory(decodeURIComponent(category));
  if (!cat) notFound();

  const [posts, categories] = await Promise.all([getPostsByCategory(cat.slug), getCategories()]);

  return (
    // 레퍼런스: 컨테이너 py-12 md:py-16
    <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-site-4xl py-12 md:py-16">
      <Breadcrumb items={[{ label: "블로그 홈", href: "/blog" }, { label: cat.name }]} />
      <PageTitle title={cat.name} />

      {/* 탭: 전체(/posts) + 모든 주제(/slug). 현재 주제가 활성 — 다른 주제로 바로 넘어가는 용도 */}
      {/* 탭(왼쪽) + 정렬 드롭박스(오른쪽) + 목록 */}
      <PostBrowser posts={posts} tabs={<CategoryTabs basePath={`/${cat.slug}`} categories={categories} current={cat.slug} mode="path" />} />
    </div>
  );
}

