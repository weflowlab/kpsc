"use client";

/* ==========================================================================
   마이페이지 화면 (원본 mypage.php 재현)
   - 상단: 서브 비주얼 "회원관리" + 가운데 타이틀 + 배너 이미지
   - 마이페이지 메뉴 셀렉트: 마이데스크 / 회원정보조회·수정 전환
   - 마이데스크: 회원정보 표(아이디/이름+회원탈퇴/회원그룹/이메일/연락처/정보수정)
     + 회원공지(최신 공지 3건)
   - 정보수정: 이름·아이디 고정(회색), 비밀번호(비우면 유지)/이메일/휴대폰 수정
   ========================================================================== */

import Link from "next/link";
import Image from "next/image";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import SubLayout from "@/components/sub/SubLayout";
import { updateMyInfo, deleteMyAccount } from "@/app/actions/auth";

const HP_PREFIXES = ["010", "011", "016", "017", "018", "019"];

/* 원본 회원그룹 표기 */
const GRADE_LABELS: Record<string, string> = {
  NORMAL: "일반회원",
  VIP: "VIP 등급",
  VVIP: "VVIP 등급",
  ADMIN: "최고 관리자 등급",
};

const inputClass =
  "h-9 w-full border border-[#E4E4E4] px-3 text-[14px] outline-none focus:border-brand-600";
const readonlyClass =
  "h-9 w-full border border-[#E4E4E4] bg-[#EFEFEF] px-3 text-[14px] text-ink-500 outline-none";
const labelClass = "mb-2 block text-[14px] font-semibold text-ink-900";

type MemberInfo = {
  loginId: string;
  name: string;
  email: string;
  phone: string;
  remail: boolean;
  grade: string;
};

type NoticeRow = { id: number; title: string; date: string };

export default function MyPageView({
  view,
  member,
  notices,
}: {
  view: "desk" | "info";
  member: MemberInfo;
  notices: NoticeRow[];
}) {
  const router = useRouter();
  const [p1 = "010", p2 = "", p3 = ""] = member.phone.split("-");

  /* 정보수정 폼 상태 */
  const [form, setForm] = useState({
    pw1: "",
    pw2: "",
    email: member.email,
    remail: member.remail,
    phone1: p1,
    phone2: p2,
    phone3: p3,
  });
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const set = (key: keyof typeof form) => (v: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: v }));

  /* ------------------------------------------------------------------
     정보 수정 제출
     ------------------------------------------------------------------ */
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (pending) return;
    setPending(true);
    setMessage(null);
    try {
      const res = await updateMyInfo({
        password: form.pw1,
        passwordConfirm: form.pw2,
        email: form.email,
        remail: form.remail,
        phone1: form.phone1,
        phone2: form.phone2,
        phone3: form.phone3,
      });
      if (!res.ok) return setMessage(res.error);
      setMessage("회원정보가 수정되었습니다.");
      setForm((prev) => ({ ...prev, pw1: "", pw2: "" }));
      router.refresh();
    } finally {
      setPending(false);
    }
  };

  /* ------------------------------------------------------------------
     회원탈퇴
     ------------------------------------------------------------------ */
  const onWithdraw = async () => {
    /* 원본 알럿 문구 그대로 */
    if (
      !confirm(
        "탈퇴하시면 고객님의 모든 정보가 완전히 삭제됩니다.\n\n정말로 탈퇴하시겠습니까?"
      )
    )
      return;
    const res = await deleteMyAccount();
    if (!res.ok) return alert(res.error);
    alert("탈퇴 처리되었습니다. 그동안 이용해 주셔서 감사합니다.");
    window.location.href = "/";
  };

  /* 원본 표 행 스타일 */
  const th =
    "w-[120px] shrink-0 bg-[#F5F4F4] px-4 py-3 text-[13px] font-semibold text-ink-700 md:w-[160px]";
  const td = "flex-1 px-4 py-3 text-[13px] text-ink-700";

  return (
    <SubLayout
      pathname="/mypage"
      visualTitle="회원관리"
      banner="member"
      hideSubNav
    >
      <div className="mx-auto max-w-[1050px]">
        {/* 타이틀 — 원본 .sub_title 형식 (가운데 + 풀폭 밑줄) */}
        <h2 className="w-full border-b-2 border-[#D9D9D9] text-center text-[22px] leading-[43px] font-bold text-[#222] md:text-[28px]">
          {view === "info" ? "정보수정" : "마이페이지"}
        </h2>

        {/* 배너 이미지 — 원본 마이페이지 배너 (노트북+도시 전경) */}
        <Image
          src="/mypage_title.jpg"
          alt=""
          width={1050}
          height={192}
          className="mx-auto mt-10 w-full"
        />

        {/* ================================================================
            안내 바 + 마이페이지 메뉴 셀렉트 (원본 그대로)
            ================================================================ */}
        <div className="mx-auto mt-8 max-w-[820px] border border-[#E4E4E4] bg-[#F9F9F9] p-4 text-center text-[13px] text-ink-700">
          <p className="font-semibold">
            {member.name}({member.loginId})님의 회원가입 정보입니다.
          </p>
          <label className="mt-2 inline-flex items-center gap-2">
            마이페이지 메뉴 :
            <select
              value={view}
              onChange={(e) =>
                router.push(
                  e.target.value === "info" ? "/mypage?query=info" : "/mypage"
                )
              }
              className="border border-[#C0C0C0] bg-white px-2 py-1 text-[13px] outline-none"
            >
              <option value="desk">· 마이데스크</option>
              <option value="info">· 회원정보조회/수정</option>
            </select>
          </label>
        </div>

        {/* ================================================================
            마이데스크 — 회원정보 표 + 회원공지
            ================================================================ */}
        {view === "desk" && (
          <div className="mx-auto mt-6 max-w-[820px]">
            <p className="mb-2 text-[14px] font-semibold text-ink-900">📁 회원정보</p>
            <div className="border-t-2 border-[#B2B2B2]">
              {(
                [
                  ["아이디", member.loginId],
                  ["이름", null], // 이름 행은 회원탈퇴 링크 포함이라 별도 렌더
                  ["회원그룹", GRADE_LABELS[member.grade] ?? member.grade],
                  ["이메일", member.email],
                  ["연락처", member.phone],
                  ["정보수정", null], // 링크 행
                ] as const
              ).map(([label, value]) => (
                <div key={label} className="flex border-b border-[#E4E4E4]">
                  <span className={th}>{label}</span>
                  <span className={td}>
                    {label === "이름" ? (
                      <>
                        {member.name}
                        <button
                          type="button"
                          onClick={onWithdraw}
                          className="ml-3 text-[12px] text-board-tag underline-offset-2 hover:underline"
                        >
                          ✉ 회원탈퇴
                        </button>
                      </>
                    ) : label === "정보수정" ? (
                      <Link
                        href="/mypage?query=info"
                        className="text-brand-600 underline-offset-2 hover:underline"
                      >
                        회원 정보변경
                      </Link>
                    ) : (
                      value
                    )}
                  </span>
                </div>
              ))}
            </div>

            {/* 회원공지 — 최신 공지 3건 */}
            <p className="mt-8 mb-2 text-[14px] font-semibold text-ink-900">📁 회원공지</p>
            <div className="border border-[#E4E4E4]">
              {notices.length > 0 ? (
                notices.map((n) => (
                  <Link
                    key={n.id}
                    href={`/news/notice/${n.id}`}
                    className="flex items-center justify-between border-b border-[#E4E4E4] px-4 py-2.5 text-[13px] text-ink-700 last:border-0 hover:bg-[#F9F9F9] hover:text-brand-600"
                  >
                    <span className="truncate">{n.title}</span>
                    <span className="ml-4 shrink-0 text-[12px] text-ink-400">{n.date}</span>
                  </Link>
                ))
              ) : (
                <p className="px-4 py-6 text-center text-[13px] text-ink-400">
                  등록된 공지가 없습니다.
                </p>
              )}
            </div>
          </div>
        )}

        {/* ================================================================
            회원정보조회/수정 — 원본 정보수정 폼
            ================================================================ */}
        {view === "info" && (
          <form onSubmit={onSubmit} className="mx-auto mt-6 max-w-[820px] space-y-5">
            {/* 이름 / 아이디 — 변경 불가 (원본 회색 처리) */}
            <div>
              <span className={labelClass}>📁 이름</span>
              <input type="text" value={member.name} readOnly className={readonlyClass} />
            </div>
            <div>
              <span className={labelClass}>📁 아이디</span>
              <input type="text" value={member.loginId} readOnly className={readonlyClass} />
            </div>

            {/* 비밀번호 — 입력했을 때만 변경 */}
            <div>
              <label htmlFor="my-pw1" className={labelClass}>
                📁 비밀번호 <span className="font-normal text-ink-400">(변경할 때만 입력)</span>
              </label>
              <input
                id="my-pw1"
                type="password"
                maxLength={12}
                value={form.pw1}
                onChange={(e) => set("pw1")(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="my-pw2" className={labelClass}>📁 비밀번호 재입력</label>
              <input
                id="my-pw2"
                type="password"
                maxLength={12}
                value={form.pw2}
                onChange={(e) => set("pw2")(e.target.value)}
                className={inputClass}
              />
            </div>

            {/* 이메일 + 공지메일 */}
            <div>
              <label htmlFor="my-email" className={labelClass}>📁 이메일</label>
              <input
                id="my-email"
                type="text"
                value={form.email}
                onChange={(e) => set("email")(e.target.value)}
                className={inputClass}
              />
              <label className="mt-2 flex items-center gap-2 text-[13px] text-ink-500">
                <input
                  type="checkbox"
                  checked={form.remail}
                  onChange={(e) => set("remail")(e.target.checked)}
                  className="h-4 w-4 accent-brand-600"
                />
                공지메일을 받음
              </label>
            </div>

            {/* 휴대폰 3분할 */}
            <div>
              <span className={labelClass}>📁 휴대폰</span>
              <div className="flex items-center gap-2">
                <select
                  aria-label="휴대폰 국번"
                  value={form.phone1}
                  onChange={(e) => set("phone1")(e.target.value)}
                  className={inputClass}
                >
                  {HP_PREFIXES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  aria-label="휴대폰 중간 자리"
                  value={form.phone2}
                  onChange={(e) => set("phone2")(e.target.value.replace(/\D/g, ""))}
                  className={inputClass}
                />
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  aria-label="휴대폰 끝 자리"
                  value={form.phone3}
                  onChange={(e) => set("phone3")(e.target.value.replace(/\D/g, ""))}
                  className={inputClass}
                />
              </div>
            </div>

            {/* 메시지 */}
            {message && (
              <p
                role="alert"
                className={`text-[13px] ${
                  message === "회원정보가 수정되었습니다." ? "text-green-600" : "text-board-tag"
                }`}
              >
                {message}
              </p>
            )}

            {/* 정보 수정 버튼 */}
            <button
              type="submit"
              disabled={pending}
              className="w-full bg-[#1A1A1A] py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-[#AE031B] disabled:opacity-60"
            >
              {pending ? "수정 중..." : "정보 수정"}
            </button>
          </form>
        )}
      </div>
    </SubLayout>
  );
}
