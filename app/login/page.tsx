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
import { useEffect, useState, type FormEvent } from "react";
import SubLayout from "@/components/sub/SubLayout";
import { openIdPwPopup } from "@/components/layout/IdPwFindPopup";
import { login } from "@/app/actions/auth";

/* 아이디 저장 체크 시 사용할 localStorage 키
   (원본은 비밀번호까지 쿠키에 저장했지만 보안상 아이디만 저장한다) */
const SAVED_ID_KEY = "kpsc_saved_id";

export default function LoginPage() {
  /* 입력 상태 */
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  /* 저장된 아이디 복원 — 서버 렌더와의 하이드레이션 불일치를 피하려면
     마운트 후 한 번 복원하는 방식이어야 해서 effect 내 setState 를 허용한다 */
  useEffect(() => {
    const saved = localStorage.getItem(SAVED_ID_KEY);
    if (saved) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setId(saved);
      setRemember(true);
    }
  }, []);

  /* 로그인 — 클라이언트 검증(원본 알럿 문구) 후 서버 액션 호출 */
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (pending) return;
    if (!id.trim()) return setError("아이디를 입력해 주세요");
    if (!pw.trim()) return setError("패스워드를 입력해 주세요");
    setError(null);

    setPending(true);
    try {
      const res = await login({ loginId: id, password: pw });
      if (!res.ok) {
        setError(res.error);
        return;
      }

      if (remember) localStorage.setItem(SAVED_ID_KEY, id);
      else localStorage.removeItem(SAVED_ID_KEY);

      /* 헤더(로그인 상태 표시)까지 새로 그리도록 전체 로드로 이동 */
      window.location.href = "/";
    } finally {
      setPending(false);
    }
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
            disabled={pending}
            className="w-full bg-[#1A1A1A] py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-[#AE031B] disabled:opacity-60"
          >
            {pending ? "로그인 중..." : "로그인"}
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
