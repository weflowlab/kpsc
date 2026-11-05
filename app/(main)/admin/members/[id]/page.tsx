/* ==========================================================================
   관리자 > 회원관리 > 회원 상세  (원본 module/Member/member.php 리뉴얼)
   - 개인정보 편집: 실명/닉네임/등급/이메일/휴대폰/공지메일/비밀번호 재지정
   - 캐쉬·포인트: 지급(환급) 폼 + 근거자료 내역 목록(삭제 시 잔액 되돌림)
   ========================================================================== */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/db";
import MemberDetail from "@/components/admin/MemberDetail";
import { kstDate, kstDateTime } from "@/lib/datetime";

export const metadata: Metadata = { title: "회원정보" };

export default async function AdminMemberDetailPage(
  props: PageProps<"/admin/members/[id]">
) {
  const admin = await requireAdmin();
  const { id } = await props.params;

  const member = await prisma.member.findUnique({
    where: { id: Number(id) || 0 },
    include: {
      balanceLogs: { orderBy: { id: "desc" } },
      loginLogs: { orderBy: { id: "desc" }, take: 100 },
      _count: { select: { posts: true, comments: true, loginLogs: true } },
    },
  });
  if (!member) notFound();

  const fmtDate = kstDateTime;

  return (
    <div>
      <h1 className="mb-5 text-[20px] font-bold">
        <Link href="/admin/members" className="text-ink-400 hover:text-brand-600">
          회원관리
        </Link>{" "}
        <span className="text-ink-300">/</span> {member.name}
        <span className="ml-1 text-[15px] font-normal text-ink-500">
          ({member.loginId}) 님의 회원정보
        </span>
      </h1>

      <MemberDetail
        isSelf={member.id === admin.id}
        member={{
          id: member.id,
          loginId: member.loginId,
          name: member.name,
          nickname: member.nickname ?? "",
          email: member.email,
          phone: member.phone,
          remail: member.remail,
          grade: member.grade,
          memberType: member.memberType,
          status: member.status,
          points: member.points,
          cash: member.cash,
          createdAt: kstDate(member.createdAt),
          postCount: member._count.posts,
          commentCount: member._count.comments,
          loginCount: member._count.loginLogs,
          /* 마지막 접속일시 — 접속로그 최신 1건 (원본 상세 상단 표기) */
          lastLoginAt: member.loginLogs[0]
            ? fmtDate(member.loginLogs[0].createdAt)
            : null,
          /* 온라인 판정 — 최근 5분 내 활동 */
          online:
            member.lastSeenAt !== null &&
            member.lastSeenAt.getTime() > Date.now() - 5 * 60 * 1000,
        }}
        logs={member.balanceLogs.map((l) => ({
          id: l.id,
          kind: l.kind,
          amount: l.amount,
          reason: l.reason,
          createdAt: fmtDate(l.createdAt),
        }))}
        loginLogs={member.loginLogs.map((l) => ({
          id: l.id,
          ip: l.ip,
          userAgent: l.userAgent,
          createdAt: fmtDate(l.createdAt),
        }))}
      />
    </div>
  );
}
