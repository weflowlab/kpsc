"use client";

/* ==========================================================================
   관리자용 위지윅 에디터 — 원본 easyEditor 대응
   - contentEditable + execCommand 기반 (외부 라이브러리 없음)
   - 툴바: 글자크기 / 글자색·배경색 / 굵게·기울임·밑줄·취소선 / 정렬 / 구분선
   - 폼 전송: 숨은 textarea(name)에 HTML 을 동기화해 FormData 로 전달
   ========================================================================== */

import { useRef } from "react";

const BTN =
  "flex h-8 w-8 cursor-pointer items-center justify-center rounded border border-ink-200 bg-white text-[13px] text-ink-700 hover:border-brand-600 hover:text-brand-600";

/* ----- 정렬 아이콘 (16px 라인) ----- */
const iconProps = {
  width: 15,
  height: 15,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.2,
  strokeLinecap: "round" as const,
  "aria-hidden": true,
};

function AlignLeftIcon() {
  return (
    <svg {...iconProps}>
      <path d="M3 5h18M3 10h12M3 15h18M3 20h12" />
    </svg>
  );
}
function AlignCenterIcon() {
  return (
    <svg {...iconProps}>
      <path d="M3 5h18M6 10h12M3 15h18M6 20h12" />
    </svg>
  );
}
function AlignRightIcon() {
  return (
    <svg {...iconProps}>
      <path d="M3 5h18M9 10h12M3 15h18M9 20h12" />
    </svg>
  );
}
function HrIcon() {
  return (
    <svg {...iconProps}>
      <path d="M4 12h16" />
    </svg>
  );
}

export default function RichTextEditor({
  name,
  defaultHtml,
}: {
  /** FormData 필드명 */
  name: string;
  defaultHtml: string;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const hiddenRef = useRef<HTMLTextAreaElement>(null);

  /* 편집 내용 → 숨은 필드 동기화 */
  const sync = () => {
    if (hiddenRef.current && editorRef.current)
      hiddenRef.current.value = editorRef.current.innerHTML;
  };

  /* execCommand 실행 — mousedown 에서 선택 영역이 풀리지 않게 한다 */
  const exec = (command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    sync();
  };

  const prevent = (e: React.MouseEvent) => e.preventDefault();

  return (
    <div className="rounded-md border border-ink-200 bg-white">
      {/* ============ 툴바 ============ */}
      <div className="flex flex-wrap items-center gap-1 border-b border-ink-200 bg-ink-50 p-2">
        {/* 글자크기 */}
        <select
          aria-label="글자크기"
          defaultValue=""
          onChange={(e) => {
            if (e.target.value) exec("fontSize", e.target.value);
            e.target.value = "";
          }}
          className="h-8 cursor-pointer rounded border border-ink-200 bg-white px-1 text-[13px] outline-none"
        >
          <option value="" disabled>
            글자크기
          </option>
          <option value="2">작게</option>
          <option value="3">보통</option>
          <option value="5">크게</option>
          <option value="6">아주 크게</option>
        </select>

        {/* 글자색 / 배경색 */}
        <label className={BTN} title="글자색" onMouseDown={prevent}>
          <span className="font-bold text-[#FF5700]">가</span>
          <input
            type="color"
            aria-label="글자색"
            className="h-0 w-0 opacity-0"
            onChange={(e) => exec("foreColor", e.target.value)}
          />
        </label>
        <label className={BTN} title="배경색" onMouseDown={prevent}>
          <span className="rounded bg-[#FFE49C] px-0.5 font-bold">가</span>
          <input
            type="color"
            aria-label="배경색"
            className="h-0 w-0 opacity-0"
            onChange={(e) => exec("hiliteColor", e.target.value)}
          />
        </label>

        <span aria-hidden className="mx-1 h-5 w-px bg-ink-200" />

        {/* 굵게 / 기울임 / 밑줄 / 취소선 */}
        <button type="button" title="굵게" onMouseDown={prevent} onClick={() => exec("bold")} className={`${BTN} font-bold`}>
          가
        </button>
        <button type="button" title="기울임" onMouseDown={prevent} onClick={() => exec("italic")} className={`${BTN} italic`}>
          가
        </button>
        <button type="button" title="밑줄" onMouseDown={prevent} onClick={() => exec("underline")} className={`${BTN} underline`}>
          가
        </button>
        <button type="button" title="취소선" onMouseDown={prevent} onClick={() => exec("strikeThrough")} className={`${BTN} line-through`}>
          가
        </button>

        <span aria-hidden className="mx-1 h-5 w-px bg-ink-200" />

        {/* 정렬 */}
        <button type="button" title="왼쪽 정렬" onMouseDown={prevent} onClick={() => exec("justifyLeft")} className={BTN}>
          <AlignLeftIcon />
        </button>
        <button type="button" title="가운데 정렬" onMouseDown={prevent} onClick={() => exec("justifyCenter")} className={BTN}>
          <AlignCenterIcon />
        </button>
        <button type="button" title="오른쪽 정렬" onMouseDown={prevent} onClick={() => exec("justifyRight")} className={BTN}>
          <AlignRightIcon />
        </button>

        <span aria-hidden className="mx-1 h-5 w-px bg-ink-200" />

        {/* 구분선 */}
        <button type="button" title="구분선 넣기" onMouseDown={prevent} onClick={() => exec("insertHorizontalRule")} className={BTN}>
          <HrIcon />
        </button>
      </div>

      {/* ============ 본문 편집 영역 ============ */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-label="본문"
        aria-multiline="true"
        onInput={sync}
        onBlur={sync}
        dangerouslySetInnerHTML={{ __html: defaultHtml }}
        className="min-h-[380px] p-4 text-[14px] leading-[1.8] text-ink-900 outline-none [&_a]:underline"
      />

      {/* 숨은 필드 — 폼 전송용 */}
      <textarea
        ref={hiddenRef}
        name={name}
        defaultValue={defaultHtml}
        aria-hidden
        tabIndex={-1}
        readOnly
        className="hidden"
      />
    </div>
  );
}
