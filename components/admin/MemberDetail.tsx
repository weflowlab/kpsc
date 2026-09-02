"use client";

/* ==========================================================================
   관리자 > 회원 상세 화면 (원본 member.php 팝업 리뉴얼)
   1) 개인정보에 대해서.. — 실명/닉네임/등급/이메일/휴대폰/공지메일 저장,
      패스워드 재지정
   2) 캐쉬 관리 — 지급(환급) 폼 + 내역 (원본 query=cash)
   3) 포인트 관리 — 지급(환급) 폼 + 내역 (원본 query=point)
   ========================================================================== */

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  updateMemberInfo,
  updateMemberGrade,
  adminResetMemberPassword,
  giveMemberBalance,
  deleteBalanceLog,
} from "@/app/actions/admin";

type MemberData = {
  id: number;
  loginId: string;
  name: string;
  nickname: string;
  email: string;
  phone: string;
  remail: boolean;
  grade: string;
  memberType: string;
  status: string;
  points: number;
  cash: number;
  createdAt: string;
  postCount: number;
  commentCount: number;
  loginCount: number;
  lastLoginAt: string | null;
  online: boolean;
};

type LogRow = {
  id: number;
  kind: "CASH" | "POINT";
  amount: number;
  reason: string;
  createdAt: string;
};

type LoginLogRow = {
  id: number;
  ip: string;
  userAgent: string;
  createdAt: string;
};

/* User-Agent 문자열을 원본 접속 Agent 처럼 짧게 요약 */
function shortAgent(ua: string): string {
  const os = /Windows/i.test(ua)
    ? "Windows"
    : /iPhone|iPad/i.test(ua)
      ? "iOS"
      : /Android/i.test(ua)
        ? "Android"
        : /Mac OS/i.test(ua)
          ? "macOS"
          : /Linux/i.test(ua)
            ? "Linux"
            : "기타";
  const browser = /Edg\//i.test(ua)
    ? "Edge"
    : /Whale/i.test(ua)
      ? "Whale"
      : /SamsungBrowser/i.test(ua)
        ? "삼성브라우저"
        : /Chrome/i.test(ua)
          ? "Chrome"
          : /Safari/i.test(ua)
            ? "Safari"
            : /Firefox/i.test(ua)
              ? "Firefox"
              : "기타";
  return `${os} · ${browser}`;
}

const GRADE_LABELS: Record<string, string> = {
  NORMAL: "[1]일반회원",
  VIP: "[2]VIP 등급",
  VVIP: "[3]VVIP 등급",
  ADMIN: "[4]최고 관리자 등급",
};

const CARD = "rounded-lg border border-ink-200 bg-white p-6";
const FIELD =
  "w-full rounded-md border border-ink-200 bg-white px-3 py-2 text-[13px] outline-none focus:border-brand-600";
const LABEL = "mb-1.5 block text-[13px] font-semibold text-ink-700";
const fmt = (n: number) => n.toLocaleString("ko-KR");

/* --------------------------------------------------------------------------
   캐쉬/포인트 관리 카드 (원본 query=cash / query=point 화면)
   -------------------------------------------------------------------------- */
function BalanceCard({
  memberId,
  kind,
  total,
  logs,
  anchorId,
}: {
  memberId: number;
  kind: "CASH" | "POINT";
  total: number;
  logs: LogRow[];
  /** 목록에서 #cash / #point 로 바로 스크롤되는 앵커 */
  anchorId: string;
}) {
  const router = useRouter();
  const label = kind === "CASH" ? "캐쉬" : "포인트";
  const unit = kind === "CASH" ? "원" : "점";
  const [sign, setSign] = useState<"+" | "-">("+");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const onGive = async () => {
    if (pending) return;
    const n = Number(amount);
    if (!Number.isInteger(n) || n <= 0)
      return setMessage("금액을 양의 정수로 입력해 주세요.");
    if (!reason.trim()) return setMessage("근거자료를 입력해 주세요.");
    setPending(true);
    setMessage(null);
    try {
      const res = await giveMemberBalance({
        memberIds: [memberId],
        field: kind === "CASH" ? "cash" : "points",
        amount: sign === "+" ? n : -n,
        reason,
      });
      if (!res.ok) return setMessage(res.error);
      setAmount("");
      setReason("");
      router.refresh();
    } finally {
      setPending(false);
    }
  };

  const onDeleteLog = async (log: LogRow) => {
    if (
      !confirm(
        `'${log.reason}' (${fmt(log.amount)}${unit}) 내역을 삭제하시겠습니까?\n삭제한 만큼 잔액에서 되돌려집니다.`
      )
    )
      return;
    const res = await deleteBalanceLog(log.id);
    if (!res.ok) return alert(res.error);
    router.refresh();
  };

  return (
    <section id={anchorId} className={`${CARD} scroll-mt-20`}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[15px] font-bold">{label} 관리</h2>
        <p className="text-[14px] font-bold text-board-tag">
          총 {fmt(total)}{unit}
        </p>
      </div>

      {/* 지급(환급) 폼 — 원본 [+/-][금액][근거자료][지급(환급)합니다] */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <select
          aria-label={`${label} 증감`}
          value={sign}
          onChange={(e) => setSign(e.target.value as "+" | "-")}
          className="rounded-md border border-ink-200 bg-white px-2 py-2 text-[13px] outline-none"
        >
          <option value="+">+</option>
          <option value="-">-</option>
        </select>
        <input
          type="text"
          inputMode="numeric"
          aria-label={`${label} 금액`}
          placeholder={`${unit === "원" ? "원" : "점"} 단위 금액`}
          value={amount}
          onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
          className="w-[130px] rounded-md border border-ink-200 px-3 py-2 text-[13px] outline-none focus:border-brand-600"
        />
        <input
          type="text"
          aria-label="근거자료"
          placeholder="근거자료 (예: 회원가입 축하금)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="min-w-[200px] flex-1 rounded-md border border-ink-200 px-3 py-2 text-[13px] outline-none focus:border-brand-600"
        />
        <button
          type="button"
          onClick={onGive}
          disabled={pending}
          className="rounded-md bg-ink-900 px-4 py-2 text-[13px] font-semibold text-white hover:bg-brand-600 disabled:opacity-50"
        >
          지급(환급)합니다
        </button>
      </div>
      {message && (
        <p role="alert" className="mb-3 text-[13px] text-board-tag">
          {message}
        </p>
      )}

      {/* 내역 목록 — 모바일에서는 표만 가로 스크롤 */}
      <div className="overflow-x-auto">
      <table className="w-full min-w-[480px] text-[13px]">
        <thead>
          <tr className="border-y border-ink-200 bg-ink-50 text-left text-ink-500">
            <th className="p-2.5">번호</th>
            <th className="p-2.5 text-right">{label}금액</th>
            <th className="p-2.5">근거자료</th>
            <th className="p-2.5">기록일</th>
            <th className="p-2.5 text-center">삭제</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, i) => (
            <tr key={log.id} className="border-b border-ink-100 last:border-0">
              <td className="p-2.5 text-ink-400">{logs.length - i}</td>
              <td className={`p-2.5 text-right font-semibold ${log.amount < 0 ? "text-board-tag" : ""}`}>
                {fmt(log.amount)}
              </td>
              <td className="p-2.5">{log.reason}</td>
              <td className="p-2.5 whitespace-nowrap text-ink-400">{log.createdAt}</td>
              <td className="p-2.5 text-center">
                <button
                  type="button"
                  onClick={() => onDeleteLog(log)}
                  className="text-[12px] text-board-tag hover:underline"
                >
                  삭제
                </button>
              </td>
            </tr>
          ))}
          {logs.length === 0 && (
            <tr>
              <td colSpan={5} className="p-8 text-center text-ink-400">
                내역이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------------
   메인 — 개인정보 + 캐쉬/포인트
   -------------------------------------------------------------------------- */
export default function MemberDetail({
  member,
  logs,
  loginLogs,
  isSelf,
}: {
  member: MemberData;
  logs: LogRow[];
  loginLogs: LoginLogRow[];
  isSelf: boolean;
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: member.name,
    nickname: member.nickname,
    email: member.email,
    phone: member.phone,
    remail: member.remail,
    memberType: member.memberType,
    status: member.status,
  });
  const [grade, setGrade] = useState(member.grade);
  const [newPw, setNewPw] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [pwMessage, setPwMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const set = (key: keyof typeof form) => (v: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: v }));

  const onSave = async () => {
    if (pending) return;
    setPending(true);
    setMessage(null);
    try {
      const res = await updateMemberInfo({ memberId: member.id, ...form });
      if (!res.ok) return setMessage(res.error);
      /* 등급이 바뀌었으면 함께 저장 */
      if (grade !== member.grade) {
        const g = await updateMemberGrade({ memberId: member.id, grade });
        if (!g.ok) return setMessage(g.error);
      }
      setMessage("저장했습니다.");
      router.refresh();
    } finally {
      setPending(false);
    }
  };

  const onResetPw = async () => {
    if (!newPw) return setPwMessage("새 비밀번호를 입력해 주세요.");
    if (!confirm(`'${member.loginId}' 회원의 비밀번호를 새로 지정하시겠습니까?`)) return;
    const res = await adminResetMemberPassword({ memberId: member.id, newPassword: newPw });
    if (!res.ok) return setPwMessage(res.error);
    setNewPw("");
    setPwMessage("비밀번호를 변경했습니다. 회원에게 새 비밀번호를 전달해 주세요.");
  };

  return (
    <div className="space-y-6">
      {/* ================== 개인정보 ================== */}
      <section className={CARD}>
        {/* 모바일에서는 제목/정보줄을 위아래로 쌓는다 */}
        <div className="mb-4 flex flex-col gap-1.5 md:flex-row md:items-center md:justify-between">
          <h2 className="text-[15px] font-bold whitespace-nowrap">개인정보에 대해서..</h2>
          <p className="text-[12px] text-ink-400">
            {/* 현재 접속 상태 — 원본 상세의 현재: Online/Offline */}
            <span
              className={`mr-1 inline-block h-2.5 w-2.5 rounded-full align-middle ${
                member.online
                  ? "bg-yellow-400 shadow-[0_0_4px_1px_rgba(250,204,21,0.7)]"
                  : "bg-ink-200"
              }`}
            />
            {member.online ? "Online" : "Offline"} · 가입일 {member.createdAt} ·
            총접속 {member.loginCount}
            {member.lastLoginAt && (
              <> (마지막 접속일시 &gt;&gt; {member.lastLoginAt})</>
            )}{" "}
            · 글 {member.postCount} · 댓글 {member.commentCount}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="md-name" className={LABEL}>실명</label>
            <input id="md-name" type="text" value={form.name}
              onChange={(e) => set("name")(e.target.value)} className={FIELD} />
          </div>
          <div>
            <label htmlFor="md-nickname" className={LABEL}>닉네임</label>
            <input id="md-nickname" type="text" value={form.nickname}
              placeholder="비워두면 실명으로 표기"
              onChange={(e) => set("nickname")(e.target.value)} className={FIELD} />
          </div>
          <div>
            <label htmlFor="md-grade" className={LABEL}>회원(사)그룹</label>
            <select id="md-grade" value={grade} disabled={isSelf}
              onChange={(e) => setGrade(e.target.value)} className={`${FIELD} disabled:bg-ink-50`}>
              {Object.entries(GRADE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            {isSelf && (
              <p className="mt-1 text-[11px] text-ink-400">본인 계정의 등급은 변경할 수 없습니다.</p>
            )}
          </div>
          <div>
            <label htmlFor="md-status" className={LABEL}>승인상태</label>
            <select id="md-status" value={form.status} disabled={isSelf}
              onChange={(e) => set("status")(e.target.value)} className={`${FIELD} disabled:bg-ink-50`}>
              <option value="APPROVED">승인</option>
              <option value="PENDING">대기 (로그인 차단)</option>
            </select>
          </div>
          <div>
            <label htmlFor="md-phone" className={LABEL}>휴대폰</label>
            <input id="md-phone" type="text" value={form.phone} placeholder="010-1234-5678"
              onChange={(e) => set("phone")(e.target.value)} className={FIELD} />
          </div>
          <div>
            <label htmlFor="md-type" className={LABEL}>회원구분</label>
            <select id="md-type" value={form.memberType}
              onChange={(e) => set("memberType")(e.target.value)} className={FIELD}>
              <option value="PERSONAL">개인회원</option>
              <option value="BUSINESS">기업회원</option>
            </select>
          </div>
          <div>
            <label htmlFor="md-email" className={LABEL}>이메일</label>
            <input id="md-email" type="email" value={form.email}
              onChange={(e) => set("email")(e.target.value)} className={FIELD} />
          </div>
          <div className="flex items-end pb-2">
            <label className="flex items-center gap-2 text-[13px]">
              <input type="checkbox" checked={form.remail}
                onChange={(e) => set("remail")(e.target.checked)} />
              공지메일을 받음
            </label>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button type="button" onClick={onSave} disabled={pending}
            className="rounded-md bg-ink-900 px-6 py-2.5 text-[14px] font-semibold text-white hover:bg-brand-600 disabled:opacity-50">
            {pending ? "저장 중..." : "설정을 적용합니다"}
          </button>
          {message && (
            <p className={`text-[13px] ${message === "저장했습니다." ? "text-green-600" : "text-board-tag"}`}>
              {message}
            </p>
          )}
        </div>

        {/* 패스워드 재지정 */}
        <div className="mt-6 border-t border-ink-100 pt-4">
          <span className={LABEL}>패스워드 (새로 지정 — 비워두면 유지)</span>
          <div className="flex flex-wrap items-center gap-2">
            <input type="text" maxLength={12} value={newPw} placeholder="4~12자"
              onChange={(e) => setNewPw(e.target.value)}
              className="w-[200px] rounded-md border border-ink-200 px-3 py-2 text-[13px] outline-none focus:border-brand-600" />
            <button type="button" onClick={onResetPw}
              className="rounded-md border border-ink-300 bg-white px-4 py-2 text-[13px] hover:bg-ink-900 hover:text-white">
              비밀번호 변경
            </button>
            {pwMessage && (
              <p className={`text-[13px] ${pwMessage.startsWith("비밀번호를 변경") ? "text-green-600" : "text-board-tag"}`}>
                {pwMessage}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ================== 캐쉬 / 포인트 ================== */}
      <BalanceCard
        memberId={member.id}
        kind="CASH"
        total={member.cash}
        logs={logs.filter((l) => l.kind === "CASH")}
        anchorId="cash"
      />
      <BalanceCard
        memberId={member.id}
        kind="POINT"
        total={member.points}
        logs={logs.filter((l) => l.kind === "POINT")}
        anchorId="point"
      />

      {/* ================== 접속로그 (원본 query=log) ================== */}
      <section id="log" className={`${CARD} scroll-mt-20`}>
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-[15px] font-bold">접속로그</h2>
          <p className="text-[13px] text-ink-500">
            총접속 <b className="text-board-tag">{member.loginCount}</b>회
          </p>
        </div>
        <p className="mb-4 text-[12px] text-ink-400">
          접속로그는 회원이 사이트에 로그인하였을 경우에만 수집됩니다.
          {member.loginCount > loginLogs.length &&
            ` (최근 ${loginLogs.length}건 표시)`}
        </p>

        {/* 접속로그 표 — 모바일에서는 표만 가로 스크롤 */}
        <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] text-[13px]">
          <thead>
            <tr className="border-y border-ink-200 bg-ink-50 text-left text-ink-500">
              <th className="p-2.5">번호</th>
              <th className="p-2.5">접속IP</th>
              <th className="p-2.5">접속 Agent</th>
              <th className="p-2.5">접속시간</th>
            </tr>
          </thead>
          <tbody>
            {loginLogs.map((log, i) => (
              <tr key={log.id} className="border-b border-ink-100 last:border-0">
                <td className="p-2.5 text-ink-400">{member.loginCount - i}</td>
                <td className="p-2.5">{log.ip}</td>
                <td className="p-2.5" title={log.userAgent}>
                  {shortAgent(log.userAgent)}
                </td>
                <td className="p-2.5 whitespace-nowrap text-ink-400">{log.createdAt}</td>
              </tr>
            ))}
            {loginLogs.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-ink-400">
                  접속 기록이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </section>
    </div>
  );
}
