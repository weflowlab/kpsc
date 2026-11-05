// 상담 문의 컬렉션. 홈페이지 상담 신청 폼(components/clinic/contact/ConsultForm)이 서버 액션(lib/inquiry.ts)으로 만든다.
// 관리자는 목록에서 상태(접수/연락 완료)와 메모를 관리한다. 외부에서 REST API 로 만들거나 읽을 수는 없다 (스팸·개인정보 보호).
import type { CollectionConfig } from "payload";

export const Inquiries: CollectionConfig = {
  slug: "inquiries",
  labels: { singular: "상담 문의", plural: "상담 문의" },
  access: {
    read: ({ req }) => !!req.user,
    create: () => false, // 서버 액션(Local API)만 생성
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "phone", "subjects", "status", "createdAt"],
    group: "홈페이지",
    description: "홈페이지 '상담 신청하기' 로 들어온 문의입니다.\n연락 후 상태를 바꿔 두면 목록에서 구분됩니다.",
    listSearchableFields: ["name", "phone", "message"],
    pagination: { defaultLimit: 20 },
  },
  defaultSort: "-createdAt",
  fields: [
    {
      type: "row",
      fields: [
        { name: "name", label: "이름", type: "text", required: true, admin: { width: "50%" } },
        { name: "phone", label: "연락처", type: "text", required: true, admin: { width: "50%" } },
      ],
    },
    {
      name: "subjects",
      label: "진료 분야",
      type: "array",
      labels: { singular: "분야", plural: "분야" },
      fields: [{ name: "value", label: "분야", type: "text", required: true }],
    },
    { name: "message", label: "문의 내용", type: "textarea" },
    {
      name: "status",
      label: "처리 상태",
      type: "select",
      defaultValue: "new",
      required: true,
      options: [
        { label: "접수", value: "new" },
        { label: "연락 완료", value: "done" },
      ],
      admin: { position: "sidebar" },
    },
    { name: "memo", label: "담당자 메모", type: "textarea", admin: { position: "sidebar", description: "통화 내용, 예약 일정 등" } },
    { name: "agreedAt", label: "개인정보 동의 시각", type: "date", admin: { position: "sidebar", readOnly: true, date: { pickerAppearance: "dayAndTime" } } },
    { name: "page", label: "신청한 페이지", type: "text", admin: { position: "sidebar", readOnly: true } },
  ],
};
