/* ==========================================================================
   조직 구성 > 갤러리 > 상세  (원본 /bbs.php?table=gallery&query=view)
   구성 — 게시판 상세와 같은 뼈대: 제목 / 정보줄 / 이미지 + 본문 / 목록 버튼
   ========================================================================== */

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SubLayout from "@/components/sub/SubLayout";
import Reveal from "@/components/common/Reveal";
import { getPost, incrementHit } from "@/lib/boards";
import { kstDateDot } from "@/lib/datetime";

export async function generateMetadata(
  props: PageProps<"/organization/gallery/[uid]">
): Promise<Metadata> {
  const { uid } = await props.params;
  const post = await getPost("gallery", Number(uid));
  return post ? { title: post.title } : {};
}

export default async function GalleryViewPage(
  props: PageProps<"/organization/gallery/[uid]">
) {
  const { uid } = await props.params;
  const post = await getPost("gallery", Number(uid));
  if (!post) notFound();

  await incrementHit(post.id);

  const fullDate = kstDateDot(post.createdAt);

  return (
    <SubLayout
      pathname="/organization/gallery"
      banner="organization"
    >
      <Reveal type="fade-up">
        {/* 제목 */}
        <h2 className="text-center text-[18px] font-bold text-[#666] md:text-[20px]">
          <span className="text-[#D45111]">[{post.category}]</span> {post.title}
        </h2>

        {/* 정보줄 */}
        <div className="mt-[2%] w-full border-b-2 border-black text-center text-[14px] leading-[50px] text-black">
          <span className="inline-flex items-center gap-1 px-2.5 md:px-[30px]">
            <Image src="/images/board/icon_admin.gif" alt="" width={16} height={16} unoptimized />
            {post.authorName}
          </span>
          |
          <span className="inline-flex items-center gap-1 px-2.5 md:px-[30px]">
            <Image src="/images/board/icon_day.gif" alt="" width={16} height={16} unoptimized />
            {fullDate}
          </span>
          |
          <span className="inline-flex items-center gap-1 px-2.5 md:px-[30px]">
            <Image src="/images/board/icon_search.gif" alt="" width={16} height={16} unoptimized />
            {post.hit + 1}
          </span>
        </div>

        {/* 목록보기 버튼 */}
        <div className="mt-4 flex justify-center gap-1">
          <Link href="/organization/gallery" aria-label="목록보기">
            <Image src="/images/board/vlist.gif" alt="목록보기" width={52} height={20} unoptimized />
          </Link>
        </div>

        {/* 이미지 + 본문 */}
        <article className="mt-[30px] mb-[100px] w-full">
          {post.thumbUrl && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={post.thumbUrl}
              alt={post.title}
              className="mx-auto mb-8 h-auto max-w-full"
            />
          )}
          {post.contentHtml && (
            <div
              className="text-[13.5px] leading-[1.8] text-ink-700 [&_a]:underline"
              dangerouslySetInnerHTML={{ __html: post.contentHtml }}
            />
          )}
        </article>
      </Reveal>
    </SubLayout>
  );
}
