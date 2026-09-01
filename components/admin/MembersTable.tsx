"use client";

/* ==========================================================================
   관리자 > 회원관리 테이블
   - 등급 셀렉트: 바꾸는 즉시 저장
   - 체크박스 선택 후 하단 액션: 삭제(탈퇴) / 캐쉬지급 / 포인트지급
     (원본 mbr_manager.php 하단 버튼 재현)
   ========================================================================== */

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  updateMemberGrade,
  giveMemberBalance,
  deleteMembers,
} from "@/app/actions/admin";

type MemberRow = {
  id: number;
  loginId: string;
  name: string;
  nickname: string | null;
  email: string;
  phone: string;
  grade: string;
  status: string;
  points: number;
  cash: number;
  logins: number;
  online: boolean;
  createdAt: string;
};

/* 원본 회원그룹 표기 */
const GRADE_LABELS: Record<string, string> = {
  NORMAL: "[1]일반회원",
  VIP: "[2]VIP 등급",
  VVIP: "[3]VVIP 등급",
  ADMIN: "[4]최고 관리자 등급",
};

const fmt = (n: number) => n.toLocaleString("ko-KR");

export default function MembersTable({
  members,
  myId,
}: {
  members: MemberRow[];
  myId: number;
}) {
  const router = useRouter();
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [busy, setBusy] = useState(false);

  const toggle = (id: number) => {
    const next = new Set(checked);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setChecked(next);
  };

  /* 회원 상세 — 원본 관리자처럼 별도 팝업 창으로 연다 */
  const openDetail = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    window.open(
      path,
      "kpsc-member-detail",
      "width=1120,height=840,scrollbars=yes,resizable=yes"
    );
  };

  const onGradeChange = async (memberId: number, grade: string) => {
    const res = await updateMemberGrade({ memberId, grade });
    if (!res.ok) alert(res.error);
    router.refresh();
  };

  const onGive = async (field: "points" | "cash") => {
    if (checked.size === 0) return alert("대상 회원을 선택해 주세요.");
    const label = field === "points" ? "포인트" : "캐쉬";
    const input = prompt(`지급할 ${label} 금액을 입력하세요. (음수 입력 시 차감)`);
    if (input === null) return;
    const amount = Number(input);
    if (!Number.isInteger(amount) || amount === 0)
      return alert("0이 아닌 정수를 입력해 주세요.");
    const reason = prompt("근거자료를 입력하세요. (내역에 기록됩니다)") ?? "";

    setBusy(true);
    const res = await giveMemberBalance({
      memberIds: [...checked],
      field,
      amount,
      reason,
    });
    setBusy(false);
    if (!res.ok) return alert(res.error);
    setChecked(new Set());
    router.refresh();
  };

  const onDelete = async () => {
    if (checked.size === 0) return alert("대상 회원을 선택해 주세요.");
    if (!confirm(`선택한 ${checked.size}명을 탈퇴 처리하시겠습니까?\n(작성한 글은 남고 계정만 삭제됩니다)`))
      return;
    setBusy(true);
    const res = await deleteMembers([...checked]);
    setBusy(false);
    if (!res.ok) return alert(res.error);
    setChecked(new Set());
    router.refresh();
  };

  return (
    <div className="overflow-hidden rounded-lg border border-ink-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-[13px]">
          <thead>
            <tr className="border-b border-ink-200 bg-ink-50 text-left text-ink-500">
              <th className="w-10 p-3 text-center">
                <input
                  type="checkbox"
                  aria-label="전체 선택"
                  checked={checked.size === members.length && members.length > 0}
                  onChange={(e) =>
                    setChecked(
                      e.target.checked ? new Set(members.map((m) => m.id)) : new Set()
                    )
                  }
                />
              </th>
              <th className="p-3">번호</th>
              <th className="p-3">실명</th>
              <th className="p-3">ID</th>
              <th className="p-3">닉네임</th>
              <th className="p-3">회원등급</th>
              <th className="p-3">연락처</th>
              <th className="p-3">이메일</th>
              <th className="p-3 text-center">접속</th>
              <th className="p-3 text-right">적립(캐쉬)</th>
              <th className="p-3 text-right">포인트</th>
              <th className="p-3 text-center">상태</th>
              <th className="p-3">가입일</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m, i) => (
              <tr key={m.id} className="border-b border-ink-100 last:border-0 hover:bg-ink-50/50">
                <td className="p-3 text-center">
                  <input
                    type="checkbox"
                    aria-label={`${m.name} 선택`}
                    checked={checked.has(m.id)}
                    onChange={() => toggle(m.id)}
                  />
                </td>
                {/* 번호 = 가입 순번 (첫 가입자가 1번, 최신이 가장 큰 번호) */}
                <td className="p-3 text-ink-400">{members.length - i}</td>
                <td className="p-3 font-semibold">
                  {/* 온라인 점 + 실명 — flex 로 세로 중앙을 맞추고,
                      긴 이름(KPSC운영관리단)이 줄바꿈되지 않게 한다 */}
                  <div className="flex items-center gap-1.5 whitespace-nowrap">
                    <span
                      aria-label={m.online ? "접속 중" : "오프라인"}
                      title={m.online ? "접속 중" : "오프라인"}
                      className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                        m.online
                          ? "bg-yellow-400 shadow-[0_0_4px_1px_rgba(250,204,21,0.7)]"
                          : "bg-ink-200"
                      }`}
                    />
                    {m.name}
                    {m.id === myId && (
                      <span className="rounded bg-brand-600/10 px-1 text-[11px] text-brand-600">나</span>
                    )}
                  </div>
                </td>
                <td className="p-3">
                  {/* 원본처럼 ID 를 누르면 회원 상세 팝업 창이 뜬다 */}
                  <a
                    href={`/admin/members/${m.id}`}
                    onClick={(e) => openDetail(e, `/admin/members/${m.id}`)}
                    className="font-medium text-brand-600 underline-offset-2 hover:underline"
                  >
                    {m.loginId}
                  </a>
                </td>
                <td className="p-3">{m.nickname ?? m.name}</td>
                <td className="p-3">
                  <select
                    aria-label={`${m.name} 등급`}
                    value={m.grade}
                    onChange={(e) => onGradeChange(m.id, e.target.value)}
                    className="rounded border border-ink-200 bg-white px-1.5 py-1 text-[12px] outline-none"
                  >
                    {Object.entries(GRADE_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-3 whitespace-nowrap">{m.phone}</td>
                <td className="max-w-[180px] truncate p-3">
                  {/* 원본 ✉️ 아이콘 대응 — 클릭하면 메일 앱에서 바로 작성 */}
                  <a
                    href={`mailto:${m.email}`}
                    title={`${m.name}님에게 메일 보내기`}
                    className="hover:text-brand-600 hover:underline"
                  >
                    {m.email}
                  </a>
                </td>
                {/* 접속/캐쉬/포인트 — 누르면 상세 팝업이 해당 섹션 위치로 열린다 */}
                <td className="p-3 text-center">
                  <a
                    href={`/admin/members/${m.id}#log`}
                    onClick={(e) => openDetail(e, `/admin/members/${m.id}#log`)}
                    className="text-brand-600 underline-offset-2 hover:underline"
                  >
                    {m.logins}
                  </a>
                </td>
                <td className="p-3 text-right">
                  <a
                    href={`/admin/members/${m.id}#cash`}
                    onClick={(e) => openDetail(e, `/admin/members/${m.id}#cash`)}
                    className="text-brand-600 underline-offset-2 hover:underline"
                  >
                    {fmt(m.cash)}
                  </a>
                </td>
                <td className="p-3 text-right">
                  <a
                    href={`/admin/members/${m.id}#point`}
                    onClick={(e) => openDetail(e, `/admin/members/${m.id}#point`)}
                    className="text-brand-600 underline-offset-2 hover:underline"
                  >
                    {fmt(m.points)}
                  </a>
                </td>
                <td className="p-3 text-center">
                  {m.status === "APPROVED" ? (
                    "승인"
                  ) : (
                    <span className="rounded bg-board-tag/10 px-1.5 py-0.5 text-[12px] text-board-tag">
                      대기
                    </span>
                  )}
                </td>
                <td className="p-3 whitespace-nowrap text-ink-400">{m.createdAt}</td>
              </tr>
            ))}
            {members.length === 0 && (
              <tr>
                <td colSpan={13} className="p-10 text-center text-ink-400">
                  회원이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 하단 액션 바 — 원본 삭제(탈퇴)/캐쉬지급/포인트지급 */}
      <div className="flex items-center gap-2 border-t border-ink-200 bg-ink-50 p-3 text-[13px]">
        <span className="mr-2 text-ink-500">선택 {checked.size}명 →</span>
        <button
          type="button"
          onClick={onDelete}
          disabled={busy}
          className="rounded-md border border-board-tag px-3 py-1.5 text-board-tag hover:bg-board-tag hover:text-white disabled:opacity-50"
        >
          삭제(탈퇴)
        </button>
        <button
          type="button"
          onClick={() => onGive("cash")}
          disabled={busy}
          className="rounded-md border border-ink-300 bg-white px-3 py-1.5 hover:bg-ink-900 hover:text-white disabled:opacity-50"
        >
          캐쉬지급
        </button>
        <button
          type="button"
          onClick={() => onGive("points")}
          disabled={busy}
          className="rounded-md border border-ink-300 bg-white px-3 py-1.5 hover:bg-ink-900 hover:text-white disabled:opacity-50"
        >
          포인트지급
        </button>
      </div>
    </div>
  );
}
