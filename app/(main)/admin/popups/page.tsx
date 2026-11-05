/* ==========================================================================
   관리자 > 팝업창  (원본 add_popup.php 이벤트윈도우 관리 리뉴얼)
   등록 폼(타이틀/기간/URL/오늘닫기/PC·모바일 이미지) + 등록된 팝업 목록
   ========================================================================== */

import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/db";
import PopupManager from "@/components/admin/PopupManager";
import { kstDate, kstToday } from "@/lib/datetime";

export const metadata: Metadata = { title: "팝업창" };

export default async function AdminPopupsPage() {
  await requireAdmin();

  const popups = await prisma.popup.findMany({ orderBy: { id: "desc" } });
  const today = kstToday();

  return (
    <div>
      <h1 className="mb-2 text-[20px] font-bold">팝업창 관리</h1>
      <p className="mb-5 text-[13px] text-ink-500">
        이벤트창을 관리합니다. 종료일이 경과되면 팝업이 자동으로 내려갑니다.
      </p>

      <PopupManager
        today={today}
        popups={popups.map((p) => ({
          id: p.id,
          title: p.title,
          start: kstDate(p.startDate),
          end: kstDate(p.endDate),
          linkUrl: p.linkUrl,
          newWindow: p.newWindow,
          hideToday: p.hideToday,
          pcImage: p.pcImage,
          mobImage: p.mobImage,
        }))}
      />
    </div>
  );
}
