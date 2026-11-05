/* ==========================================================================
   현재 로그인 회원 조회 API — 헤더가 마운트 후 fetch 해서 유틸 메뉴를
   전환하는 데 쓴다. (루트 레이아웃에서 cookies() 를 읽으면 사이트 전체가
   동적 렌더링이 되므로, 정적 페이지를 유지하기 위해 클라이언트 fetch 방식)
   ========================================================================== */

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();

  /* 마지막 활동 시각 갱신 — 관리자 회원목록의 온라인(노란 점) 표시용.
     실패해도 응답에는 영향 없도록 조용히 무시 */
  if (session) {
    prisma.member
      .update({
        where: { id: session.memberId },
        data: { lastSeenAt: new Date() },
      })
      .catch(() => {});
  }

  return Response.json(session ? { name: session.name } : null);
}
