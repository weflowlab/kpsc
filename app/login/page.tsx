/* ==========================================================================
   로그인  (원본 /login.php)
   원본 재현 포인트
   - 서브 비주얼 타이틀이 "회원관리"로 다르고, 좌측 서브메뉴가 없다(전체폭 레이아웃)
   - 필드: 아이디(maxlength 12) / 비밀번호(maxlength 16) / 아이디·비밀번호 저장
   - 하단 링크: ID/PW 찾기(레이어 팝업) / 회원가입 이동
   ========================================================================== */

"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, type FormEvent } from "react";
import SubLayout from "@/components/sub/SubLayout";
import { openIdPwPopup } from "@/components/layout/IdPwFindPopup";

export default function LoginPage() {
  /* 입력 상태 */
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* 로그인 검증 — 원본 알럿 문구 그대로 재현 */
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!id.trim()) return setError("아이디를 입력해 주세요");
    if (!pw.trim()) return setError("패스워드를 입력해 주세요");
    setError(null);
  };

  return (
    <SubLayout
      pathname="/login"
      visualTitle="회원관리"
      banner="member"
      hideSubNav
    >
      <div className="mx-auto max-w-[1050px]">
        {/* ================================================================
            타이틀 — 원본 .sub_title 형식 (가운데 + 풀폭 밑줄)
            ================================================================ */}
        <h2 className="w-full border-b-2 border-[#D9D9D9] text-center text-[22px] leading-[43px] font-bold text-[#222] md:text-[28px]">
          로그인
        </h2>

        {/* 원본 로그인 타이틀 이미지 — 원본 크기(1050px) 그대로 */}
        <Image
          src="/images/login-title.webp"
          alt="스마트폰 자물쇠 보안 이미지"
          width={1050}
          height={192}
          className="mx-auto mt-10 w-full"
        />

        {/* ================================================================
            로그인 폼 — 원본처럼 이미지보다 살짝 좁은 폭
            ================================================================ */}
        <form onSubmit={onSubmit} className="mx-auto mt-8 max-w-[820px] space-y-5">
          {/* 아이디 */}
          <div>
            <label
              htmlFor="MB_ID"
              className="mb-2 block text-[14px] font-semibold text-ink-900"
            >
              📁 아이디
            </label>
            <input
              id="MB_ID"
              name="MB_ID"
              type="text"
              maxLength={12}
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="h-8 w-full border border-[#E4E4E4] px-3 text-[14px] outline-none focus:border-brand-600"
            />
          </div>

          {/* 비밀번호 */}
          <div>
            <label
              htmlFor="MB_PW"
              className="mb-2 block text-[14px] font-semibold text-ink-900"
            >
              📁 비밀번호
            </label>
            <input
              id="MB_PW"
              name="MB_PW"
              type="password"
              maxLength={16}
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              className="h-8 w-full border border-[#E4E4E4] px-3 text-[14px] outline-none focus:border-brand-600"
            />
          </div>

          {/* 저장 체크박스 */}
          <label className="flex items-center gap-2 text-[13px] text-ink-500">
            <input
              type="checkbox"
              name="MB_CHECK"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 accent-brand-600"
            />
            아이디/비밀번호 저장
          </label>

          {/* 오류 메시지 */}
          {error && (
            <p role="alert" className="text-[13px] text-board-tag">
              {error}
            </p>
          )}

          {/* 로그인 버튼 */}
          <button
            type="submit"
            className="w-full bg-[#1A1A1A] py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-[#AE031B]"
          >
            로그인
          </button>
        </form>

        {/* ================================================================
            하단 링크
            ================================================================ */}
        <div className="mx-auto mt-6 flex max-w-[820px] items-center justify-center gap-4 text-[13px]">
          <button
            type="button"
            onClick={openIdPwPopup}
            className="text-ink-500 hover:text-brand-600"
          >
            ID/PW 찾기
          </button>
          <span aria-hidden className="text-ink-200">
            |
          </span>
          <Link href="/register" className="text-ink-500 hover:text-brand-600">
            회원으로 가입하시겠습니까?
          </Link>
        </div>
      </div>

    </SubLayout>
  );
}
