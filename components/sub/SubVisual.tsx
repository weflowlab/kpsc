/* ==========================================================================
   서브 페이지 상단 비주얼 (원본 #main_pic)
   원본 재현 포인트
   - 배경 이미지 위 정중앙에 텍스트 2줄
     · mainNaviTitle    = 현재 대메뉴명 (원본은 JS가 .p_submenu_title 에서 주입)
     · companyNaviTitle = "KPSC" (하드코딩)
   - 이미지는 zoom-out, 두 텍스트는 각각 fade-left / fade-right 로 등장
   - 투명 헤더가 이 배너 위로 겹쳐지므로, 타이틀은 헤더 높이만큼 내려서
     보이는 영역의 가운데에 오도록 보정한다.
   - 투명 헤더가 이 배너 위로 겹쳐지므로, 타이틀은 헤더 높이만큼
     아래로 내려 가운데 정렬한다.
   - 원본은 일부 페이지에만 이 배너가 있었으나, 여기서는 모든 서브 페이지에
     동일하게 적용해 일관성을 맞췄다.
   ========================================================================== */

import Image from "next/image";
import Reveal from "@/components/common/Reveal";
import { SUB_BANNERS, type SubBannerKey } from "@/lib/images";

type SubVisualProps = {
  /** 대메뉴명 — 배너 큰 제목 */
  title: string;
  /** 사용할 배너 이미지 세트 (대메뉴 그룹별) */
  banner: SubBannerKey;
};

export default function SubVisual({ title, banner }: SubVisualProps) {
  const src = SUB_BANNERS[banner];
  return (
    <section className="relative h-[220px] overflow-hidden md:h-[360px] lg:h-[440px]">
      {/* 배경 이미지 — 원본과 동일하게 PC/모바일 파일을 분리해서 쓴다 */}
      <Reveal type="zoom-out" className="absolute inset-0">
        <Image
          src={src.mobile}
          alt=""
          fill
          sizes="100vw"
          priority
          className="object-cover md:hidden"
        />
        <Image
          src={src.pc}
          alt=""
          fill
          sizes="100vw"
          priority
          className="hidden object-cover md:block"
        />
      </Reveal>

      {/* 딤 오버레이 */}
      <div aria-hidden className="absolute inset-0 bg-black/45" />

      {/* 타이틀 */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-2 md:pt-[64px] lg:pt-[130px]">
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
