/* 블로그 글 상세 (/blog/[category]/[slug]) */
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { RichText } from "@payloadcms/richtext-lexical/react";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import SubLayout from "@/components/sub/SubLayout";
import Reveal from "@/components/common/Reveal";
import { getPost, incrementViews } from "@/lib/blog";
import { formatBlogDate } from "@/components/blog/BlogParts";

type Params = Promise<{ category: string; slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { category, slug } = await params;
  const post = await getPost(decodeURIComponent(category), decodeURIComponent(slug));
  if (!post) return {};
  return { title: post.title, description: post.summary };
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { category, slug } = await params;
  const post = await getPost(decodeURIComponent(category), decodeURIComponent(slug));
  if (!post) notFound();
  await incrementViews(post.id);

  return (
    <SubLayout pathname="/blog" banner="news" visualTitle="블로그" hideSubNav>
      <article className="mx-auto max-w-[760px]">
        <Reveal>
          {/* 헤더 */}
          <div className="border-b border-ink-200 pb-6">
            <div className="mb-3 flex flex-wrap items-center gap-2 text-[13px] text-ink-400">
              {post.category && (
                <Link
                  href={`/blog/${encodeURIComponent(post.category.slug)}`}
                  className="font-semibold text-brand-600 hover:underline"
                >
                  {post.category.name}
                </Link>
              )}
              <span>{formatBlogDate(post.publishedAt)}</span>
              {post.authorName && <span>· {post.authorName}</span>}
              <span className="ml-auto">조회 {post.views + 1}</span>
            </div>
            <h1 className="text-[26px] leading-[1.35] font-bold text-ink-900 md:text-[32px]">
              {post.title}
            </h1>
          </div>

          {/* 요약 상자 */}
          {post.summary && (
            <div className="mt-6 rounded-2xl bg-[#f0f7ff] p-5 text-[15px] leading-relaxed text-ink-700">
              {post.summary}
              {post.keyPoints.length > 0 && (
                <ul className="mt-3 list-disc space-y-1 pl-5 text-[14px] text-ink-600">
                  {post.keyPoints.map((k, i) => (
                    <li key={i}>{k}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* 상단 이미지 */}
          {post.images.length > 0 && (
            <div className="mt-6 space-y-4">
              {post.images.map(
                (im, i) =>
                  im && (
                    <div key={i} className="relative overflow-hidden rounded-2xl">
                      <Image
                        src={im.url}
                        alt={im.alt || post.title}
                        width={im.width || 1200}
                        height={im.height || 675}
                        className="h-auto w-full"
                      />
                    </div>
                  )
              )}
            </div>
          )}

          {/* 본문 */}
          <div
            className="blog-content mt-8 text-[16px] leading-[1.9] text-ink-700
              [&_a]:text-brand-600 [&_a]:underline [&_a]:underline-offset-2
              [&_blockquote]:my-5 [&_blockquote]:border-l-4 [&_blockquote]:border-ink-200 [&_blockquote]:pl-4 [&_blockquote]:text-ink-500
              [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-[22px] [&_h2]:font-bold [&_h2]:text-ink-900
              [&_h3]:mt-7 [&_h3]:mb-2 [&_h3]:text-[18px] [&_h3]:font-bold [&_h3]:text-ink-900
              [&_hr]:my-8 [&_hr]:border-ink-100
              [&_img]:my-5 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-xl
              [&_li]:my-1 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6
              [&_p]:my-4
              [&_table]:my-5 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-ink-200 [&_td]:p-2 [&_th]:border [&_th]:border-ink-200 [&_th]:bg-ink-50 [&_th]:p-2"
          >
            <RichText data={post.content as SerializedEditorState} />
          </div>

          {/* FAQ */}
          {post.faq.length > 0 && (
            <section className="mt-12">
              <h2 className="mb-4 text-[20px] font-bold text-ink-900">자주 묻는 질문</h2>
              <div className="space-y-3">
                {post.faq.map((f, i) => (
                  <div key={i} className="rounded-xl border border-ink-200 p-4">
                    <p className="font-semibold text-ink-900">Q. {f.question}</p>
                    <p className="mt-1.5 whitespace-pre-line text-[14px] leading-relaxed text-ink-600">
                      A. {f.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 출처 */}
          {post.sources.length > 0 && (
            <section className="mt-10">
              <h2 className="mb-3 text-[16px] font-bold text-ink-900">참고 자료</h2>
              <ul className="space-y-1.5 text-[14px]">
                {post.sources.map((s, i) => (
                  <li key={i}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-brand-600 hover:underline"
                    >
                      {s.label}
                    </a>
                    {s.description && <span className="text-ink-400"> — {s.description}</span>}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* 태그 */}
          {post.tags.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <Link
                  key={t}
                  href={`/blog?q=${encodeURIComponent(t)}`}
                  className="rounded-full bg-ink-50 px-3 py-1.5 text-[13px] text-ink-500 hover:bg-ink-100"
                >
                  #{t}
                </Link>
              ))}
            </div>
          )}

          {/* 작성자 카드 */}
          {post.author && (
            <div className="mt-10 flex items-center gap-4 rounded-2xl border border-ink-200 p-5">
              {post.author.photo && (
                <Image
                  src={post.author.photo.url}
                  alt={post.author.name}
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-full object-cover"
                />
              )}
              <div>
                <p className="text-[15px] font-bold text-ink-900">
                  {post.author.name}
                  {post.author.title && (
                    <span className="ml-1.5 text-[13px] font-normal text-ink-400">
                      {post.author.title}
                    </span>
                  )}
                </p>
                {post.author.bio && (
                  <p className="mt-0.5 text-[13px] text-ink-500">{post.author.bio}</p>
                )}
              </div>
            </div>
          )}

          {/* 목록으로 */}
          <div className="mt-12 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center rounded-full border border-ink-200 px-6 py-3 text-[14px] font-semibold text-ink-700 transition-colors hover:border-brand-600 hover:text-brand-600"
            >
              ← 블로그 목록
            </Link>
          </div>
        </Reveal>
      </article>
    </SubLayout>
  );
}
