/* ==========================================================================
   활동 및 소식 > 게시판 상세  (원본 /bbs.php?query=view&uid=...)
   구성 — 원본 default 스킨 그대로
     1) 제목 (.view-top-subject) — 가운데, 20px 볼드 #666, [분류] 주황 프리픽스
     2) 정보줄 (.view-top-infor) — 아이콘 gif + 작성자 | 등록일 | 조회수,
        50px 줄높이 + 하단 2px 검정 라인
     3) 버튼줄 (.view-top-bu) — 원본 gif 버튼 (목록보기/답글/수정/삭제)
     4) 본문 (.view-editor) — mt 30px / mb 100px
     5) 댓글 영역 (activities 만) — #666 타이틀 바 + 이모티콘 박스 +
        입력 폼 박스(textarea + 이름/비밀번호/평가점수 + 등록 바)
   전체 fade-up (원본 #board_wrap AOS).
   ========================================================================== */

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import SubLayout from "@/components/sub/SubLayout";
import Reveal from "@/components/common/Reveal";
import BoardList from "@/components/board/BoardList";
import BoardSearch from "@/components/board/BoardSearch";
import CategoryTabs from "@/components/board/CategoryTabs";
import CountUp from "@/components/board/CountUp";
import { BOARDS, getBoard } from "@/lib/content/board";
import { POST_CONTENTS } from "@/lib/content/board-contents";

/* --------------------------------------------------------------------------
   정적 경로 생성 — 두 게시판의 모든 게시물
   -------------------------------------------------------------------------- */
export function generateStaticParams() {
  return Object.entries(BOARDS).flatMap(([board, config]) =>
    config.posts.map((post) => ({ board, uid: String(post.uid) }))
  );
}

/* --------------------------------------------------------------------------
   메타데이터
   -------------------------------------------------------------------------- */
export async function generateMetadata(
  props: PageProps<"/news/[board]/[uid]">
): Promise<Metadata> {
  const { board, uid } = await props.params;
  const post = getBoard(board)?.posts.find((p) => String(p.uid) === uid);
  return post ? { title: post.title } : {};
}

export default async function BoardViewPage(props: PageProps<"/news/[board]/[uid]">) {
  const { board, uid } = await props.params;
  const config = getBoard(board);
  const post = config?.posts.find((p) => String(p.uid) === uid);
  if (!config || !post) notFound();

  /* 원본 날짜 표기 26.07.07 → 2026.07.07 로 변환 */
  const fullDate = `20${post.date.replace(/\./g, ".")}`;

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
            {post.author}
          </span>
          |
          <span className="inline-flex items-center gap-1 px-2.5 md:px-[30px]">
            <Image src="/images/board/icon_day.gif" alt="" width={16} height={16} unoptimized />
            {fullDate}
          </span>
          |
          <span className="inline-flex items-center gap-1 px-2.5 md:px-[30px]">
            <Image src="/images/board/icon_search.gif" alt="" width={16} height={16} unoptimized />
            {post.hit}
          </span>
        </div>

        {/* ================================================================
            3) 버튼줄 — 원본 .view-top-bu (gif 버튼 4개)
            답글/수정/삭제는 원본에서 비밀번호 확인이 필요한 기능이라
            정적 클론에서는 표시만 한다.
            ================================================================ */}
        <div className="mt-4 flex justify-center gap-1">
          <Link href={`/news/${board}`} aria-label="목록보기">
            <Image src="/images/board/vlist.gif" alt="목록보기" width={52} height={20} unoptimized />
          </Link>
          <button type="button" aria-label="답글" className="cursor-pointer">
            <Image src="/images/board/reply.gif" alt="답글" width={52} height={20} unoptimized />
          </button>
          <button type="button" aria-label="수정" className="cursor-pointer">
            <Image src="/images/board/modify.gif" alt="수정" width={52} height={20} unoptimized />
          </button>
          <button type="button" aria-label="삭제" className="cursor-pointer">
            <Image src="/images/board/delete.gif" alt="삭제" width={52} height={20} unoptimized />
          </button>
        </div>

        {/* ================================================================
            4) 본문 — 원본 .view-editor (mt 30px / mb 100px)
            원본 에디터가 저장한 HTML 그대로 렌더링 (board-contents.ts 수집본)
            ================================================================ */}
        {POST_CONTENTS[post.uid] ? (
          <article
            className="mt-[30px] mb-[100px] w-full text-[13.5px] leading-[1.8] text-ink-700 [&_a]:underline"
            dangerouslySetInnerHTML={{ __html: POST_CONTENTS[post.uid] }}
          />
        ) : (
          <article className="mt-[30px] mb-[100px] w-full text-[13.5px] leading-[1.8] text-ink-700">
            {post.content ? (
              post.content.map((line, i) =>
                line === "" ? <br key={i} /> : <p key={i}>{line}</p>
              )
            ) : (
              <p className="text-ink-400">본문 내용이 없습니다.</p>
            )}
          </article>
        )}

        {/* ================================================================
            5) 댓글 영역 — activities 게시판만 (원본 #comment_wrap)
            ================================================================ */}
        {config.comments && (
          <section className="mb-[30px] px-2.5">
            {/* 타이틀 바 — bg #666, 좌 아이콘+문구 / 우 접기 버튼 */}
            <div className="mb-[3%] flex w-full items-center justify-between bg-[#666] p-2.5">
              <p className="flex items-center gap-1.5 text-[14px] text-white">
                <Image src="/images/board/ico_comment_tt.gif" alt="" width={17} height={17} unoptimized />
                사용자 의견입니다.
              </p>
              <button type="button" aria-label="댓글 접기" className="cursor-pointer">
                <Image src="/images/board/btn_comment_hide.gif" alt="댓글 접기" width={74} height={17} unoptimized />
              </button>
            </div>

            {/* 댓글 목록 — 원본 0건이라 비어 있음 */}

            {/* 이모티콘 박스 — 원본 .comment_list_face (#EAF0F4 셀) */}
            <div className="mt-[8%] mb-[2%] w-full border border-[#D7D7D7] bg-[#eee] p-2.5 shadow-[2px_2px_2px_0px_#eee]">
              <div className="inline-flex flex-wrap items-center bg-[#EAF0F4] p-px">
                {Array.from({ length: 18 }, (_, i) => i + 1).map((n) => (
                  <button key={n} type="button" aria-label={`이모티콘 ${n}`} className="cursor-pointer p-[2px]">
                    <Image
                      src={`/images/board/em/${n}.gif`}
                      alt=""
                      width={19}
                      height={19}
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* 입력 폼 박스 — 원본 .comment_contents_wrap */}
            <div className="mt-[2%] mb-[4%] w-full border border-[#D7D7D7] bg-[#eee] p-[13px] shadow-[2px_2px_2px_0px_#eee]">
              <textarea
                aria-label="의견 입력"
                rows={4}
                className="h-[60px] w-full resize-y border border-[#DFDFDF] bg-white p-1.5 text-[13px] outline-none"
              />

              {/* 이름 / 비밀번호 / 평가점수 — 원본 Wfield */}
              <div className="mt-1.5 flex flex-wrap items-center gap-1">
                <input
                  type="text"
                  aria-label="이름"
                  placeholder="이름"
                  className="h-[22px] w-[100px] border border-[#C0C0C0] bg-white px-1 text-[12px] outline-none placeholder:text-black"
                />
                <input
                  type="password"
                  aria-label="비밀번호"
                  placeholder="비밀번호"
                  className="h-[22px] w-[100px] border border-[#C0C0C0] bg-white px-1 text-[12px] outline-none placeholder:text-black"
                />
                <select
                  aria-label="평가점수"
                  defaultValue=""
                  className="h-[22px] border border-[#C0C0C0] bg-white text-[12px] outline-none"
                >
                  <option value=""> 평가점수 : </option>
                  {[
                    ["10", "★★★★★"],
                    ["9", "★★★★☆"],
                    ["8", "★★★★"],
                    ["7", "★★★☆"],
                    ["6", "★★★"],
                    ["5", "★★☆"],
                    ["4", "★★"],
                    ["3", "★☆"],
                    ["2", "★"],
                    ["1", "☆"],
                  ].map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 등록 바 — 원본 .comment_write_buT */}
              <button
                type="button"
                className="mt-2.5 flex w-full cursor-pointer items-center justify-center gap-1.5 border border-[#676767] bg-[#7A7A7A] text-[14px] leading-[30px] font-bold text-white duration-700 hover:border-[#CECECE] hover:bg-[#E9E9E9] hover:text-black"
              >
                <Image
                  src="/images/board/btn_write_icon.gif"
                  alt=""
                  width={8}
                  height={13}
                  unoptimized
                />
                등 록
              </button>
            </div>
          </section>
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
            categories={config.categories}
            variant="board"
            activeCategory="전체"
            hrefs={Object.fromEntries(
              config.categories.map((cat) => [
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
            Total : <b><CountUp value={config.posts.length} /></b>개 Page :{" "}
            <b><CountUp value={1} /></b>/
            {Math.max(1, Math.ceil(config.posts.length / config.perPage))}
          </p>
          {config.writable && (
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
          posts={config.posts.slice(0, config.perPage)}
          page={1}
          totalPages={Math.max(1, Math.ceil(config.posts.length / config.perPage))}
          pageHrefBase={`/news/${board}?`}
          currentUid={post.uid}
        />

        <BoardSearch />
      </Reveal>
    </SubLayout>
  );
}
