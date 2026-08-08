/* ==========================================================================
   인사말 > 운영진 또는 대표 인사말  (원본 /greeting.php?pg=21)
   구성
     1) 인사말 본문 — PC 좌측 이미지(오프셋 프레임) + 우측 텍스트 2단
     2) CTA — 짙은 인디고 배경 박스 (좌 텍스트 + 우 버튼)
   ========================================================================== */

import type { Metadata } from "next";
import Link from "next/link";
import SubLayout from "@/components/sub/SubLayout";
import Reveal from "@/components/common/Reveal";
import Image from "next/image";
import { CONTENT_IMAGES } from "@/lib/images";

export const metadata: Metadata = { title: "인사말" };

export default function GreetingPage() {
  return (
    <SubLayout
      pathname="/greeting"
      banner="greeting"
    >
      {/* ================================================================
          1) 인사말 본문
          ================================================================ */}
      <section className="flex flex-col items-start gap-5 lg:flex-row lg:gap-20">
        {/* 좌측 비주얼 — 원본 .greeting-visual-col
            이미지는 3:4 세로형, 직각 모서리 + 딥 섀도.
            오프셋 프레임은 20px 밀린 1px #D1D5DB 사각 테두리 */}
        <Reveal type="fade-right" className="w-full lg:w-[41.67%] lg:shrink-0">
          <div className="relative">
            <span
              aria-hidden
              className="absolute top-[20px] left-[20px] -right-[20px] -bottom-[20px] border border-[#D1D5DB]"
            />
            <div className="relative aspect-[3/4] overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]">
              <Image
                src={CONTENT_IMAGES.greeting}
                alt="Office Architecture"
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* 캡션 — 라인이 남은 폭을 채우고(flex-1) Playfair 이탤릭 */}
          <div className="mt-6 flex items-center gap-3 md:mt-12 md:gap-6">
            <span aria-hidden className="h-px flex-1 bg-[#e2e8f0]" />
            <span className="serif-italic text-[18px] font-bold text-[#cbd5e1] md:text-[24px]">
              Social Value Creator
            </span>
          </div>
        </Reveal>

        {/* 우측 텍스트 — 원본 .greeting-text-col (58.33%, pt 1.25/2.5rem) */}
        <Reveal type="fade-left" className="w-full pt-5 lg:w-[58.33%] lg:pt-10">
          {/* 제목 — 2rem×1px #4f46e5 라인 */}
          <h2 className="mb-4 flex items-center gap-1.5 text-[24px] font-bold text-[#1A1F2C] md:mb-8 md:gap-3 md:text-[30px]">
            <span aria-hidden className="h-px w-8 bg-[#4f46e5]" />
            안녕하십니까
          </h2>

          {/* 본문 — 원본 .greeting-body-text: 18px, 행간 2.0, font-light */}
          <div className="space-y-4 text-[16px] leading-[2] font-light text-[#475569] md:space-y-8 md:text-[18px]">
            {/* 강조 리드 문장 (.greeting-body-strong) */}
            <p className="text-[18px] font-bold text-[#0f172a] md:text-[20px]">
              KPSC을 찾아주신 모든 분들께
              <br />
              깊은 감사의 말씀을 드립니다.
            </p>
            <p>
              우리 조합은{" "}
              <span className="font-semibold text-[#312e81] underline decoration-[#e2e8f0] underline-offset-8">
                “미래 에너지 실천, 지식을 나누며, 지속가능한 발전”
              </span>
              이라는 가치를 중심에 두고 출발하였습니다. 급변하는 환경 속에서도 우리는
              본질을 잃지 않고 상생의 길을 모색합니다.
            </p>
            <p>
              미래 에너지 발전을 함께 이끌어가는 협동의 힘이 곧 우리 조합의 자산입니다.
              혼자서는 이룰 수 없는 가치들을 연대와 협력을 통해 현실로 만들어가고
              있습니다.
            </p>
            <p>
              앞으로도 KPSC은 신뢰와 협력을 바탕으로, 모두가 함께 행복을 누리는 사회적
              가치를 만들어가는 데 최선을 다하겠습니다. 여러분의 여정에 든든한 파트너가
              되겠습니다.
            </p>
            <p className="pt-2 md:pt-4">많은 관심과 응원 부탁드립니다. 감사합니다.</p>
          </div>

          {/* 서명 — 원본 .greeting-signature-area: 우측 정렬 */}
          <div className="mt-8 flex flex-col items-end border-t border-[#f1f5f9] pt-6 md:mt-16 md:pt-12">
            <div className="text-right">
              <p className="font-mont mb-1 text-[14px] tracking-[0.1em] text-[#94a3b8] uppercase md:mb-2">
                Representative of KPSC
              </p>
              <h3 className="text-[30px] font-bold tracking-[-0.025em] text-[#1A1F2C] md:text-[36px]">
                이 도 영
                <span className="ml-2 text-[16px] font-light text-[#64748b] md:text-[18px]">
                  드림
                </span>
              </h3>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ================================================================
          2) CTA — 원본 .greeting-cta-box (#1A1F2C, 24px 라운드, 딥 섀도)
          ================================================================ */}
      <Reveal as="section" className="mt-20 mb-10 lg:mt-28 md:mb-24">
        <div className="relative overflow-hidden rounded-3xl bg-[#1A1F2C] p-6 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] md:p-12 lg:p-20">
          {/* 배경 워터마크 — 원본 Phosphor ph-planet 아이콘 (흰색, opacity 0.1) */}
          <svg
            aria-hidden
            className="pointer-events-none absolute right-[-5%] bottom-[-10%] h-[160px] w-[160px] text-white opacity-10 md:h-[320px] md:w-[320px]"
            viewBox="0 0 256 256"
            fill="currentColor"
          >
            <path d="M245.11,60.68c-7.65-13.19-27.84-16.16-58.5-8.66A95.93,95.93,0,0,0,32,128a98,98,0,0,0,.78,12.31C5.09,169,5.49,186,10.9,195.32,16,204.16,26.64,208,40.64,208a124.11,124.11,0,0,0,28.79-4A95.93,95.93,0,0,0,224,128a97.08,97.08,0,0,0-.77-12.25c12.5-13,20.82-25.35,23.65-35.92C248.83,72.51,248.24,66.07,245.11,60.68ZM128,48a80.11,80.11,0,0,1,78,62.2c-17.06,16.06-40.15,32.53-62.07,45.13C116.38,171.14,92.48,181,73.42,186.4A79.94,79.94,0,0,1,128,48ZM24.74,187.29c-1.46-2.51-.65-7.24,2.22-13a79.05,79.05,0,0,1,10.29-15.05,96,96,0,0,0,18,31.32C38,193.46,27.24,191.61,24.74,187.29ZM128,208a79.45,79.45,0,0,1-38.56-9.94,370,370,0,0,0,62.43-28.86c21.58-12.39,40.68-25.82,56.07-39.08A80.07,80.07,0,0,1,128,208ZM231.42,75.69c-1.7,6.31-6.19,13.53-12.63,21.13a95.69,95.69,0,0,0-18-31.35c14.21-2.35,27.37-2.17,30.5,3.24C232.19,70.28,232.24,72.63,231.42,75.69Z" />
          </svg>

          <div className="relative z-10 flex flex-col items-center justify-between gap-5 md:flex-row md:gap-10">
            <div className="text-center md:text-left">
              <h2 className="text-[24px] leading-[1.2] font-bold text-white md:text-[30px] lg:text-[36px]">
                함께 만드는 미래, 지금 시작하세요.
              </h2>
              <p className="mt-2 text-[14px] font-light text-[#c7d2fe] md:mt-4 md:text-[16px]">
                KPSC은 언제나 여러분의 제안과 참여를 기다립니다.
              </p>
            </div>

            <Link
              href="/news/activities"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-[14px] font-extrabold text-accent-900 shadow-xl transition-transform duration-300 hover:scale-105 md:gap-3 md:px-10 md:py-5 md:text-[16px]"
            >
              KPSC 활동
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </Reveal>
    </SubLayout>
  );
}
