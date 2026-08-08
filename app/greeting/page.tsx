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
      <section className="flex flex-col gap-12 lg:flex-row lg:gap-20">
        {/* 좌측 비주얼 — 오프셋 프레임 장식 + 캡션 */}
        <Reveal type="fade-right" className="lg:w-[41.67%] lg:shrink-0">
          <div className="relative">
            {/* 오프셋 프레임 (원본 .greeting-offset-frame) */}
            <span
              aria-hidden
              className="absolute -right-4 -bottom-4 h-full w-full rounded-lg border border-accent-500/40"
            />
            <div className="relative h-[300px] overflow-hidden rounded-lg lg:h-[420px]">
              <Image
                src={CONTENT_IMAGES.greeting}
                alt="Office Architecture"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* 캡션 — 가로 라인 + Playfair 이탤릭 */}
          <div className="mt-8 flex items-center gap-4">
            <span aria-hidden className="h-px w-12 bg-ink-300" />
            <span className="serif-italic text-[15px] text-ink-500">
              Social Value Creator
            </span>
          </div>
        </Reveal>

        {/* 우측 텍스트 */}
        <Reveal type="fade-left" className="flex-1">
          {/* 제목 — 앞에 장식 라인 */}
          <h2 className="flex items-center gap-4 text-[24px] font-bold text-accent-900 lg:text-[32px]">
            <span aria-hidden className="h-[2px] w-8 bg-accent-500" />
            안녕하십니까
          </h2>

          {/* 강조 리드 문장 */}
          <p className="mt-8 text-[18px] leading-[1.6] font-bold text-ink-900 lg:text-[22px]">
            KPSC를 찾아주신 모든 분들께
            <br />
            깊은 감사의 말씀을 드립니다.
          </p>

          {/* 본문 단락 */}
          <div className="mt-7 space-y-6 text-[15px] leading-[1.9] text-ink-500 lg:text-[16px]">
            <p>
              우리 조합은{" "}
              <span className="font-semibold text-brand-600">
                “미래 에너지 실천, 지식을 나누며, 지속가능한 발전”
              </span>{" "}
              이라는 가치를 중심에 두고 출발하였습니다. 급변하는 환경 속에서도 우리는
              본질을 잃지 않고 상생의 길을 모색합니다.
            </p>
            <p>
              미래 에너지 발전을 함께 이끌어가는 협동의 힘이 곧 우리 조합의 자산입니다.
              혼자서는 이룰 수 없는 가치들을 연대와 협력을 통해 현실로 만들어가고
              있습니다.
            </p>
            <p>
              앞으로도 KPSC는 신뢰와 협력을 바탕으로, 모두가 함께 행복을 누리는 사회적
              가치를 만들어가는 데 최선을 다하겠습니다. 여러분의 여정에 든든한 파트너가
              되겠습니다.
            </p>
            <p>많은 관심과 응원 부탁드립니다. 감사합니다.</p>
          </div>

          {/* 서명 */}
          <div className="mt-10 border-t border-ink-200 pt-8">
            <p className="font-mont text-[11px] tracking-[0.2em] text-ink-400 uppercase">
              Representative of KPSC
            </p>
            <h3 className="mt-2 text-[20px] font-bold text-accent-900 lg:text-[24px]">
              이 도 영
              <span className="ml-2 text-[14px] font-normal text-ink-400">드림</span>
            </h3>
          </div>
        </Reveal>
      </section>

      {/* ================================================================
          2) CTA — 짙은 인디고 배경
          ================================================================ */}
      <Reveal as="section" className="mt-20 lg:mt-28">
        <div className="relative flex flex-col items-start justify-between gap-8 overflow-hidden rounded-2xl bg-accent-900 p-8 lg:flex-row lg:items-center lg:p-14">
          {/* 배경 워터마크 아이콘 */}
          <span
            aria-hidden
            className="pointer-events-none absolute -right-8 -bottom-10 text-[180px] leading-none opacity-[0.07]"
          >
            🪐
          </span>

          <div className="relative">
            <h2 className="text-[22px] leading-tight font-bold text-white lg:text-[30px]">
              함께 만드는 미래, 지금 시작하세요.
            </h2>
            <p className="mt-3 text-[15px] text-white/70">
              KPSC는 언제나 여러분의 제안과 참여를 기다립니다.
            </p>
          </div>

          <Link
            href="/news/activities"
            className="group relative inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[14px] font-semibold text-accent-900 transition-colors hover:bg-brand-600 hover:text-white"
          >
            KPSC 활동
            <span aria-hidden className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </Reveal>
    </SubLayout>
  );
}
