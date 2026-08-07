/* ==========================================================================
   서브 페이지 상단 비주얼 (원본 #main_pic)
   원본 재현 포인트
   - 배경 이미지 위 정중앙에 텍스트 2줄
     · mainNaviTitle    = 현재 대메뉴명 (원본은 JS가 .p_submenu_title 에서 주입)
     · companyNaviTitle = "KPSC" (하드코딩)
   - 이미지는 zoom-out, 두 텍스트는 각각 fade-left / fade-right 로 등장
   - 원본은 일부 페이지에만 이 배너가 있었으나, 여기서는 모든 서브 페이지에
     동일하게 적용해 일관성을 맞췄다.
   ========================================================================== */

import Placeholder from "@/components/common/Placeholder";
import Reveal from "@/components/common/Reveal";

type SubVisualProps = {
  /** 대메뉴명 — 배너 큰 제목 */
  title: string;
  /** 배경 이미지 플레이스홀더 설명 */
  placeholder: string;
};

export default function SubVisual({ title, placeholder }: SubVisualProps) {
  return (
    <section className="relative h-[220px] overflow-hidden md:h-[300px] lg:h-[360px]">
      {/* 배경 이미지 자리 */}
      <Reveal type="zoom-out" className="absolute inset-0">
        <Placeholder label={placeholder} dark className="bg-ink-800" />
      </Reveal>

      {/* 딤 오버레이 */}
      <div aria-hidden className="absolute inset-0 bg-black/45" />

      {/* 타이틀 */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-2">
        <Reveal type="fade-left">
          <h1 className="text-[27px] font-semibold text-white md:text-[34px] lg:text-[45px]">
            {title}
          </h1>
        </Reveal>
        <Reveal type="fade-right">
          <p className="font-mont text-[15px] tracking-[0.1em] text-white/70 md:text-[18px] lg:text-[22px]">
            KPSC
          </p>
        </Reveal>
      </div>
    </section>
  );
}
