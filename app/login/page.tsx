/* ==========================================================================
   로그인  (원본 /login.php)
   원본 재현 포인트
   - 서브 비주얼 타이틀이 "회원관리"로 다르고, 좌측 서브메뉴가 없다(전체폭 레이아웃)
   - 필드: 아이디(maxlength 12) / 비밀번호(maxlength 16) / 아이디·비밀번호 저장
   - 하단 링크: ID/PW 찾기(레이어 팝업) / 회원가입 이동
   ========================================================================== */

"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import SubLayout from "@/components/sub/SubLayout";
import Placeholder from "@/components/common/Placeholder";

export default function LoginPage() {
  /* 입력 상태 */
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ID/PW 찾기 레이어 팝업 */
  const [findOpen, setFindOpen] = useState(false);

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
      visualPlaceholder="회원관리 서브 배너"
      hideSidebar
    >
      <div className="mx-auto max-w-[420px]">
        {/* ================================================================
            타이틀
            ================================================================ */}
        <h2 className="text-center text-[24px] font-bold text-ink-900">로그인</h2>

        {/* 타이틀 이미지 자리 — 원본 log_title.jpg */}
        <div className="mx-auto mt-6 h-[70px] w-full max-w-[300px]">
          <Placeholder label="로그인 타이틀 이미지" />
        </div>

        {/* ================================================================
            로그인 폼
            ================================================================ */}
        <form onSubmit={onSubmit} className="mt-8 space-y-5">
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
            className="w-full bg-[#1A1A1A] py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-brand-600"
          >
            로그인
          </button>
        </form>

        {/* ================================================================
            하단 링크
            ================================================================ */}
        <div className="mt-6 flex items-center justify-center gap-4 text-[13px]">
          <button
            type="button"
            onClick={() => setFindOpen(true)}
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

      {/* ================================================================
          ID/PW 찾기 레이어 팝업 (원본 id_pw_layerpopup)
          ================================================================ */}
      {findOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="아이디/비밀번호 찾기"
          className="fixed inset-0 z-[29999] flex items-center justify-center px-4"
        >
          {/* 딤 */}
          <button
            type="button"
            aria-label="닫기"
            onClick={() => setFindOpen(false)}
            className="absolute inset-0 bg-black/80"
          />

          <div className="relative w-full max-w-[360px] rounded-lg bg-white p-7">
            <h3 className="text-[17px] font-bold text-ink-900">아이디/비밀번호 찾기</h3>
            <p className="mt-2 text-[13px] text-ink-500">
              회원 가입시 이름 및 휴대폰 번호를 입력해 주세요.
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <label
                  htmlFor="find-name"
                  className="mb-1.5 block text-[13px] font-semibold text-ink-900"
                >
                  이름
                </label>
                <input
                  id="find-name"
                  type="text"
                  maxLength={10}
                  className="h-9 w-full border border-[#E4E4E4] px-3 text-[14px] outline-none focus:border-brand-600"
                />
              </div>
              <div>
                <label
                  htmlFor="find-hp"
                  className="mb-1.5 block text-[13px] font-semibold text-ink-900"
                >
                  HP
                </label>
                <input
                  id="find-hp"
                  type="text"
                  inputMode="numeric"
                  maxLength={11}
                  placeholder="숫자만 입력해 주세요."
                  className="h-9 w-full border border-[#E4E4E4] px-3 text-[14px] outline-none focus:border-brand-600"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button
                type="button"
                className="flex-1 bg-[#1A1A1A] py-3 text-[14px] text-white transition-colors hover:bg-brand-600"
              >
                아이디/비번 찾기
              </button>
              <button
                type="button"
                onClick={() => setFindOpen(false)}
                className="border border-ink-200 px-5 text-[14px] text-ink-500"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </SubLayout>
  );
}
