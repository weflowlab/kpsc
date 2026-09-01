/* ==========================================================================
   관리자 > 회원관리  (원본 mbr_manager.php 리뉴얼)
   목록: 실명 / ID / 등급 / 연락처 / 이메일 / 포인트 / 캐쉬 / 가입일
   기능: 검색, 등급 변경, 선택 회원 삭제(탈퇴) / 캐쉬지급 / 포인트지급
   ========================================================================== */

import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/db";
import MembersTable from "@/components/admin/MembersTable";
import { kstDate } from "@/lib/datetime";

export const metadata: Metadata = { title: "회원관리" };

export default async function AdminMembersPage(
  props: PageProps<"/admin/members">
) {
  const admin = await requireAdmin();
  const search = await props.searchParams;
  const q = typeof search?.q === "string" ? search.q.trim() : "";

  const members = await prisma.member.findMany({
    where: q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { loginId: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
            { phone: { contains: q } },
          ],
        }
      : {},
    /* 가입일 최신순 (이관 회원은 DB 등록순서와 가입일이 달라 id 로 정렬하면
       순서가 어긋난다). 같은 날짜끼리는 구 관리자 목록 순서 유지(id 오름차순) */
    orderBy: [{ createdAt: "desc" }, { id: "asc" }],
    select: {
      id: true,
      loginId: true,
      name: true,
      nickname: true,
      email: true,
      phone: true,
      grade: true,
      status: true,
      points: true,
      cash: true,
      lastSeenAt: true,
      createdAt: true,
      _count: { select: { loginLogs: true } },
    },
  });

  /* 온라인 판정 — 최근 5분 내 활동이 있으면 접속 중으로 본다 */
  const onlineSince = Date.now() - 5 * 60 * 1000;

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-[20px] font-bold">
          회원관리 <span className="text-[14px] font-normal text-ink-500">전체 {members.length}명</span>
        </h1>

        {/* 검색 — 원본 Quick Member 검색 대응 */}
        <form className="flex gap-2" action="/admin/members">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="이름 / 아이디 / 이메일 / 연락처"
            className="h-9 w-[240px] rounded-md border border-ink-200 bg-white px-3 text-[13px] outline-none focus:border-brand-600"
          />
          <button
            type="submit"
            className="h-9 rounded-md bg-ink-900 px-4 text-[13px] text-white hover:bg-brand-600"
          >
            검색
          </button>
        </form>
      </div>

      <MembersTable
        myId={admin.id}
        members={members.map(({ _count, lastSeenAt, ...m }) => ({
          ...m,
          logins: _count.loginLogs,
          online: lastSeenAt !== null && lastSeenAt.getTime() > onlineSince,
          createdAt: kstDate(m.createdAt),
        }))}
      />
    </div>
  );
}
