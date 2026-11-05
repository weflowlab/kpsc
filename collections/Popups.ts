// 메인 팝업 컬렉션. 홈페이지 첫 화면의 안내 팝업(components/home/PopupModal) 한 장이 문서 하나. 여러 개면 팝업 아래 탭으로 전환된다.
// 노출 조건: "노출" 체크 + 노출 기간 안(비우면 항상). 저장하면 메인 페이지가 다시 생성된다.
import type { CollectionConfig } from "payload";
import { revalidate } from "../lib/revalidate";

export const Popups: CollectionConfig = {
  slug: "popups",
  labels: { singular: "팝업", plural: "팝업" },
  access: { read: () => true },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "active", "startAt", "endAt", "order"],
    group: "홈페이지",
    description: "홈페이지 첫 화면에 뜨는 안내 팝업입니다.\n여러 개를 켜 두면 팝업 아래 탭으로 넘겨 볼 수 있습니다.",
  },
  defaultSort: "order",
  fields: [
    { name: "title", label: "제목 (팝업 아래 탭 이름)", type: "text", required: true },
    {
      name: "image",
      label: "팝업 이미지",
      type: "upload",
      relationTo: "media",
      required: true,
      admin: { description: "가로 1100 × 세로 500 정도의 가로형 이미지. 모바일에서는 4:3 으로 잘려 보입니다." },
    },
    { name: "link", label: "클릭 시 이동할 주소 (선택)", type: "text", admin: { description: "예: /community/notice 또는 https://… . 비우면 이미지만 보여 줍니다." } },
    {
      type: "row",
      fields: [
        { name: "active", label: "노출", type: "checkbox", defaultValue: true, admin: { width: "34%" } },
        { name: "startAt", label: "노출 시작 (선택)", type: "date", admin: { width: "33%", date: { pickerAppearance: "dayAndTime" } } },
        { name: "endAt", label: "노출 종료 (선택)", type: "date", admin: { width: "33%", date: { pickerAppearance: "dayAndTime" } } },
      ],
    },
    { name: "order", label: "탭 순서", type: "number", defaultValue: 0, admin: { position: "sidebar" } },
  ],
  hooks: {
    afterChange: [
      async ({ context }) => {
        if (!context.disableRevalidate) await revalidate(["/"]);
      },
    ],
    afterDelete: [
      async ({ context }) => {
        if (!context.disableRevalidate) await revalidate(["/"]);
      },
    ],
  },
};
