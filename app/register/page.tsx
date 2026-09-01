/* ==========================================================================
   회원가입  (원본 /regis.php)
   약관/개인정보 전문을 DB(site_settings — 관리자 환경설정에서 편집)에서
   읽어 폼 컴포넌트에 넘긴다. 폼 본체는 components/auth/RegisterForm.tsx
   ========================================================================== */

import type { Metadata } from "next";
import RegisterForm from "@/components/auth/RegisterForm";
import { prisma } from "@/lib/db";
import { PRIVACY_POLICY, TERMS_OF_SERVICE } from "@/lib/content/terms";

export const metadata: Metadata = { title: "회원가입" };

export default async function RegisterPage() {
  /* DB 값이 없으면 정적 전달본으로 폴백 */
  let terms = TERMS_OF_SERVICE;
  let privacy = PRIVACY_POLICY;
  try {
    const settings = await prisma.siteSetting.findMany({
      where: { key: { in: ["terms", "privacy"] } },
    });
    terms = settings.find((s) => s.key === "terms")?.value ?? terms;
    privacy = settings.find((s) => s.key === "privacy")?.value ?? privacy;
  } catch {}

  return <RegisterForm termsText={terms} privacyText={privacy} />;
}
