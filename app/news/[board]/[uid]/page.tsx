/* ==========================================================================
   활동 및 소식 > 게시판 상세  (원본 /bbs.php?query=view&uid=...)
   구성 — 원본 default 스킨 그대로
     1) 제목 (.view-top-subject) — 가운데, 20px 볼드 #666, [분류] 주황 프리픽스
     2) 정보줄 (.view-top-infor) — 아이콘 gif + 작성자 | 등록일 | 조회수,
        50px 줄높이 + 하단 2px 검정 라인
     3) 버튼줄 (.view-top-bu) — 원본 gif 버튼 (목록보기/답글/수정/삭제)
     4) 본문 (.view-editor) — mt 30px / mb 100px
     5) 댓글 영역 (activities 만) — CommentSection (실동작)
   데이터는 DB 에서 조회하고, 열람 시 조회수를 1 올린다.
   ========================================================================== */

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import SubLayout from "@/components/sub/SubLayout";
import Reveal from "@/components/common/Reveal";
import BoardList from "@/components/board/BoardList";
import BoardSearch from "@/components/board/BoardSearch";
import CategoryTabs from "@/components/board/CategoryTabs";
import CommentSection from "@/components/board/CommentSection";
import CountUp from "@/components/board/CountUp";
import { getBoardMeta } from "@/lib/boards-meta";
import { getBoardPage, getPost, getViewer, incrementHit } from "@/lib/boards";
import { getSession } from "@/lib/session";
import { kstDateDot, kstDateTime } from "@/lib/datetime";

/* --------------------------------------------------------------------------
   메타데이터
   -------------------------------------------------------------------------- */
export async function generateMetadata(
  props: PageProps<"/news/[board]/[uid]">
): Promise<Metadata> {
  const { board, uid } = await props.params;
  const meta = getBoardMeta(board);
  if (!meta) return {};
  const post = await getPost(meta.key, Number(uid));
  return post ? { title: post.title } : {};
}

export default async function BoardViewPage(props: PageProps<"/news/[board]/[uid]">) {
  const { board, uid } = await props.params;
  const meta = getBoardMeta(board);
  if (!meta || board === "gallery") notFound();

  const post = await getPost(meta.key, Number(uid));
  if (!post) notFound();

  /* 하단 목록/세션/열람자 조회 */
  const [listData, session, viewer] = await Promise.all([
    getBoardPage(meta.key, { page: 1 }),
    getSession(),
    getViewer(),
  ]);

  /* 비밀글 접근 제어 — 작성자 본인 또는 관리자만. 그 외는 목록으로 돌려보낸다 */
  const canView =
    !post.secret ||
    viewer?.isAdmin ||
    (viewer != null && post.memberId === viewer.id);
  if (!canView) redirect(`/news/${board}`);

  /* 조회수 증가 (열람 가능할 때만) */
  await incrementHit(post.id);

  const categories = ["전체", ...meta.categories];
  const fullDate = kstDateDot(post.createdAt);

  return (
    <SubLayout
      pathname={`/news/${board}`}
      banner="news"
    >
      {/* 원본 #board_wrap 의 AOS fade-up */}
      <Reveal type="fade-up">
        {/* ================================================================
            1) 제목 — 원본 .view-top-subject (가운데 20px 볼드 #666)
            ================================================================ */}
        <h2 className="text-center text-[18px] font-bold text-[#666] md:text-[20px]">
          <span className="text-[#D45111]">[{post.category}]</span> {post.title}
        </h2>

        {/* ================================================================
            2) 정보줄 — 원본 .view-top-infor (50px 줄높이, 2px 검정 라인)
            ================================================================ */}
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

        {/* ================================================================
            3) 버튼줄 — 원본 .view-top-bu (gif 버튼)
            수정/삭제는 관리자 페이지에서 처리하므로 목록보기만 노출한다.
            ================================================================ */}
        <div className="mt-4 flex justify-center gap-1">
          <Link href={`/news/${board}`} aria-label="목록보기">
            <Image src="/images/board/vlist.gif" alt="목록보기" width={52} height={20} unoptimized />
          </Link>
        </div>

        {/* ================================================================
            4) 본문 — 원본 .view-editor (mt 30px / mb 100px)
            에디터가 저장한 HTML 그대로 렌더링
            ================================================================ */}
        {post.contentHtml ? (
          <article
            className="mt-[30px] mb-[100px] w-full text-[13.5px] leading-[1.8] text-ink-700 [&_a]:underline [&_img]:max-w-full"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />
        ) : (
          <article className="mt-[30px] mb-[100px] w-full text-[13.5px] leading-[1.8] text-ink-400">
            <p>본문 내용이 없습니다.</p>
          </article>
        )}

        {/* ================================================================
            5) 댓글 영역 — activities 게시판만 (원본 #comment_wrap)
            ================================================================ */}
        {meta.comments && (
          <CommentSection
            postId={post.id}
            me={session?.memberId ?? null}
            comments={post.comments.map((c) => ({
              id: c.id,
              content: c.content,
              authorName: c.authorName,
              memberId: c.memberId,
              createdAt: kstDateTime(c.createdAt),
            }))}
          />
        )}
      </Reveal>

      {/* ================================================================
          6) 하단 목록 — 원본 view 페이지는 글 아래에 카테고리 탭 + 목록 +
          페이지네이션 + 검색폼이 이어지고, 스크롤 진입 시 fade-up 된다.
          현재 글은 번호 대신 ico_now.gif(깜빡임)로 표시.
          ================================================================ */}
      <Reveal type="fade-up" className="mt-10">
        <div className="mb-5">
          <CategoryTabs
            categories={categories}
            variant="board"
            activeCategory="전체"
            hrefs={Object.fromEntries(
              categories.map((cat) => [
                cat,
                cat === "전체"
                  ? `/news/${board}`
                  : `/news/${board}?category=${encodeURIComponent(cat)}`,
              ])
            )}
          />
        </div>

        <div className="flex items-center justify-between pb-[25px] text-[13px] text-[#666]">
          <p>
            Total : <b><CountUp value={listData.total} /></b>개 Page :{" "}
            <b><CountUp value={1} /></b>/{listData.totalPages}
          </p>
          {meta.writable && (
            <Link href={`/news/${board}/write`} aria-label="글쓰기">
              <Image
                src="/images/board/write.gif"
                alt="글쓰기"
                width={52}
                height={20}
                unoptimized
              />
            </Link>
          )}
        </div>

        {/* title_board_line — 2px #B2B2B2 */}
        <div aria-hidden className="h-[2px] w-full bg-[#B2B2B2]" />

        <BoardList
          board={board}
          posts={listData.posts}
          page={1}
          totalPages={listData.totalPages}
          pageHrefBase={`/news/${board}?`}
          currentUid={post.id}
          viewerId={viewer?.id ?? null}
          viewerIsAdmin={viewer?.isAdmin ?? false}
        />

        <BoardSearch basePath={`/news/${board}`} />
      </Reveal>
    </SubLayout>
  );
}
