// 글 하단 문의 블록. 안내 상자 아래에 배치.
// 자체 디자인: 연한 파랑 배경 카드, 가운데 정렬 세로 구성 — 제목 → 안내 문구 → 버튼 2개(문의하기 / 홈페이지 바로가기).
// 문구는 lib/clinicDefaults.ts (CTA_TITLE, ctaText).
import Link from "next/link";
import { IconArrowUpRight, IconMessageCircle } from "@tabler/icons-react";
import { getClinic } from "@/lib/payload";
import { SITE } from "@/lib/site";
import { MobileBreaks } from "@/components/blog/ui/MobileBreaks";
import { CTA_TITLE as DEFAULT_TITLE, ctaText as defaultText } from "@/lib/clinicDefaults";

export const CTA_SECTION_ID = "cta";

type Props = { className?: string };

export async function PostCta({ className = "" }: Props) {
  const clinic = await getClinic();
  const title = clinic.ctaTitle || DEFAULT_TITLE;
  const text = clinic.ctaText || defaultText(clinic.name);

  return (
    <div className={`mt-10 rounded-[11px] border border-[var(--brand-primary-20)] bg-[var(--brand-primary-5)] px-6 py-8 text-center md:px-8 md:py-10 ${className}`}>
      <h2 id={CTA_SECTION_ID} className="m-0! text-xl font-bold leading-snug text-foreground md:text-2xl">
        {title}
      </h2>
      <p className="m-0! mt-3! whitespace-pre-line text-[15px] leading-relaxed text-neutral-600 md:text-base">
        <MobileBreaks text={text} />
      </p>

      {/* 버튼: 문의하기(카카오채널, 새 창) / 홈페이지 바로가기(테두리). 모바일도 가로 배치 (글씨 작게) */}
      <div className="mt-6 flex flex-row justify-center gap-2.5">
        <a
          href={SITE.openChatUrl || SITE.kakaoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-[11px] bg-primary px-3 text-sm font-semibold text-white no-underline! transition-colors hover:bg-brand-secondary sm:h-12 sm:flex-none sm:px-6 sm:text-base"
        >
          <IconMessageCircle className="size-5" />
          문의하기
        </a>
        <Link
          href={clinic.homepageUrl}
          className="inline-flex h-11 flex-1 items-center justify-center gap-1 whitespace-nowrap rounded-[11px] border border-primary bg-white px-3 text-sm font-semibold text-primary no-underline! transition-colors hover:bg-primary hover:text-white sm:h-12 sm:flex-none sm:px-6 sm:text-base"
        >
          홈페이지 바로가기
          <IconArrowUpRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
