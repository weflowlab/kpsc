/* ==========================================================================
   회원가입  (원본 /regis.php)
   원본 재현 포인트
   - 서브 비주얼 타이틀 "회원관리", 좌측 서브메뉴 없음(전체폭)
   - 필드: 이름 / 아이디(+중복확인) / 비밀번호 / 비밀번호 재입력 / 이메일
           / 공지메일 수신(기본 체크) / 휴대폰 3분할(국번 select + 4자리 + 4자리)
   - 약관 동의는 체크박스가 아니라 라디오 2쌍이며, 기본값은 "동의합니다"
     (클라이언트 요청). 약관 전문은 lib/content/terms.ts 의 전달본 사용
   ========================================================================== */

"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import SubLayout from "@/components/sub/SubLayout";
import { PRIVACY_POLICY, TERMS_OF_SERVICE } from "@/lib/content/terms";

/* --------------------------------------------------------------------------
   휴대폰 국번 옵션 — 원본 select 값 그대로
   -------------------------------------------------------------------------- */
const HP_PREFIXES = ["국번", "010", "011", "016", "017", "018", "019"];

/* --------------------------------------------------------------------------
   입력 필드 공용 스타일
   -------------------------------------------------------------------------- */
const inputClass =
  "h-9 w-full border border-[#E4E4E4] px-3 text-[14px] outline-none focus:border-brand-600";
const labelClass = "mb-2 block text-[14px] font-semibold text-ink-900";

export default function RegisterPage() {
  /* 입력 상태 */
  const [form, setForm] = useState({
    MB_NAME: "",
    MB_ID: "",
    MB_PW1: "",
    MB_PW2: "",
    MB_EMAIL: "",
    MB_HAND_TEL1: "국번",
    MB_HAND_TEL2: "",
    MB_HAND_TEL3: "",
  });
  const [remail, setRemail] = useState(true); // 공지메일 수신 — 원본 기본 checked
  const [infoAgree, setInfoAgree] = useState("1"); // 개인정보 수집 동의 (기본 동의)
  const [joinAgree, setJoinAgree] = useState("1"); // 이용약관 동의 (기본 동의)
  const [error, setError] = useState<string | null>(null);

  /* 약관 팝업 */
  const [popup, setPopup] = useState<"privacy" | "guide" | null>(null);

  const set = (key: keyof typeof form) => (v: string) =>
    setForm((prev) => ({ ...prev, [key]: v }));

  /* ------------------------------------------------------------------
     제출 검증 — 원본 알럿 문구를 그대로 사용
     ------------------------------------------------------------------ */
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.MB_NAME.trim()) return setError("이름이 입력되지 않았습니다.");
    if (!/^[A-Za-z][A-Za-z0-9]{3,11}$/.test(form.MB_ID))
      return setError(
        "ID/PW는 영문자로 시작하는 4~12자의 영문/숫자조합 공백없이 기입 해주세요."
      );
    if (form.MB_PW1.length < 4 || form.MB_PW1.length > 12)
      return setError("비밀번호는 4자 이상 12자 이하로 입력해 주세요.");
    if (form.MB_PW1 !== form.MB_PW2)
      return setError("비밀번호가 일치하지 않습니다.");
    if (
      form.MB_EMAIL.length <= 6 ||
      !form.MB_EMAIL.includes("@") ||
      !form.MB_EMAIL.includes(".")
    )
      return setError("이메일을 정확히 입력해 주세요.");
    if (form.MB_HAND_TEL1 === "국번")
      return setError("첫번째 휴대폰 번호를 입력해 주세요.");
    if (!form.MB_HAND_TEL2) return setError("두번째 휴대폰 번호를 입력해 주세요.");
    if (!form.MB_HAND_TEL3) return setError("세번째 휴대폰 번호를 입력해 주세요.");
    if (infoAgree !== "1" || joinAgree !== "1")
      return setError("개인정보제공 및 이용약관에 모두 동의가 필요합니다.");
    setError(null);
  };

  return (
    <SubLayout
      pathname="/register"
      visualTitle="회원관리"
      banner="member"
      hideSubNav
    >
      <div className="mx-auto max-w-[1050px]">
        {/* ================================================================
            타이틀 — 원본 .sub_title 형식 (가운데 + 풀폭 밑줄)
            ================================================================ */}
        <h2 className="w-full border-b-2 border-[#D9D9D9] text-center text-[22px] leading-[43px] font-bold text-[#222] md:text-[28px]">
          회원가입
        </h2>

        {/* 원본 회원가입 타이틀 이미지 — 원본 크기(1050px) 그대로
            (template/regis/default/image/join_title.jpg) */}
        <Image
          src="/images/register-title.webp"
          alt="노트북과 커피가 있는 책상 이미지"
          width={1050}
          height={192}
          className="mx-auto mt-10 w-full"
        />

        {/* ================================================================
            가입 폼 — 원본처럼 이미지보다 살짝 좁은 폭
            ================================================================ */}
        <form onSubmit={onSubmit} className="mx-auto mt-8 max-w-[820px] space-y-5">
          {/* 이름 */}
          <div>
            <label htmlFor="MB_NAME" className={labelClass}>
              📁 이름
            </label>
            <input
              id="MB_NAME"
              type="text"
              value={form.MB_NAME}
              onChange={(e) => set("MB_NAME")(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* 아이디 + 중복확인 */}
          <div>
            <label htmlFor="MB_ID" className={labelClass}>
              📁 아이디
            </label>
            <div className="flex gap-2">
              <input
                id="MB_ID"
                type="text"
                value={form.MB_ID}
                onChange={(e) => set("MB_ID")(e.target.value)}
                className={inputClass}
              />
              <button
                type="button"
                className="shrink-0 border border-ink-200 px-4 text-[13px] text-ink-700 transition-colors hover:border-[#8C0014] hover:bg-[#AE031B] hover:text-white"
              >
                아이디 중복확인
              </button>
            </div>
            <p className="mt-2 text-[12px] text-ink-400">
              ID/PW는 영문자로 시작하는 4~12자의 영문/숫자조합 공백없이 기입 해주세요.
            </p>
          </div>

          {/* 비밀번호 */}
          <div>
            <label htmlFor="MB_PW1" className={labelClass}>
              📁 비밀번호
            </label>
            <input
              id="MB_PW1"
              type="password"
              value={form.MB_PW1}
              onChange={(e) => set("MB_PW1")(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* 비밀번호 재입력 */}
          <div>
            <label htmlFor="MB_PW2" className={labelClass}>
              📁 비밀번호 재입력
            </label>
            <input
              id="MB_PW2"
              type="password"
              value={form.MB_PW2}
              onChange={(e) => set("MB_PW2")(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* 이메일 + 공지메일 수신 */}
          <div>
            <label htmlFor="MB_EMAIL" className={labelClass}>
              📁 이메일
            </label>
            <input
              id="MB_EMAIL"
              type="email"
              value={form.MB_EMAIL}
              onChange={(e) => set("MB_EMAIL")(e.target.value)}
              className={inputClass}
            />
            <label className="mt-2 flex items-center gap-2 text-[13px] text-ink-500">
              <input
                type="checkbox"
                checked={remail}
                onChange={(e) => setRemail(e.target.checked)}
                className="h-4 w-4 accent-brand-600"
              />
              공지메일을 받음
            </label>
          </div>

          {/* 휴대폰 3분할 */}
          <div>
            <span className={labelClass}>📁 휴대폰</span>
            <div className="grid grid-cols-3 gap-2">
              <select
                aria-label="휴대폰 국번"
                value={form.MB_HAND_TEL1}
                onChange={(e) => set("MB_HAND_TEL1")(e.target.value)}
                className={inputClass}
              >
                {HP_PREFIXES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <input
                aria-label="휴대폰 중간 자리"
                type="text"
                inputMode="numeric"
                maxLength={4}
                value={form.MB_HAND_TEL2}
                onChange={(e) => set("MB_HAND_TEL2")(e.target.value)}
                className={inputClass}
              />
              <input
                aria-label="휴대폰 끝 자리"
                type="text"
                inputMode="numeric"
                maxLength={4}
                value={form.MB_HAND_TEL3}
                onChange={(e) => set("MB_HAND_TEL3")(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* ==============================================================
              약관 동의 — 라디오 2쌍 (원본 구조 그대로)
              ============================================================== */}
          <fieldset className="rounded-lg bg-ink-50 p-5">
            <legend className="sr-only">약관 동의</legend>

            {/* 개인정보 수집 */}
            <div className="space-y-2">
              {[
                { value: "0", label: "개인정보 수집에 동의하지 않습니다." },
                { value: "1", label: "개인정보 수집에 동의합니다.", view: "privacy" },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-center gap-2 text-[13px] text-ink-700"
                >
                  <input
                    type="radio"
                    name="info_agree"
                    value={opt.value}
                    checked={infoAgree === opt.value}
                    onChange={() => setInfoAgree(opt.value)}
                    className="h-4 w-4 accent-brand-600"
                  />
                  {opt.label}
                  {opt.view && (
                    <button
                      type="button"
                      onClick={() => setPopup("privacy")}
                      className="text-brand-600 underline"
                    >
                      [보기]
                    </button>
                  )}
                </label>
              ))}
            </div>

            <hr className="my-4 border-ink-200" />

            {/* 이용약관 */}
            <div className="space-y-2">
              {[
                { value: "0", label: "회원가입 및 이용약관에 동의하지 않습니다." },
                { value: "1", label: "회원가입 및 이용약관에 동의합니다.", view: "guide" },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-center gap-2 text-[13px] text-ink-700"
                >
                  <input
                    type="radio"
                    name="join_agree"
                    value={opt.value}
                    checked={joinAgree === opt.value}
                    onChange={() => setJoinAgree(opt.value)}
                    className="h-4 w-4 accent-brand-600"
                  />
                  {opt.label}
                  {opt.view && (
                    <button
                      type="button"
                      onClick={() => setPopup("guide")}
                      className="text-brand-600 underline"
                    >
                      [보기]
                    </button>
                  )}
                </label>
              ))}
            </div>
          </fieldset>

          {/* 오류 메시지 */}
          {error && (
            <p role="alert" className="text-[13px] text-board-tag">
              {error}
            </p>
          )}

          {/* 가입 버튼 */}
          <button
            type="submit"
            className="w-full bg-[#1A1A1A] py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-[#AE031B]"
          >
            회원가입
          </button>
        </form>
      </div>

      {/* ================================================================
          약관 레이어 팝업 (원본 privacy_layerpopup / guide_layerpopup)
          ================================================================ */}
      {popup && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={popup === "privacy" ? "개인정보 처리방침" : "홈페이지 이용약관"}
          className="fixed inset-0 z-[29999] flex items-center justify-center px-4"
        >
          <button
            type="button"
            aria-label="닫기"
            onClick={() => setPopup(null)}
            className="absolute inset-0 bg-black/80"
          />

          <div className="relative flex max-h-[80vh] w-full max-w-[560px] flex-col rounded-lg bg-white">
            <h3 className="border-b border-ink-200 px-6 py-4 text-[17px] font-bold text-ink-900">
              {popup === "privacy" ? "KPSC 개인정보 처리방침" : "KPSC 홈페이지 이용약관"}
            </h3>

            {/* 약관 본문 — 전문 (lib/content/terms.ts) */}
            <div className="flex-1 overflow-y-auto px-6 py-5 text-[13px] leading-[1.9] whitespace-pre-line text-ink-500">
              {popup === "privacy" ? PRIVACY_POLICY : TERMS_OF_SERVICE}
            </div>

            <div className="border-t border-ink-200 px-6 py-4">
              <button
                type="button"
                onClick={() => setPopup(null)}
                className="w-full bg-[#1A1A1A] py-3 text-[14px] text-white transition-colors hover:bg-brand-600"
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
