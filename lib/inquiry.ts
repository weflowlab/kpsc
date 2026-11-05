"use server";
// 상담 신청 서버 액션. 홈페이지 폼(components/clinic/contact/ConsultForm, 퀵메뉴 상담 신청 창)이 호출해
// Payload '상담 문의'(collections/Inquiries) 문서를 만든다. 관리자 /admin → 홈페이지 → 상담 문의 에서 확인한다.
import { getPayload } from "payload";
import config from "@payload-config";

export type InquiryInput = {
  name: string;
  phone: string;
  subjects: string[];
  message?: string;
  /** 신청한 페이지 경로 (어디서 들어온 문의인지) */
  page?: string;
};

export type InquiryResult = { ok: true } | { ok: false; error: string };

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function submitInquiry(input: InquiryInput): Promise<InquiryResult> {
  const name = clean(input.name, 40);
  const phone = clean(input.phone, 30).replace(/[^\d-+]/g, "");
  const message = clean(input.message, 2000);
  const subjects = Array.isArray(input.subjects) ? input.subjects.map((s) => clean(s, 60)).filter(Boolean).slice(0, 10) : [];
  if (!name || !phone) return { ok: false, error: "이름과 연락처를 입력해 주세요." };

  try {
    const payload = await getPayload({ config });
    await payload.create({
      collection: "inquiries",
      data: {
        name,
        phone,
        message,
        subjects: subjects.map((value) => ({ value })),
        status: "new",
        agreedAt: new Date().toISOString(),
        page: clean(input.page, 200),
      },
    });
    return { ok: true };
  } catch (e) {
    console.error("[상담 신청 저장 실패]", e);
    return { ok: false, error: "접수 중 문제가 생겼습니다. 잠시 후 다시 시도하거나 전화로 문의해 주세요." };
  }
}
