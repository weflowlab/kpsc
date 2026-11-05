/* ==========================================================================
   조직 구성 > 갤러리  (원본 /bbs.php?table=gallery&pg=32)
   구성 — 원본 gallery_category 스킨 그대로
     1) 카테고리 탭 (#item_category) — 카테고리별 필터 링크
     2) 상단 정보줄 (.pm_gallery_toptext) — 자료수/페이지 + write.gif 버튼
     3) board_line → 썸네일 그리드(.pm_gallery) → board_line_2
     4) 페이지네이션 (.page_wrap)
     5) 검색 폼 (#board_search_wrap)
   데이터는 DB(posts, boardKey=gallery)에서 조회한다.
   ========================================================================== */

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SubLayout from "@/components/sub/SubLayout";
import Reveal from "@/components/common/Reveal";
import BoardSearch from "@/components/board/BoardSearch";
import CategoryTabs from "@/components/board/CategoryTabs";
import CountUp from "@/components/board/CountUp";
import Pagination from "@/components/board/Pagination";
import { BOARD_META } from "@/lib/boards-meta";
import { getBoardPage } from "@/lib/boards";

export const metadata: Metadata = { title: "갤러리" };

export default async function GalleryPage(props: PageProps<"/organization/gallery">) {
  const search = await props.searchParams;
  const meta = BOARD_META.gallery;
  const categories = ["전체", ...meta.categories];

  const rawCategory = search?.category;
  const category =
    typeof rawCategory === "string" && categories.includes(rawCategory)
      ? rawCategory
      : "전체";
  const where = typeof search?.where === "string" ? search.where : undefined;
  const keyword = typeof search?.keyword === "string" ? search.keyword : undefined;
  const requestedPage = Math.max(1, Number(search?.p ?? 1) || 1);

  const { posts, total, page, totalPages } = await getBoardPage("gallery", {
    category,
    page: requestedPage,
    where,
    keyword,
  });

  const pageHrefBase =
    category === "전체"
      ? "/organization/gallery?"
      : `/organization/gallery?category=${encodeURIComponent(category)}&`;

  return (
    <SubLayout
      pathname="/organization/gallery"
      banner="organization"
    >
      {/* 원본 #board_wrap 의 AOS fade-up — 콘텐츠 전체가 아래에서 올라온다 */}
      <Reveal key={`${category}-${page}`} type="fade-up">
        {/* ================================================================
            0) 카테고리 탭 — 원본 #item_category
            ================================================================ */}
        <CategoryTabs
          categories={categories}
          activeCategory={category}
          hrefs={Object.fromEntries(
            categories.map((cat) => [
              cat,
              cat === "전체"
                ? "/organization/gallery"
                : `/organization/gallery?category=${encodeURIComponent(cat)}`,
            ])
          )}
        />

        {/* ================================================================
            1) 상단 정보줄 — 원본 .pm_gallery_toptext (13px #666, pt 30px)
            ================================================================ */}
        <div className="flex items-center justify-between pt-[30px] text-[13px] text-[#666]">
          <p>
            자료수 <b><CountUp value={total} /></b>개,{" "}
            <b><CountUp value={totalPages} /></b>페이지중 <b>{page}</b>페이지
          </p>
          {/* 원본 write.gif 아이콘 버튼 → 글쓰기 페이지 */}
          <Link href="/organization/gallery/write" aria-label="글쓰기">
            <Image src="/images/board/write.gif" alt="글쓰기" width={52} height={20} unoptimized />
          </Link>
        </div>

        {/* board_line — 1px #E4E4E4, margin 7px 0 15px */}
        <div aria-hidden className="mt-[7px] mb-[15px] h-px w-full bg-[#E4E4E4]" />

        {/* ================================================================
            2) 썸네일 그리드 — PC 4열 / 모바일 2열 (원본 .pm_gallery)
            hover: 밝기 50% + 1.4배 확대 (0.45s ease-in-out)
            0건이면 원본처럼 아무것도 표시하지 않는다.
            ================================================================ */}
        {posts.length > 0 && (
          <ul className="flex flex-wrap">
            {posts.map((item) => (
              <li
                key={item.uid}
                className="mt-[2.32%] ml-[2.32%] w-[46.51%] text-center md:ml-[1.18%] md:w-[23.53%]"
              >
                <Link
                  href={`/organization/gallery/${item.uid}`}
                  className="group block text-[14px] text-[#666] hover:text-[#A1A1A1]"
                >
                  <figure className="m-0 overflow-hidden">
                    <div className="relative aspect-[4/3] w-full bg-ink-100 transition-all duration-[450ms] ease-in-out group-hover:scale-[1.4] group-hover:brightness-50">
                      {item.thumbUrl && (
                        <Image
                          src={item.thumbUrl}
                          alt={item.title}
                          fill
                          sizes="(max-width: 768px) 50vw, 25vw"
                          className="object-cover"
                          unoptimized
                        />
                      )}
                    </div>
                  </figure>
                  <p className="mt-3 truncate px-2.5">{item.title}</p>
                  <p className="text-[12px] text-ink-400">{item.date}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* board_line_2 (원본은 목록 뒤 <br> 후 라인) */}
        <div aria-hidden className="mt-6 h-px w-full bg-[#E4E4E4]" />

        {/* ================================================================
            3) 페이지네이션 — 원본 .page_wrap / page.css
            ================================================================ */}
        <Pagination
          current={page}
          total={totalPages}
          href={(p) => `${pageHrefBase}p=${p}`}
        />

        {/* ================================================================
            4) 검색 폼
            ================================================================ */}
        <BoardSearch basePath="/organization/gallery" />
      </Reveal>
    </SubLayout>
  );
}
