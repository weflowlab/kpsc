"use client";

/* ==========================================================================
   게시판 글쓰기 폼 (원본 bbs.php?query=write 스킨 — gallery/default 공용)
   원본 재현 포인트
   - 제목/작성자/이메일: 라벨 60px + 30px 입력(1px #E4E4E4)
   - 옵션: 카테고리 셀렉트(갤러리/미술갤러리/행사갤러리) + 비밀글 체크
   - 본문: easyEditor 자리 — 여기서는 동일 크기의 플레인 textarea
   - 비밀번호(.fieldstyle: 45px, #ECEAEA) → 등록 버튼(.board_write_buT:
     #7A7A7A, 45px, hover 시 #E9E9E9 + 검정 글자, 0.7s) → 파일찾기(.filebox:
     #FFD100 라벨 70×30 + "선택된 파일 없음")
   - 등록: 로그인 회원 전용 — createPost 서버 액션으로 DB 저장
   ========================================================================== */

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { createPost } from "@/app/actions/board";
import RichTextEditor from "@/components/board/RichTextEditor";

/* 입력 공통 — 원본 인라인 스타일 (30px, 1px #E4E4E4) */
const FIELD =
  "h-[30px] w-full border border-[#E4E4E4] px-[5px] text-[13px] leading-[30px] outline-none";

export default function BoardWriteForm({
  board,
  categories,
  categoryLabel,
  authorName,
  listHref,
  allowSecret = false,
  allowFile = true,
}: {
  /** 게시판 키 — activities | gallery */
  board: string;
  /** 카테고리 셀렉트 옵션 */
  categories: string[];
  /** 셀렉트 첫 줄 라벨 (원본 getCategoryForm 의 sbj — 갤러리/구분) */
  categoryLabel: string;
  /** 로그인 회원 이름 — 비로그인이면 null */
  authorName: string | null;
  /** 등록 후 돌아갈 목록 경로 */
  listHref: string;
  /** 비밀글 체크박스 노출 (고객의 소리만) */
  allowSecret?: boolean;
  /** 파일 첨부 노출 (갤러리는 필수, 그 외는 선택) */
  allowFile?: boolean;
}) {
  const [fileName, setFileName] = useState("선택된 파일 없음");
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (pending) return;
    if (!authorName) {
      setNotice("회원으로 로그인해야 이용하실 수 있습니다.");
      return;
    }
    setNotice(null);
    setPending(true);
    try {
      const formData = new FormData(e.currentTarget);
      formData.set("board", board);
      const res = await createPost(formData);
      if (!res.ok) {
        setNotice(res.error);
        return;
      }
      /* 목록으로 이동 — 새 글이 바로 보이도록 전체 로드 */
      window.location.href = listHref;
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="mt-5 text-[13px] text-[#656565]">
      {/* ============ 제목 / 작성자 / 이메일 / 옵션 ============ */}
      <div className="space-y-[5px]">
        <div className="flex items-center">
          <label htmlFor="write-subject" className="w-[60px] shrink-0">
            제 목
          </label>
          <input id="write-subject" name="subject" type="text" className={FIELD} />
        </div>
        {/* 작성자 — 로그인 회원 이름 고정 */}
        <div className="flex items-center">
          <label htmlFor="write-name" className="w-[60px] shrink-0">
            작성자
          </label>
          <input
            id="write-name"
            name="name"
            type="text"
            readOnly
            value={authorName ?? ""}
            placeholder="로그인 후 작성할 수 있습니다."
            className={`${FIELD} bg-[#F9F9F9]`}
          />
        </div>

        {/* 옵션 — 카테고리 셀렉트 (+ 고객의 소리만 비밀글 체크) */}
        <div className="flex items-center">
          <span className="w-[60px] shrink-0">옵 션</span>
          <div className="flex items-center gap-3">
            <select
              name="category"
              aria-label="카테고리"
              defaultValue=""
              className="h-[30px] w-[280px] max-w-[45vw] border border-[#C0C0C0] px-1 text-[12px] outline-none"
            >
              <option value="">{categoryLabel}</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {allowSecret && (
              <label className="flex cursor-pointer items-center gap-1">
                <input type="checkbox" name="secret" />
                🔒 비밀글 (작성자와 관리자만 볼 수 있어요)
              </label>
            )}
          </div>
        </div>
      </div>

      {/* ============ 본문 — 실동작 위지윅 에디터 ============ */}
      <div className="mt-[10px]">
        <RichTextEditor name="content" defaultHtml="" />
      </div>

      {/* ============ 등록 ============ */}
      <button
        type="submit"
        disabled={pending}
        className="mt-[10px] flex w-full cursor-pointer items-center justify-center gap-1.5 border border-[#676767] bg-[#7A7A7A] text-[14px] leading-[45px] font-bold text-white duration-700 hover:border-[#CECECE] hover:bg-[#E9E9E9] hover:text-black disabled:opacity-60"
      >
        <Image
          src="/images/board/btn_write_icon.gif"
          alt=""
          width={8}
          height={13}
          unoptimized
        />
        {pending ? "등록 중..." : "등 록"}
      </button>

      {notice && (
        <p role="alert" className="mt-2 text-center text-[12px] text-[#C00]">
          {notice}
        </p>
      )}

      {/* ============ 파일 업로드 — 원본 .filebox (갤러리 등에서만) ============ */}
      {allowFile && (
      <>
      <div className="mt-[10px] flex items-center text-[12px]">
        <label
          htmlFor="write-file"
          className="h-[30px] w-[70px] shrink-0 cursor-pointer bg-[#FFD100] text-center leading-[30px] text-black"
        >
          파일찾기
        </label>
        <input
          id="write-file"
          name="file"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) =>
            setFileName(e.target.files?.[0]?.name ?? "선택된 파일 없음")
          }
        />
        <span className="ml-[1px] h-[30px] border border-[#E4E4E4] px-[10px] leading-[30px] text-[#888]">
          {fileName}
        </span>
      </div>

      {/* ============ 업로드 용량 게이지 — 원본 upform 하단 ============ */}
      <div className="mt-7 mb-4 flex items-center gap-3 text-[12px] text-[#666]">
        <button
          type="button"
          onClick={() => setFileName("선택된 파일 없음")}
          className="h-[22px] w-[80px] cursor-pointer border border-[#999] bg-white text-center leading-[20px]"
        >
          삭제
        </button>
        <span>
          0K / 총10,240K
        </span>
        {/* 0% ~ 100% 눈금 바 — 라인이 옆 텍스트와 같은 높이에 오도록
            라벨(%)은 absolute 로 라인 아래에 매달아둔다 */}
        <div aria-hidden className="relative h-[5px] w-[180px] border-b border-[#999]">
          <span className="absolute bottom-0 left-0 h-[5px] w-px bg-[#999]" />
          <span className="absolute bottom-0 left-1/2 h-[5px] w-px bg-[#999]" />
          <span className="absolute right-0 bottom-0 h-[5px] w-px bg-[#999]" />
          <div className="absolute top-full flex w-full justify-between pt-[2px] font-mont text-[10px] italic">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
      </div>
      </>
      )}
    </form>
  );
}
