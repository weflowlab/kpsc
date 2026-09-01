/* ==========================================================================
   활성 팝업 목록 API — LayerPopup 이 마운트 후 fetch 한다.
   (루트 레이아웃에서 DB 를 읽으면 사이트 전체가 동적 렌더링이 되므로
   /api/me 와 같은 클라이언트 fetch 방식을 쓴다)
   노출 조건: startDate 당일 00:00 ~ endDate 당일 23:59 (UTC 자정 저장 기준)
   ========================================================================== */

import { prisma } from "@/lib/db";

export async function GET() {
  const now = new Date();
  try {
    const popups = await prisma.popup.findMany({
      where: {
        startDate: { lte: now },
        endDate: { gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) },
      },
      orderBy: { id: "asc" },
      select: {
        id: true,
        title: true,
        linkUrl: true,
        newWindow: true,
        hideToday: true,
        pcImage: true,
        mobImage: true,
        endDate: true,
      },
    });
    /* endDate 당일 23:59 까지 노출 — 하루를 더해 비교했으므로 재확인 */
    const active = popups.filter(
      (p) => new Date(p.endDate.getTime() + 24 * 60 * 60 * 1000) > now
    );
    return Response.json(active);
  } catch (e) {
    console.error("popups api failed:", e);
    return Response.json([]);
  }
}
