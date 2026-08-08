/* ==========================================================================
   루트 레이아웃
   모든 페이지에 공통으로 얹히는 헤더 / 모바일 슬라이더 메뉴 / 푸터 /
   우측 퀵바 / 최상단 버튼 / 레이어 팝업을 배치한다.
   폰트는 globals.css 에서 Pretendard·Playfair·Montserrat 를 로드한다.
   ========================================================================== */

import type { Metadata } from "next";
import "./globals.css";

import Header from "@/components/layout/Header";
import MobileSliderMenu from "@/components/layout/MobileSliderMenu";
import Footer from "@/components/layout/Footer";
import KakaoFloat from "@/components/layout/KakaoFloat";
import TopButton from "@/components/layout/TopButton";
import LayerPopup from "@/components/layout/LayerPopup";

/* --------------------------------------------------------------------------
   메타데이터 — 원본 <title> / og / description 값을 그대로 사용
   -------------------------------------------------------------------------- */
export const metadata: Metadata = {
  title: {
    default: "KPSC",
    template: "KPSC - %s",
  },
  description: "지속 가능한 미래 에너지 생태계를 구축하는 KPSC협동조합",
  keywords: ["에너지", "친환경에너지", "미래에너지"],
  openGraph: {
    title: "KPSC협동조합",
    description: "미래 에너지 생태계 구축",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full" data-scroll-behavior="smooth">
      <body className="flex min-h-full flex-col">
        {/* 상단 고정 헤더 (높이 64px / 1024px 이상 130px)
            투명 헤더이므로 스페이서를 두지 않는다. 각 페이지의 첫 섹션
            (히어로 · 서브 비주얼)이 헤더 아래로 깔려 배경이 그대로 비친다. */}
        <Header />

        {/* 모바일 전용 가로 슬라이더 메뉴 — 헤더 높이(70px)만큼 내려서 배치 */}
        <MobileSliderMenu />

        {/* 페이지 본문 */}
        <main className="flex-1">{children}</main>

        <Footer />

        {/* 플로팅 UI */}
        <KakaoFloat />
        <TopButton />
        <LayerPopup />
      </body>
    </html>
  );
}
