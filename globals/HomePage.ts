// 블로그 메인(/blog) 글로벌. 히어로 문구, 배너, 작성자 소개, 소개·요약, FAQ 를 관리자가 직접 수정한다.
import type { GlobalConfig } from "payload";
import { revalidate } from "../lib/revalidate";

const BREAK_HINT = '"|" 는 모바일에서만 줄바꿈, Enter 는 모든 화면에서 줄바꿈';

export const HomePage: GlobalConfig = {
  slug: "home",
  label: "블로그 메인",
  access: { read: () => true },
  admin: { group: "블로그" },
  versions: { drafts: { autosave: { interval: 500 } } },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "히어로·배너",
          fields: [
            {
              type: "collapsible",
              label: "메인페이지 상단",
              admin: { initCollapsed: false },
              fields: [
                { name: "heroTitle", label: "제목", type: "textarea" },
                { name: "heroText", label: "문구", type: "textarea" },
                { name: "searchPlaceholder", label: "검색창 안내 문구", type: "text" },
                {
                  name: "popularKeywords",
                  label: "인기 검색어",
                  type: "array",
                  labels: { singular: "키워드", plural: "키워드" },
                  fields: [{ name: "value", label: "키워드", type: "text", required: true }],
                },
              ],
            },
            {
              name: "banners",
              label: "배너 슬라이드",
              type: "array",
              labels: { singular: "배너", plural: "배너" },
              fields: [
                { name: "image", label: "데스크톱 이미지 (1920×920)", type: "upload", relationTo: "media" },
                {
                  name: "mobileImage",
                  label: "모바일 이미지 (4:5, 예 800×1000)",
                  type: "upload",
                  relationTo: "media",
                  admin: { description: "비우면 데스크톱 이미지를 씁니다. 더 긴 이미지는 위쪽을 남기고 아래가 잘립니다." },
                },
                { name: "label", label: "작은 제목", type: "text" },
                { name: "text", label: "문구", type: "textarea", admin: { description: BREAK_HINT } },
              ],
            },
          ],
        },
        {
          label: "작성자 소개",
          fields: [
            { name: "authorsShow", label: "메인 페이지에 작성자 소개 섹션 표시", type: "checkbox", defaultValue: true },
            {
              type: "collapsible",
              label: "왼쪽 문구 (오른쪽 작성자 카드는 '작성자' 메뉴에서 관리)",
              admin: { initCollapsed: false },
              fields: [
                { name: "authorsTitle", label: "제목", type: "text", admin: { description: "비우면 제목이 나오지 않습니다" } },
                { name: "authorsText", label: "문구", type: "textarea", admin: { description: BREAK_HINT } },
                { name: "authorsButton", label: "버튼 글자", type: "text", admin: { description: "비우면 버튼이 나오지 않습니다" } },
                { name: "authorsLink", label: "버튼 링크", type: "text", admin: { description: "비우면 홈페이지 첫 화면으로 연결됩니다" } },
              ],
            },
          ],
        },
        {
          label: "소개·요약",
          fields: [
            {
              type: "collapsible",
              label: "ABOUT KPSC",
              admin: { initCollapsed: false },
              fields: [
                { name: "summaryTitle", label: "제목", type: "text", admin: { description: BREAK_HINT } },
                { name: "summaryText", label: "문단", type: "textarea", admin: { description: BREAK_HINT } },
              ],
            },
            {
              name: "keyPoints",
              label: "KPSC 블로그의 장점 (최대 4개)",
              type: "array",
              labels: { singular: "카드", plural: "카드" },
              maxRows: 4,
              fields: [
                { name: "title", label: "제목", type: "text" },
                { name: "value", label: "내용", type: "textarea", required: true },
              ],
            },
          ],
        },
        {
          label: "FAQ",
          fields: [
            {
              name: "faq",
              label: "자주 묻는 질문",
              type: "array",
              labels: { singular: "질문", plural: "질문" },
              fields: [
                { name: "question", label: "질문", type: "text", required: true },
                { name: "answer", label: "답변", type: "textarea", required: true },
              ],
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [
      async ({ context }) => {
        if (!context.disableRevalidate) await revalidate(["/blog"]);
      },
    ],
  },
};
