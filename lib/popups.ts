// 메인 팝업 조회 (서버 컴포넌트 전용). 관리자 '홈페이지 → 팝업' 중 노출 조건에 맞는 것만 순서대로.
import "server-only";
import { getPayload } from "payload";
import config from "@payload-config";
import { mediaUrl } from "./mediaUrl";

export type PopupItem = {
  id: number;
  title: string;
  image: { url: string; alt: string; width?: number; height?: number };
  link?: string;
};

export async function getPopups(): Promise<PopupItem[]> {
  const payload = await getPayload({ config });
  const now = new Date().toISOString();
  const { docs } = await payload.find({
    collection: "popups",
    where: {
      and: [
        { active: { equals: true } },
        { or: [{ startAt: { exists: false } }, { startAt: { less_than_equal: now } }] },
        { or: [{ endAt: { exists: false } }, { endAt: { greater_than_equal: now } }] },
      ],
    },
    sort: "order",
    limit: 10,
    depth: 1,
  });
  return docs.flatMap((d) => {
    const m = d.image;
    if (!m || typeof m !== "object" || !m.url) return []; // 이미지가 지워진 팝업은 건너뛴다
    return [{ id: d.id, title: d.title, image: { url: mediaUrl(m.url), alt: m.alt ?? d.title, width: m.width ?? undefined, height: m.height ?? undefined }, link: d.link || undefined }];
  });
}
