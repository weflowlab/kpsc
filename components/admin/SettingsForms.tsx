"use client";

/* ==========================================================================
   관리자 > 환경설정 폼 — 약관/개인정보 텍스트 저장 + 관리자 비밀번호 변경
   ========================================================================== */

import { useState } from "react";
import { saveSetting, changeAdminPassword } from "@/app/actions/admin";

const CARD = "rounded-lg border border-ink-200 bg-white p-6";
const FIELD =
  "w-full rounded-md border border-ink-200 bg-white px-3 py-2 text-[13px] outline-none focus:border-brand-600";

/* ----- 약관/보호정책 편집 카드 ----- */
function TextSetting({
  settingKey,
  title,
  initial,
}: {
  settingKey: "terms" | "privacy";
  title: string;
  initial: string;
}) {
  const [value, setValue] = useState(initial);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const onSave = async () => {
    if (pending) return;
    setPending(true);
    setMessage(null);
    try {
      const res = await saveSetting({ key: settingKey, value });
      setMessage(res.ok ? "저장했습니다." : res.error);
    } finally {
      setPending(false);
    }
  };

  return (
    <section className={CARD}>
      <h2 className="mb-3 text-[15px] font-bold">{title}</h2>
      <textarea
        aria-label={title}
        rows={14}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={`${FIELD} resize-y leading-[1.7]`}
      />
      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          onClick={onSave}
          disabled={pending}
          className="rounded-md bg-ink-900 px-5 py-2 text-[13px] font-semibold text-white hover:bg-brand-600 disabled:opacity-50"
        >
          {pending ? "저장 중..." : "저장합니다"}
        </button>
        {message && (
          <p className={`text-[13px] ${message === "저장했습니다." ? "text-green-600" : "text-board-tag"}`}>
            {message}
          </p>
        )}
      </div>
    </section>
  );
}

/* ----- 관리자 비밀번호 변경 카드 (원본 cfg_root.php) ----- */
function PasswordSetting() {
  const [current, setCurrent] = useState("");
  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const onSave = async () => {
    if (pending) return;
    if (pw1 !== pw2) return setMessage("변경할 비밀번호가 서로 일치하지 않습니다.");
    setPending(true);
    setMessage(null);
    try {
      const res = await changeAdminPassword({ current, next: pw1 });
      if (res.ok) {
        setMessage("비밀번호를 변경했습니다.");
        setCurrent("");
        setPw1("");
        setPw2("");
      } else {
        setMessage(res.error);
      }
    } finally {
      setPending(false);
    }
  };

  return (
    <section className={CARD}>
      <h2 className="mb-1 text-[15px] font-bold">관리자 비밀번호 변경</h2>
      <p className="mb-4 text-[12px] text-ink-400">
        현재 로그인한 관리자 계정의 비밀번호를 변경합니다. (암호화되어 저장됩니다)
      </p>
      <div className="grid max-w-[420px] gap-3">
        <label className="text-[13px]">
          <span className="mb-1 block font-semibold text-ink-700">현재의 비밀번호</span>
          <input
            type="password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            className={FIELD}
          />
        </label>
        <label className="text-[13px]">
          <span className="mb-1 block font-semibold text-ink-700">변경할 비밀번호</span>
          <input
            type="password"
            maxLength={12}
            value={pw1}
            onChange={(e) => setPw1(e.target.value)}
            className={FIELD}
          />
        </label>
        <label className="text-[13px]">
          <span className="mb-1 block font-semibold text-ink-700">변경할 비밀번호 재입력</span>
          <input
            type="password"
            maxLength={12}
            value={pw2}
            onChange={(e) => setPw2(e.target.value)}
            className={FIELD}
          />
        </label>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={onSave}
          disabled={pending}
          className="rounded-md bg-ink-900 px-5 py-2 text-[13px] font-semibold text-white hover:bg-brand-600 disabled:opacity-50"
        >
          {pending ? "적용 중..." : "설정을 적용합니다"}
        </button>
        {message && (
          <p className={`text-[13px] ${message === "비밀번호를 변경했습니다." ? "text-green-600" : "text-board-tag"}`}>
            {message}
          </p>
        )}
      </div>
    </section>
  );
}

export default function SettingsForms({
  terms,
  privacy,
}: {
  terms: string;
  privacy: string;
}) {
  return (
    <div className="space-y-6">
      <TextSetting settingKey="terms" title="회원가입 약관" initial={terms} />
      <TextSetting settingKey="privacy" title="개인정보 보호정책" initial={privacy} />
      <PasswordSetting />
    </div>
  );
}
