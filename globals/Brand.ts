// 브랜드 정보 글로벌. 블로그 공통(헤더/푸터/글 하단 CTA)에서 쓰는 KPSC 브랜드 정보를 관리자가 관리한다.
import type { GlobalConfig } from "payload";
import { revalidate } from "../lib/revalidate";

const linkField = (name: string, label: string) => ({
  name,
  label,
  type: "array" as const,
  labels: { singular: "링크", plural: "링크" },
  fields: [
    { name: "label", label: "이름", type: "text" as const, required: true },
    { name: "href", label: "주소", type: "text" as const, required: true },
  ],
});

export const Brand: GlobalConfig = {
  slug: "brand",
  label: "브랜드 정보",
  access: { read: () => true },
  admin: { group: "공통" },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "기본 정보",
          fields: [
            { name: "name", label: "브랜드명", type: "text", required: true, defaultValue: "KPSC" },
            { name: "nameEn", label: "영문명", type: "text", defaultValue: "KPSC" },
            { name: "homepageUrl", label: "홈페이지 주소", type: "text", defaultValue: "https://helplus.kr" },
            { name: "phone", label: "대표 전화", type: "text" },
            { name: "kakaoChannelUrl", label: "카카오톡 채널 주소", type: "text" },
            linkField("sns", "SNS 링크"),
          ],
        },
        {
          label: "글 하단 안내",
          fields: [
            { name: "ctaTitle", label: "하단 상담/문의 블록 제목", type: "text" },
            { name: "ctaText", label: "하단 상담/문의 블록 문구", type: "textarea" },
            { name: "disclaimerText", label: "글 하단 안내 문구", type: "textarea", admin: { description: "모든 글 맨 아래에 공통으로 붙는 안내문입니다." } },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [
      async ({ context }) => {
        if (!context.disableRevalidate) await revalidate(["/blog"], true);
      },
    ],
  },
};
