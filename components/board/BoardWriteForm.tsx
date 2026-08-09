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
   - DB 미연결: 등록 클릭 시 준비 중 안내만 노출
   ========================================================================== */

import { useState, type FormEvent } from "react";
import Image from "next/image";


/* 입력 공통 — 원본 인라인 스타일 (30px, 1px #E4E4E4) */
const FIELD =
  "h-[30px] w-full border border-[#E4E4E4] px-[5px] text-[13px] leading-[30px] outline-none";

export default function BoardWriteForm({
  categories,
  categoryLabel,
}: {
  /** 카테고리 셀렉트 옵션 */
  categories: string[];
  /** 셀렉트 첫 줄 라벨 (원본 getCategoryForm 의 sbj — 갤러리/구분) */
  categoryLabel: string;
}) {
  const [fileName, setFileName] = useState("선택된 파일 없음");
  const [notice, setNotice] = useState<string | null>(null);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setNotice("게시판 준비 중입니다. 등록 기능은 곧 제공될 예정입니다.");
  };

  return (
    <form onSubmit={onSubmit} className="mt-5 text-[13px] text-[#656565]">
      {/* ============ 제목 / 작성자 / 이메일 / 옵션 ============ */}
      <div className="space-y-[5px]">
        {(
          [
            ["제 목", "subject", "text"],
            ["작성자", "name", "text"],
            ["이메일", "email", "text"],
          ] as const
        ).map(([label, id, type]) => (
          <div key={id} className="flex items-center">
            <label htmlFor={`write-${id}`} className="w-[60px] shrink-0">
              {label}
            </label>
            <input id={`write-${id}`} name={id} type={type} className={FIELD} />
          </div>
        ))}

        {/* 옵션 — 카테고리 셀렉트 + 비밀글 체크 */}
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
            <label className="flex cursor-pointer items-center gap-1">
              <input type="checkbox" name="secret" />
              비밀글
            </label>
          </div>
        </div>
      </div>

      {/* ============ 본문 — 원본 easyEditor 프레임 재현 ============ */}
      <div className="mt-[10px] border border-[#E4E4E4]">
        {/* 툴바 (시각 재현 — 동작 없음) */}
        <div className="flex flex-wrap items-center gap-[3px] border-b border-[#E4E4E4] bg-[#F7F7F7] px-[6px] py-[5px] text-[12px] text-[#333]">
          {/* 글자체 / 글자크기 드롭다운형 버튼 */}
          {["글자체", "글자크기"].map((label) => (
            <button
              key={label}
              type="button"
              className="flex h-[22px] cursor-default items-center gap-1 border border-[#C8C8C8] bg-white px-1.5"
            >
              {label}
              <span aria-hidden className="text-[9px]">
                ▼
              </span>
            </button>
          ))}

          <span aria-hidden className="w-[6px]" />

          {/* 글자색 / 배경색 */}
          <button
            type="button"
            aria-label="글자색"
            className="h-[22px] w-[24px] cursor-default border border-[#C8C8C8] bg-white font-bold text-[#FF6600]"
          >
            가
          </button>
          <button
            type="button"
            aria-label="배경색"
            className="h-[22px] w-[24px] cursor-default border border-[#C8C8C8] bg-[#FF6600] font-bold text-white"
          >
            가
          </button>

          <span aria-hidden className="w-[6px]" />

          {/* 굵게 / 기울임 / 밑줄 / 취소선 */}
          <button type="button" aria-label="굵게" className="h-[22px] w-[24px] cursor-default border border-[#C8C8C8] bg-white font-bold">
            가
          </button>
          <button type="button" aria-label="기울임" className="h-[22px] w-[24px] cursor-default border border-[#C8C8C8] bg-white italic">
            가
          </button>
          <button type="button" aria-label="밑줄" className="h-[22px] w-[24px] cursor-default border border-[#C8C8C8] bg-white underline">
            가
          </button>
          <button type="button" aria-label="취소선" className="h-[22px] w-[24px] cursor-default border border-[#C8C8C8] bg-white line-through">
            가
          </button>

          <span aria-hidden className="w-[6px]" />

          {/* 정렬 4종 — 좌 / 중앙 / 우 / 양쪽 */}
          {(
            [
              ["왼쪽 정렬", [12, 8, 12, 8]],
              ["가운데 정렬", [12, 8, 12, 8]],
              ["오른쪽 정렬", [12, 8, 12, 8]],
              ["양쪽 정렬", [12, 12, 12, 12]],
            ] as const
          ).map(([label, widths], i) => (
            <button
              key={label}
              type="button"
              aria-label={label}
              className="flex h-[22px] w-[24px] cursor-default flex-col justify-center gap-[2px] border border-[#C8C8C8] bg-white px-[4px]"
            >
              {widths.map((w, j) => (
                <span
                  key={j}
                  aria-hidden
                  className={`block h-[1.5px] bg-[#333] ${
                    i === 0
                      ? "self-start"
                      : i === 2
                        ? "self-end"
                        : "self-center"
                  }`}
                  style={{ width: w }}
                />
              ))}
            </button>
          ))}

          <span aria-hidden className="w-[6px]" />

          {/* 구분선 삽입 */}
          <button type="button" aria-label="구분선" className="h-[22px] w-[24px] cursor-default border border-[#C8C8C8] bg-white">
            —
          </button>

          <span aria-hidden className="w-[6px]" />

          <button type="button" className="h-[22px] cursor-default border border-[#C8C8C8] bg-white px-1.5">
            소스보기
          </button>
        </div>

        <textarea
          name="content"
          aria-label="본문"
          className="block h-[300px] w-full resize-y p-2.5 text-[13px] outline-none"
        />
      </div>

      {/* ============ 비밀번호 + 등록 ============ */}
      <input
        type="password"
        name="password"
        placeholder="비밀번호"
        aria-label="비밀번호"
        className="mt-[10px] h-[45px] w-full border border-[#E4E4E4] bg-[#ECEAEA] pl-[10px] text-[15px] text-[#606060] outline-none placeholder:text-[#606060]"
      />
      <button
        type="submit"
        className="mt-[10px] flex w-full cursor-pointer items-center justify-center gap-1.5 border border-[#676767] bg-[#7A7A7A] text-[14px] leading-[45px] font-bold text-white duration-700 hover:border-[#CECECE] hover:bg-[#E9E9E9] hover:text-black"
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

      {notice && (
        <p role="alert" className="mt-2 text-center text-[12px] text-[#C00]">
          {notice}
        </p>
      )}

      {/* ============ 파일 업로드 — 원본 .filebox ============ */}
      <div className="mt-[10px] flex items-center text-[12px]">
        <label
          htmlFor="write-file"
          className="h-[30px] w-[70px] shrink-0 cursor-pointer bg-[#FFD100] text-center leading-[30px] text-black"
        >
          파일찾기
        </label>
        <input
          id="write-file"
          type="file"
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
    </form>
  );
}
