/* ==========================================================================
   관리자 > 환경설정  (원본 cfg_root.php / cfg_member.php 리뉴얼)
   - 회원가입 약관 / 개인정보 보호정책 텍스트 편집 (회원가입 페이지에 반영)
   - 관리자 비밀번호 변경
   ========================================================================== */

import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/db";
import SettingsForms from "@/components/admin/SettingsForms";

export const metadata: Metadata = { title: "환경설정" };

export default async function AdminSettingsPage() {
  await requireAdmin();

  const settings = await prisma.siteSetting.findMany({
    where: { key: { in: ["terms", "privacy"] } },
  });
  const get = (key: string) => settings.find((s) => s.key === key)?.value ?? "";

  return (
    <div>
      <h1 className="mb-2 text-[20px] font-bold">환경설정</h1>
      <p className="mb-5 text-[13px] text-ink-500">
        회원관리에 대한 기본적인 설정값을 등록합니다. 약관/보호정책은 회원가입
        페이지의 [보기] 팝업에 바로 반영됩니다.
      </p>

      <SettingsForms terms={get("terms")} privacy={get("privacy")} />
    </div>
  );
}
