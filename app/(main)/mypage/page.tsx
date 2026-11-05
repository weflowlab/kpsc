/* ==========================================================================
   마이페이지  (원본 /mypage.php)
   - ?query=desk : 마이데스크 — 회원정보 요약 + 회원공지 (기본)
   - ?query=info : 회원정보조회/수정 — 비밀번호/이메일/휴대폰 수정
   상단 셀렉트로 두 화면을 전환한다 (원본 마이페이지 메뉴 그대로)
   ========================================================================== */

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import MyPageView from "@/components/auth/MyPageView";
import { kstDateDot } from "@/lib/datetime";

export const metadata: Metadata = { title: "마이페이지" };

export default async function MyPage(props: PageProps<"/mypage">) {
  const session = await getSession();
  if (!session) redirect("/login");

  const member = await prisma.member.findUnique({
    where: { id: session.memberId },
    select: {
      loginId: true,
      name: true,
      email: true,
      phone: true,
      remail: true,
      grade: true,
    },
  });
  if (!member) redirect("/login");

  const search = await props.searchParams;
  const view = search?.query === "info" ? ("info" as const) : ("desk" as const);

  /* 회원공지 — 공지사항 최신 3건 (원본 마이데스크의 회원공지 박스) */
  const notices = await prisma.post.findMany({
    where: { boardKey: "notice" },
    orderBy: { id: "desc" },
    take: 3,
    select: { id: true, title: true, createdAt: true },
  });

  return (
    <MyPageView
      view={view}
      member={member}
      notices={notices.map((n) => ({
        id: n.id,
        title: n.title,
        date: kstDateDot(n.createdAt),
      }))}
    />
  );
}
