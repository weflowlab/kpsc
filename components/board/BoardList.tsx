"use client";

/* ==========================================================================
   게시판 리스트 행 + 하단 라인 + 페이지네이션 + 다중선택 레이어
   (원본 default 스킨 Multi_Check())
   원본 재현 포인트
   - 행: 55px, #45545D, hover 시 #F0EEEE + 볼드 (0.8s)
   - 체크박스를 누르면 페이지네이션 아래 앵커(#MultiCheckLayer 자리)에
     연두색 레이어(#DAF383, 1px #90B64B, 220px)가 absolute 로 떠서
     아래 검색폼 위에 겹친다 (원본 JS 의 좌표 단위 누락으로 인한 실제 동작):
       1줄 — 전체선택 / 선택해제 / 선택반전 (원본 gif 버튼, 실동작)
       2줄 — 조회(ico_hit.gif, 로그인 안내) + (선택된 자료 : N)
   - 체크된 항목이 하나도 없으면 레이어가 사라진다
   ========================================================================== */

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Pagination from "@/components/board/Pagination";
import type { BoardPost } from "@/lib/content/board";

type BoardListProps = {
  board: string;
  posts: BoardPost[];
  page: number;
  totalPages: number;
  /** 페이지 링크 접두어 — 뒤에 `p=N` 만 붙인다 (함수는 직렬화 불가) */
  pageHrefBase: string;
  /** 상세 페이지 하단 목록에서 현재 보고 있는 글 — 번호 대신 ico_now.gif */
  currentUid?: number;
};

export default function BoardList({
  board,
  posts,
  page,
  totalPages,
  pageHrefBase,
  currentUid,
}: BoardListProps) {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  /* 원본 스킨별 컬럼 순서 차이
     - activities(default 스킨): 번호·분류·제목·조회수·등록일·작성자 (+아이콘)
     - notice 스킨: 번호·분류·제목·등록일·작성자·조회수, 아이콘 없음,
       행 사이 점선(line_dot01.gif) 추가 */
  const isNotice = board === "notice";
  /* 분류 칸은 가장 긴 "[다운로드 파일 및 신청서]" 가 한 줄에 들어가는 폭 */
  const gridCols = isNotice
    ? "sm:grid-cols-[44px_60px_240px_1fr_90px_110px_80px]"
    : "sm:grid-cols-[44px_60px_130px_1fr_80px_90px_110px]";

  const toggle = (uid: number) => {
    const next = new Set(checked);
    if (next.has(uid)) next.delete(uid);
    else next.add(uid);
    setChecked(next);
  };
  const checkAll = () => setChecked(new Set(posts.map((p) => p.uid)));
  const uncheckAll = () => setChecked(new Set());
  const reverse = () =>
    setChecked(
      new Set(posts.map((p) => p.uid).filter((uid) => !checked.has(uid)))
    );

  return (
    <>
      {/* ============ 헤더 행 — 55px, bg #F5F4F4 (모바일 숨김) ============ */}
      <div
        className={`hidden h-[55px] items-center bg-[#F5F4F4] text-center text-[15px] font-bold text-[#45545D] sm:grid ${gridCols}`}
      >
        <span />
        <span>번호</span>
        <span />
        <span>제목</span>
        {isNotice ? (
          <>
            <span>등록일</span>
            <span>작성자</span>
            <span>조회수</span>
          </>
        ) : (
          <>
            <span>조회수</span>
            <span>등록일</span>
            <span>작성자</span>
          </>
        )}
      </div>

      {/* ============ 데이터 행 ============ */}
      {posts.length > 0 ? (
        <ul>
          {posts.map((post, i) => (
            <li key={post.uid} className="border-b border-[#DEDCDC]">
              {/* notice 스킨: 행 사이 점선 (원본 line_dot01.gif repeat-x) */}
              {isNotice && i > 0 && (
                <div
                  aria-hidden
                  className="h-px w-full bg-repeat-x"
                  style={{ backgroundImage: "url(/images/board/line_dot01.gif)" }}
                />
              )}

              {/* 원본처럼 행 자체는 링크가 아니고 제목만 링크 —
                  체크박스 클릭이 페이지 이동과 얽히지 않는다 */}
              <div
                className={`grid items-center gap-1 px-2 py-4 text-[#45545D] duration-[800ms] hover:bg-[#F0EEEE] hover:font-bold hover:text-black sm:h-[55px] sm:gap-0 sm:px-0 sm:py-0 ${gridCols}`}
              >
                {/* 체크박스 — 모바일 숨김 */}
                <span className="hidden text-center sm:block">
                  <input
                    type="checkbox"
                    aria-label={`${post.title} 선택`}
                    checked={checked.has(post.uid)}
                    onChange={() => toggle(post.uid)}
                  />
                </span>

                {/* 번호 — 모바일 숨김. 현재 보고 있는 글은 깜빡이는 아이콘 */}
                <span className="hidden text-center text-[14px] sm:block">
                  {post.uid === currentUid ? (
                    <Image
                      src="/images/board/ico_now.gif"
                      alt="현재 글"
                      width={25}
                      height={17}
                      unoptimized
                      className="inline-block"
                    />
                  ) : (
                    post.no
                  )}
                </span>

                {/* 분류 — 원본 주황(#D45111), 줄바꿈 금지 */}
                <span className="text-center text-[12px] whitespace-nowrap text-[#D45111] sm:text-[14px]">
                  [{post.category}]
                </span>

                {/* 제목 — 좌측 정렬, 원본처럼 제목만 링크 */}
                <Link
                  href={`/news/${board}/${post.uid}`}
                  className="truncate px-1 text-[14px] sm:px-2 sm:text-left"
                >
                  {post.title}
                </Link>

                {isNotice ? (
                  <>
                    {/* 등록일 / 작성자(아이콘 없음) / 조회수 */}
                    <span className="hidden text-center text-[14px] sm:block">
                      {post.date}
                    </span>
                    <span className="text-center text-[12px] sm:text-[14px]">
                      {post.author}
                    </span>
                    <span className="hidden text-center text-[14px] sm:block">
                      {post.hit}
                    </span>
                  </>
                ) : (
                  <>
                    {/* 조회수 / 등록일 / 작성자(아이콘) */}
                    <span className="hidden text-center text-[14px] sm:block">
                      {post.hit}
                    </span>
                    <span className="hidden text-center text-[14px] sm:block">
                      {post.date}
                    </span>
                    <span className="flex items-center justify-center gap-1 text-[12px] sm:text-[14px]">
                      <Image
                        src="/images/board/default_icon.gif"
                        alt=""
                        width={20}
                        height={20}
                        unoptimized
                      />
                      {post.author}
                    </span>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="py-24 text-center text-[14px] text-ink-400">
          등록된 게시물이 없습니다.
        </p>
      )}

      {/* board_line — 1px #E4E4E4 */}
      <div aria-hidden className="h-px w-full bg-[#E4E4E4]" />

      {/* ============ 페이지네이션 ============ */}
      <Pagination
        current={page}
        total={totalPages}
        href={(p) => `${pageHrefBase}p=${p}`}
      />

      {/* ============ 다중선택 레이어 — 원본 #MultiCheckLayer 자리 ============
          원본은 absolute 라 검색폼을 덮지만, 여기서는 일반 흐름에 두어
          아래 콘텐츠를 밀어내며 겹치지 않게 한다 */}
      <div>
        {checked.size > 0 && (
          <div
            role="menu"
            className="mt-1 w-[220px] border border-[#E4E4E4] bg-white p-[3px]"
          >
            <div className="flex gap-1 whitespace-nowrap">
              <button type="button" onClick={checkAll} className="cursor-pointer">
                <Image src="/images/board/btn_check.gif" alt="전체선택" width={69} height={19} unoptimized />
              </button>
              <button type="button" onClick={uncheckAll} className="cursor-pointer">
                <Image src="/images/board/btn_ncheck.gif" alt="선택해제" width={69} height={19} unoptimized />
              </button>
              <button type="button" onClick={reverse} className="cursor-pointer">
                <Image src="/images/board/btn_reverse.gif" alt="선택반전" width={69} height={19} unoptimized />
              </button>
            </div>
            <div className="mt-[3px] flex items-center gap-1">
              <button
                type="button"
                onClick={() =>
                  alert("\n회원으로 로그인해야 이용하실 수 있습니다.       \n")
                }
                className="cursor-pointer"
              >
                <Image src="/images/board/ico_hit.gif" alt="조회" width={51} height={19} unoptimized />
              </button>
              <span className="text-[12px] text-gray-500">
                (선택된 자료 : {checked.size})
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
