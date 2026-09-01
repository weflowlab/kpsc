"use client";

/* ==========================================================================
   아이디/비밀번호 찾기 레이어 팝업 (원본 id_pw_layerpopup)
   원본은 어떤 페이지에서든 goThisPopupShow('id_pw_layerpopup')로 여는
   전역 팝업이다. 여기서는 layout 에 한 번 마운트해 두고, 어디서든
   openIdPwPopup() 을 부르면 커스텀 이벤트로 열린다.

   동작: 이름 + 휴대폰이 일치하면 아이디를 보여주고, 이어서 본인확인
   (이름+휴대폰+아이디)을 통과한 새 비밀번호로 즉시 재설정할 수 있다.
   (메일 발송 없이 처리하는 방식 — 서버 검증은 app/actions/auth.ts)
   ========================================================================== */

import { useEffect, useState } from "react";
import { findAccount, resetPassword } from "@/app/actions/auth";

const OPEN_EVENT = "kpsc:open-idpw-popup";

/** 어느 컴포넌트에서든 호출하면 팝업이 열린다 */
export function openIdPwPopup() {
  window.dispatchEvent(new CustomEvent(OPEN_EVENT));
}

const inputClass =
  "h-9 w-full border border-[#E4E4E4] px-3 text-[14px] outline-none focus:border-brand-600";
const labelClass = "mb-1.5 block text-[13px] font-semibold text-ink-900";

export default function IdPwFindPopup() {
  const [open, setOpen] = useState(false);

  /* 1단계: 본인확인 입력 */
  const [name, setName] = useState("");
  const [hp, setHp] = useState("");

  /* 2단계: 찾은 아이디 / 재설정 */
  const [loginIds, setLoginIds] = useState<string[] | null>(null);
  const [selectedId, setSelectedId] = useState("");
  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [resetDone, setResetDone] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  /* 닫을 때 입력 상태를 모두 초기화해, 다시 열면 처음부터 시작한다 */
  const close = () => {
    setOpen(false);
    setName("");
    setHp("");
    setLoginIds(null);
    setSelectedId("");
    setPw1("");
    setPw2("");
    setResetDone(false);
    setError(null);
  };

  /* ------------------------------------------------------------------
     1단계 — 아이디 찾기
     ------------------------------------------------------------------ */
  const onFind = async () => {
    if (pending) return;
    setError(null);
    setPending(true);
    try {
      const res = await findAccount({ name, phone: hp });
      if (!res.ok) return setError(res.error);
      setLoginIds(res.loginIds);
      setSelectedId(res.loginIds[0]);
    } finally {
      setPending(false);
    }
  };

  /* ------------------------------------------------------------------
     2단계 — 비밀번호 재설정
     ------------------------------------------------------------------ */
  const onReset = async () => {
    if (pending) return;
    if (pw1.length < 4 || pw1.length > 12)
      return setError("비밀번호는 4자 이상 12자 이하로 입력해 주세요.");
    if (pw1 !== pw2) return setError("비밀번호가 일치하지 않습니다.");
    setError(null);
    setPending(true);
    try {
      const res = await resetPassword({
        name,
        phone: hp,
        loginId: selectedId,
        newPassword: pw1,
      });
      if (!res.ok) return setError(res.error);
      setResetDone(true);
    } finally {
      setPending(false);
    }
  };

  if (!open) return null;

  return (
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
        onClick={close}
        className="absolute inset-0 bg-black/80"
      />

      <div className="relative w-full max-w-[360px] rounded-lg bg-white p-7">
        <h3 className="text-[17px] font-bold text-ink-900">아이디/비밀번호 찾기</h3>

        {/* ============================================================
            1단계 — 이름/휴대폰으로 본인확인
            ============================================================ */}
        {!loginIds && (
          <>
            <p className="mt-2 text-[13px] text-ink-500">
              회원 가입시 이름 및 휴대폰 번호를 입력해 주세요.
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <label htmlFor="idpw-find-name" className={labelClass}>
                  이름
                </label>
                <input
                  id="idpw-find-name"
                  type="text"
                  maxLength={10}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="idpw-find-hp" className={labelClass}>
                  HP
                </label>
                <input
                  id="idpw-find-hp"
                  type="text"
                  inputMode="numeric"
                  maxLength={11}
                  placeholder="숫자만 입력해 주세요."
                  value={hp}
                  onChange={(e) => setHp(e.target.value.replace(/\D/g, ""))}
                  className={inputClass}
                />
              </div>
            </div>

            {error && (
              <p role="alert" className="mt-3 text-[13px] text-board-tag">
                {error}
              </p>
            )}

            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={onFind}
                disabled={pending}
                className="flex-1 bg-[#1A1A1A] py-3 text-[14px] text-white transition-colors hover:bg-[#AE031B] disabled:opacity-60"
              >
                {pending ? "조회 중..." : "아이디/비번 찾기"}
              </button>
              <button
                type="button"
                onClick={close}
                className="border border-ink-200 px-5 text-[14px] text-ink-500"
              >
                닫기
              </button>
            </div>
          </>
        )}

        {/* ============================================================
            2단계 — 아이디 표시 + 비밀번호 재설정
            ============================================================ */}
        {loginIds && !resetDone && (
          <>
            <p className="mt-2 text-[13px] text-ink-500">
              회원님의 아이디입니다. 비밀번호를 잊으셨다면 새 비밀번호를
              입력해 주세요.
            </p>

            {/* 찾은 아이디 — 여러 개면 재설정할 계정을 선택 */}
            <ul className="mt-4 space-y-1 rounded bg-ink-50 p-4">
              {loginIds.map((id) => (
                <li key={id}>
                  <label className="flex items-center gap-2 text-[14px] font-semibold text-ink-900">
                    {loginIds.length > 1 && (
                      <input
                        type="radio"
                        name="idpw-selected"
                        checked={selectedId === id}
                        onChange={() => setSelectedId(id)}
                        className="h-4 w-4 accent-brand-600"
                      />
                    )}
                    {id}
                  </label>
                </li>
              ))}
            </ul>

            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="idpw-new-pw1" className={labelClass}>
                  새 비밀번호
                </label>
                <input
                  id="idpw-new-pw1"
                  type="password"
                  maxLength={12}
                  value={pw1}
                  onChange={(e) => setPw1(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="idpw-new-pw2" className={labelClass}>
                  새 비밀번호 재입력
                </label>
                <input
                  id="idpw-new-pw2"
                  type="password"
                  maxLength={12}
                  value={pw2}
                  onChange={(e) => setPw2(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            {error && (
              <p role="alert" className="mt-3 text-[13px] text-board-tag">
                {error}
              </p>
            )}

            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={onReset}
                disabled={pending}
                className="flex-1 bg-[#1A1A1A] py-3 text-[14px] text-white transition-colors hover:bg-[#AE031B] disabled:opacity-60"
              >
                {pending ? "재설정 중..." : "비밀번호 재설정"}
              </button>
              <button
                type="button"
                onClick={close}
                className="border border-ink-200 px-5 text-[14px] text-ink-500"
              >
                닫기
              </button>
            </div>
          </>
        )}

        {/* ============================================================
            완료
            ============================================================ */}
        {resetDone && (
          <>
            <p className="mt-4 text-[14px] leading-relaxed text-ink-700">
              비밀번호가 변경되었습니다.
              <br />새 비밀번호로 로그인해 주세요.
            </p>
            <button
              type="button"
              onClick={close}
              className="mt-6 w-full bg-[#1A1A1A] py-3 text-[14px] text-white transition-colors hover:bg-[#AE031B]"
            >
              확인
            </button>
          </>
        )}
      </div>
    </div>
  );
}
