/* ==========================================================================
   메인(홈) 페이지
   원본 helplus.kr 의 DOM 순서를 그대로 따른다.
     히어로 → PARTNERS 4카드 → 벤토 배너 2카드 → 고객지원 센터
   ========================================================================== */

import Hero from "@/components/main/Hero";
import PartnersSection from "@/components/main/PartnersSection";
import BannerSection from "@/components/main/BannerSection";
import CsSection from "@/components/main/CsSection";

export default function Home() {
  return (
    <>
      <Hero />
      <PartnersSection />
      <BannerSection />
      <CsSection />
    </>
  );
}
