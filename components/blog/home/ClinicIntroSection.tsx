"use client";
// 메인 페이지 배너 슬라이드 + 병원 소개 오버레이 (영문 라벨 + 문구 + About 버튼).
// 레퍼런스: 히어로 아래 swiper 배너 섹션. 배너 이미지 위에 텍스트가 absolute 로 올라간다.
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { IconArrowRight } from "@tabler/icons-react";
import { Placeholder } from "@/components/blog/ui/Placeholder";
import { MediaImage } from "@/components/blog/ui/MediaImage";
import { Button } from "@/components/blog/ui/Button";
import { useSite } from "@/components/blog/SiteProvider";
import { useMounted } from "@/components/blog/ui/useMounted";
import { MobileBreaks } from "@/components/blog/ui/MobileBreaks";
import type { HomeContent } from "@/lib/types";

type Banner = HomeContent["banners"][number];

type Props = {
  banners?: Banner[]; // HomeContent.banners
};

export function ClinicIntroSection({ banners: bannersProp }: Props) {
  const { clinic } = useSite();
  const mounted = useMounted();
  // 내용이 없으면 없는 대로: 배너가 하나도 없으면 섹션을 아예 그리지 않고, 문구를 비우면 이미지만 보인다 (기본 문구로 채우지 않는다)
  const banners: Banner[] = bannersProp ?? [];

  // 관리자가 배너 이미지를 올리기 전 기본 이미지 (메인 히어로 2번 슬라이드 = c_main_2.png / KPSC여행사)
  const FALLBACKS = ["/images/hero/c_main_2.png", "/images/content/kpsc-travel-logo.webp"];
  const FALLBACK_FIT = ["object-cover", "object-contain p-6"];
  const FALLBACK_BG = ["bg-white", "bg-[#eaf2fb]"];

  // 배너 한 장 (서버 프리렌더 시 첫 장만, 마운트 후 swiper 슬라이드로)
  const renderBanner = (b: Banner, i: number) => {
    const fb = FALLBACKS[i];
    const fbFit = FALLBACK_FIT[i] ?? "object-cover";
    const fbBg = FALLBACK_BG[i] ?? "bg-neutral-700";
    // 처음 두 배너는 KPSC 고정 이미지(fb)를 항상 사용, 그 외 배너만 관리자 업로드 이미지
    const desktop = fb ? null : b.image ?? null;
    const mobile = fb ? null : b.mobileImage ?? desktop;
    return (
      <div className="relative w-full">
        {/* 데스크톱 배너 1920/920. 모바일은 4:5. 긴 이미지는 위쪽을 남기고 아래가 잘린다 */}
        {desktop ? (
          <div className="relative hidden w-full aspect-[1920/920] bg-neutral-700 md:block">
            <MediaImage image={desktop} sizes="(min-width: 768px) 100vw, 1px" priority={i === 0} />
          </div>
        ) : fb ? (
          <div className={`relative hidden w-full aspect-[1920/920] md:block ${fbBg}`}>
            <img src={fb} alt="" className={`absolute inset-0 h-full w-full opacity-80 ${fbFit}`} />
          </div>
        ) : (
          <Placeholder label={`배너 ${i + 1} (데스크톱)`} className="w-full hidden md:flex aspect-[1920/920] bg-neutral-700 text-neutral-300" />
        )}
        {mobile ? (
          <div className="relative block w-full aspect-[4/5] bg-neutral-700 md:hidden">
            <MediaImage image={mobile} sizes="(min-width: 768px) 1px, 100vw" priority={i === 0} className="object-top" />
          </div>
        ) : fb ? (
          <div className={`relative block w-full aspect-[4/5] md:hidden ${fbBg}`}>
            <img src={fb} alt="" className={`absolute inset-0 h-full w-full opacity-80 ${fbFit === "object-cover" ? "object-cover object-top" : fbFit}`} />
          </div>
        ) : (
          <Placeholder label={`배너 ${i + 1} (모바일)`} className="w-full flex md:hidden aspect-[4/5] bg-neutral-700 text-neutral-300" />
        )}

        {/* 오버레이 문구 */}
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-site-4xl absolute inset-0 flex flex-col justify-start py-15 md:py-30">
          {b.label && <h2 className="max-w-2xl text-xl font-bold leading-tight whitespace-pre-line text-neutral-900 md:text-5xl">{b.label}</h2>}
          {b.text && (
            <p className="mt-4 max-w-xl text-base text-neutral-800 whitespace-pre-line md:text-xl">
              {/* "|" 는 모바일에서만 줄바꿈 */}
              <MobileBreaks text={b.text} />
            </p>
          )}
          <div className="mt-4 md:mt-6">
            {/* 레퍼런스: 흰 알약 버튼, hover 시 primary 배경. 병원 소개는 홈페이지 첫 화면으로 연결 */}
            <Button
              href={clinic.homepageUrl}
              variant="ghost"
              size="lg"
              className="inline-flex items-center justify-center bg-primary rounded-full text-primary-foreground shadow-lg h-11 md:h-12 px-6 md:px-7 text-base md:text-lg font-medium gap-2 hover:bg-brand-secondary transition-all"
            >
              About {clinic.name}
              <IconArrowRight className="size-4 md:size-5" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  if (banners.length === 0) return null;

  return (
    <section className="relative overflow-hidden text-background">
      <div className="relative">
        {mounted && banners.length > 1 ? (
          /* 자동 재생 슬라이드 (loop). swiper 자동재생은 현재 시각을 읽어 클라이언트에서만 렌더 */
          <Swiper modules={[Autoplay]} loop autoplay={{ delay: 5000, disableOnInteraction: false }} className="w-full">
            {banners.map((b, i) => (
              <SwiperSlide key={i}>{renderBanner(b, i)}</SwiperSlide>
            ))}
          </Swiper>
        ) : (
          renderBanner(banners[0], 0)
        )}
      </div>
    </section>
  );
}
