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

import { useRef, useState, type FormEvent } from "react";
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
  editUid = null,
  initialTitle = "",
  initialCategory = "",
  initialContent = "",
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
  /** 수정 대상 글 id (있으면 수정 모드) */
  editUid?: number | null;
  /** 답글/수정 프리필 값 */
  initialTitle?: string;
  initialCategory?: string;
  initialContent?: string;
}) {
  const MAX_IMAGES = 5;
  /* 첨부한 이미지 파일 목록 (갤러리 앨범형 — 최대 5장) */
  const [files, setFiles] = useState<File[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  /* 파일 선택 — 기존 목록에 추가, 5장 초과분은 버림 */
  const onPickFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []);
    if (picked.length === 0) return;
    setFiles((prev) => {
      const merged = [...prev, ...picked].slice(0, MAX_IMAGES);
      if (prev.length + picked.length > MAX_IMAGES)
        setNotice(`이미지는 최대 ${MAX_IMAGES}장까지 첨부할 수 있습니다.`);
      return merged;
    });
    if (fileRef.current) fileRef.current.value = ""; // 같은 파일 재선택 허용
  };

  const removeFile = (idx: number) =>
    setFiles((prev) => prev.filter((_, i) => i !== idx));

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (pending) return;
    if (!authorName) {
      setNotice("회원으로 로그인해야 이용하실 수 있습니다.");
      return;
    }
    /* 새 글일 때만 이미지 필수 (수정은 기존 이미지 유지 가능) */
    if (allowFile && !editUid && files.length === 0) {
      setNotice("이미지를 1장 이상 첨부해 주세요.");
      return;
    }
    setNotice(null);
    setPending(true);
    try {
      const formData = new FormData(e.currentTarget);
      formData.set("board", board);
      if (editUid) formData.set("editUid", String(editUid));
      /* 첨부 이미지들을 file 필드로 추가 (다중) */
      for (const f of files) formData.append("file", f);
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
          <input id="write-subject" name="subject" type="text" defaultValue={initialTitle} className={FIELD} />
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
              defaultValue={initialCategory}
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
        <RichTextEditor name="content" defaultHtml={initialContent} />
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

      {/* ============ 이미지 첨부 — 앨범형 최대 5장 (갤러리 등에서만) ============ */}
      {allowFile && (
      <div className="mt-[10px]">
        <div className="flex items-center gap-2 text-[12px]">
          {/* 5장 미만일 때만 추가 가능 */}
          <label
            htmlFor="write-file"
            className={`h-[30px] w-[80px] shrink-0 text-center leading-[30px] ${
              files.length >= MAX_IMAGES
                ? "cursor-not-allowed bg-[#E4E4E4] text-[#aaa]"
                : "cursor-pointer bg-[#FFD100] text-black"
            }`}
          >
            사진추가
          </label>
          <input
            ref={fileRef}
            id="write-file"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            disabled={files.length >= MAX_IMAGES}
            className="hidden"
            onChange={onPickFiles}
          />
          <span className="text-[#888]">
            {files.length}/{MAX_IMAGES}장 첨부됨
          </span>
        </div>

        {/* 선택한 이미지 미리보기 + 개별 삭제 */}
        {files.length > 0 && (
          <ul className="mt-2 flex flex-wrap gap-2">
            {files.map((f, i) => (
              <li
                key={`${f.name}-${i}`}
                className="relative h-[80px] w-[80px] overflow-hidden border border-[#E4E4E4]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={URL.createObjectURL(f)}
                  alt={f.name}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  aria-label={`${f.name} 삭제`}
                  className="absolute right-0 top-0 flex h-5 w-5 cursor-pointer items-center justify-center bg-black/60 text-[12px] text-white hover:bg-[#AE031B]"
                >
                  ✕
                </button>
                {/* 첫 장 = 대표 썸네일 표시 */}
                {i === 0 && (
                  <span className="absolute bottom-0 left-0 bg-black/60 px-1 text-[10px] text-white">
                    대표
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}

        <p className="mt-1.5 text-[12px] text-[#999]">
          jpg · png · webp · gif / 최대 {MAX_IMAGES}장 · 첫 번째 사진이 목록
          대표로 표시됩니다. 업로드 시 자동 최적화됩니다.
          {editUid && " (수정 시 새로 첨부하면 기존 사진이 교체됩니다. 비워두면 그대로 유지)"}
        </p>
      </div>
      )}
    </form>
  );
}
