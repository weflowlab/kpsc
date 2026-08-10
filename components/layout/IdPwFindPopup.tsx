"use client";

/* ==========================================================================
   아이디/비밀번호 찾기 레이어 팝업 (원본 id_pw_layerpopup)
   원본은 어떤 페이지에서든 goThisPopupShow('id_pw_layerpopup')로 여는
   전역 팝업이다. 여기서는 layout 에 한 번 마운트해 두고, 어디서든
   openIdPwPopup() 을 부르면 커스텀 이벤트로 열린다.
   ========================================================================== */

import { useEffect, useState } from "react";

const OPEN_EVENT = "kpsc:open-idpw-popup";

/** 어느 컴포넌트에서든 호출하면 팝업이 열린다 */
export function openIdPwPopup() {
  window.dispatchEvent(new CustomEvent(OPEN_EVENT));
}

export default function IdPwFindPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);

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
        onClick={() => setOpen(false)}
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
              htmlFor="idpw-find-name"
              className="mb-1.5 block text-[13px] font-semibold text-ink-900"
            >
              이름
            </label>
            <input
              id="idpw-find-name"
              type="text"
              maxLength={10}
              className="h-9 w-full border border-[#E4E4E4] px-3 text-[14px] outline-none focus:border-brand-600"
            />
          </div>
          <div>
            <label
              htmlFor="idpw-find-hp"
              className="mb-1.5 block text-[13px] font-semibold text-ink-900"
            >
              HP
            </label>
            <input
              id="idpw-find-hp"
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
            className="flex-1 bg-[#1A1A1A] py-3 text-[14px] text-white transition-colors hover:bg-[#AE031B]"
          >
            아이디/비번 찾기
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="border border-ink-200 px-5 text-[14px] text-ink-500"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
