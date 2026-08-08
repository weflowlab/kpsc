/* ==========================================================================
   서브 페이지 상단 비주얼 (원본 #main_pic)
   원본 재현 포인트
   - 배경 이미지는 width:100%; height:auto — 고정 높이 없이 이미지 원본
     비율(PC 2000×545, 모바일 800×558) 그대로 노출된다. (원본 .main_pc_pic img)
   - 딤 오버레이 없음 — 원본 이미지 자체에 어두운 처리가 들어가 있다.
   - 텍스트 2줄이 정중앙(50% translate) 기준으로 헤더 높이만큼 padding-top
     보정: 85px(모바일) / 61px(768~1280) / 130px(1281~)
     · mainNaviTitle    = 현재 대메뉴명 (원본은 JS가 .p_submenu_title 에서 주입)
     · companyNaviTitle = "KPSC" (하드코딩)
   - 폰트 크기도 원본 미디어쿼리 그대로:
     · mainNaviTitle    27 / 34(481~) / 38(768~) / 45(1281~)
     · companyNaviTitle 15 / 18(481~) / 24(768~) / 22(1281~)
   - 이미지는 zoom-out, 두 텍스트는 각각 fade-left / fade-right 로 등장
   - PC/모바일 이미지 분기점은 원본과 동일한 768px
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
    <section className="relative overflow-hidden">
      {/* 배경 이미지 — 원본과 동일하게 PC/모바일 파일을 분리하고,
          고정 높이 없이 이미지 비율대로 흐르게 둔다 */}
      <Reveal type="zoom-out">
        <Image
          src={src.mobile}
          alt=""
          width={800}
          height={558}
          sizes="100vw"
          priority
          className="w-full md:hidden"
        />
        <Image
          src={src.pc}
          alt=""
          width={2000}
          height={545}
          sizes="100vw"
          priority
          className="hidden w-full md:block"
        />
      </Reveal>

      {/* 타이틀 — 원본 .sub-top-title-wrap (정중앙 + 헤더 높이 보정) */}
      {/* 타이틀은 헤더(메뉴바) 아래 영역 기준으로 가운데 오도록 pt 로 보정.
          ※ min-[1281px]: 같은 px 단위 임의 변형은 Tailwind v4 출력에서 md:(rem)
          블록보다 앞에 놓여 md 값에 덮이므로, 반드시 xl:(1280px) 를 쓴다. */}
      <div className="absolute top-1/2 left-1/2 z-10 w-full -translate-x-1/2 -translate-y-1/2 pt-[85px] text-center md:pt-[61px] xl:pt-[130px]">
        <Reveal type="fade-left">
          <h1 className="text-[27px] font-semibold text-white min-[481px]:text-[34px] md:text-[38px] xl:text-[45px]">
            {title}
          </h1>
        </Reveal>
        <Reveal type="fade-right">
          <p className="font-mont text-[15px] font-medium tracking-[0.1em] text-white/70 min-[481px]:text-[18px] md:text-[24px] xl:text-[22px]">
            KPSC
          </p>
        </Reveal>
      </div>
    </section>
  );
}
