/* ==========================================================================
   관리자 인증 가드 (서버 전용)
   세션의 회원 id 로 DB 등급을 직접 확인한다 — 쿠키 위조나 등급 강등 후에도
   안전하도록 데이터 소스에 가까운 곳에서 검사 (Next.js 공식 가이드 권장)
   ========================================================================== */

import "server-only";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

/** 관리자면 회원 정보를 반환, 아니면 로그인/홈으로 리다이렉트 */
export async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/login");

  const member = await prisma.member.findUnique({
    where: { id: session.memberId },
    select: { id: true, loginId: true, name: true, grade: true },
  });
  if (!member || member.grade !== "ADMIN") redirect("/");

  /* 관리자 페이지 이동도 활동으로 기록 (온라인 표시용) */
  prisma.member
    .update({ where: { id: member.id }, data: { lastSeenAt: new Date() } })
    .catch(() => {});

  return member;
}

/** 서버 액션용 — 리다이렉트 대신 null 반환 */
export async function checkAdmin() {
  const session = await getSession();
  if (!session) return null;
  const member = await prisma.member.findUnique({
    where: { id: session.memberId },
    select: { id: true, grade: true },
  });
  return member?.grade === "ADMIN" ? member : null;
}
