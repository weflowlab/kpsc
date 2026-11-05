/* ==========================================================================
   인사말 > KPSC의 방향성  (원본 /direction.php?pg=22)
   구성 — 원본 인라인 CSS 수치를 그대로 반영
     1) Intro — PC 좌측 이미지(오프셋 프레임 + 500px 직각) + 우측 텍스트 + 체크 리스트
     2) Our Action — 가운데 정렬 헤더 + 카드 3장 (연회색 대형 숫자 + 반전 아이콘 박스)
     3) CTA — #0f172a 박스 + 잎사귀 워터마크 (max-w 64rem)
   아이콘은 원본과 동일한 Phosphor light (check/bicycle/coffee/hand-heart/leaf/arrow)
   ※ 원본에는 내용이 비어 있는 height:0 히어로 섹션이 남아 있었으나 제거했다.
   ========================================================================== */

import type { Metadata } from "next";
import Link from "next/link";
import SubLayout from "@/components/sub/SubLayout";
import Reveal from "@/components/common/Reveal";
import Image from "next/image";
import { CONTENT_IMAGES } from "@/lib/images";

export const metadata: Metadata = { title: "KPSC의 방향성" };

/* --------------------------------------------------------------------------
   Phosphor light 아이콘 (viewBox 256) — 원본 CDN 아이콘과 동일 패스
   -------------------------------------------------------------------------- */
type IconProps = { className?: string };

function PhIcon({ className = "", d }: IconProps & { d: string }) {
  return (
    <svg className={className} viewBox="0 0 256 256" fill="currentColor" aria-hidden>
      <path d={d} />
    </svg>
  );
}

const PH = {
  check:
    "M228.24,76.24l-128,128a6,6,0,0,1-8.48,0l-56-56a6,6,0,0,1,8.48-8.48L96,191.51,219.76,67.76a6,6,0,0,1,8.48,8.48Z",
  bicycle:
    "M208,114a45.88,45.88,0,0,0-17.8,3.58L162.45,70H192a10,10,0,0,1,10,10,6,6,0,0,0,12,0,22,22,0,0,0-22-22H152a6,6,0,0,0-5.18,9l13.4,23H98.11L81.18,61A6,6,0,0,0,76,58H48a6,6,0,0,0,0,12H72.55l15,25.64L70,119.62a46.22,46.22,0,1,0,9.68,7.09L94.11,107,126.82,163a6,6,0,0,0,5.19,3,5.91,5.91,0,0,0,3-.82,6,6,0,0,0,2.16-8.2l-32.07-55h62.11l12.63,21.66A46,46,0,1,0,208,114ZM82,160a34,34,0,1,1-19.13-30.57l-19.72,27a6,6,0,0,0,9.7,7.08l19.7-27A33.88,33.88,0,0,1,82,160Zm126,34a34,34,0,0,1-22-59.86L202.82,163a6,6,0,0,0,5.19,3,5.91,5.91,0,0,0,3-.82,6,6,0,0,0,2.16-8.2l-16.86-28.91A34,34,0,1,1,208,194Z",
  coffee:
    "M82,56V24a6,6,0,0,1,12,0V56a6,6,0,0,1-12,0Zm38,6a6,6,0,0,0,6-6V24a6,6,0,0,0-12,0V56A6,6,0,0,0,120,62Zm32,0a6,6,0,0,0,6-6V24a6,6,0,0,0-12,0V56A6,6,0,0,0,152,62Zm94,58v8a38,38,0,0,1-36.94,38,94.55,94.55,0,0,1-31.13,44H208a6,6,0,0,1,0,12H32a6,6,0,0,1,0-12H62.07A94.34,94.34,0,0,1,26,136V88a6,6,0,0,1,6-6H208A38,38,0,0,1,246,120Zm-44,16V94H38v42a82.27,82.27,0,0,0,46.67,74h70.66A82.27,82.27,0,0,0,202,136Zm32-16a26,26,0,0,0-20-25.29V136a93.18,93.18,0,0,1-1.69,17.64A26,26,0,0,0,234,128Z",
  handHeart:
    "M229.12,142.65a22.43,22.43,0,0,0-19.55-3.88l-4.32,1C227,119.55,238,99.51,238,80c0-25.36-20.39-46-45.46-46A45.51,45.51,0,0,0,156,52a45.51,45.51,0,0,0-36.54-18C94.39,34,74,54.64,74,80c0,11.38,3.63,22.49,11.29,34.36a29.73,29.73,0,0,0-16.56,8.43L45.52,146H16A14,14,0,0,0,2,160v40a14,14,0,0,0,14,14H120a6,6,0,0,0,1.46-.18l64-16a7.16,7.16,0,0,0,.89-.3L225.17,181l.33-.15a22.6,22.6,0,0,0,3.62-38.18ZM119.46,46a33.16,33.16,0,0,1,31,20.28,6,6,0,0,0,11.1,0,33.16,33.16,0,0,1,31-20.28C210.68,46,226,61.57,226,80c0,20.24-16.18,43-46.8,65.75l-14.87,3.42A26,26,0,0,0,140,114H99.67C90.36,101.67,86,90.81,86,80,86,61.57,101.32,46,119.46,46ZM14,200V160a2,2,0,0,1,2-2H42v44H16A2,2,0,0,1,14,200Zm206.28-30-38.2,16.27L119.26,202H54V154.49l23.21-23.22A17.88,17.88,0,0,1,89.94,126H140a14,14,0,0,1,0,28H112a6,6,0,0,0,0,12h32a6,6,0,0,0,1.34-.15l67-15.41.24-.06A10.6,10.6,0,0,1,220.28,170Z",
  leaf: "M221.45,40.19a6,6,0,0,0-5.64-5.64C140.43,30.11,80.14,52.71,54.53,95c-17.44,28.79-16.76,62.8,1.79,96.2L35.76,211.76a6,6,0,1,0,8.48,8.48L64.8,199.68c17.27,9.59,34.7,14.41,51.49,14.41A85.38,85.38,0,0,0,161,201.47C203.29,175.86,225.88,115.57,221.45,40.19Zm-66.66,151c-24.08,14.58-52.64,14.37-81.13-.39l90.59-90.59a6,6,0,1,0-8.49-8.49L65.17,182.34c-14.76-28.49-15-57-.39-81.13C87.33,63.94,140.68,43.36,209.66,46.34,212.64,115.32,192.06,168.67,154.79,191.21Z",
  arrowRight:
    "M220.24,132.24l-72,72a6,6,0,0,1-8.48-8.48L201.51,134H40a6,6,0,0,1,0-12H201.51L139.76,60.24a6,6,0,0,1,8.48-8.48l72,72A6,6,0,0,1,220.24,132.24Z",
} as const;

/* --------------------------------------------------------------------------
   Intro 체크 리스트
   -------------------------------------------------------------------------- */
const CHECKLIST = ["용인에너지협동조합 핵심 파트너십", "탄소중립 로드맵 실천 기여"];

/* --------------------------------------------------------------------------
   Our Action 카드 3장 — 원본 텍스트 그대로 (아이콘: ph-bicycle/coffee/hand-heart)
   -------------------------------------------------------------------------- */
const ACTIONS = [
  {
    no: "01",
    icon: PH.bicycle,
    title: "도보 및 대중교통",
    desc: "가까운 거리는 도보로 이동하며 장거리 이동 시 대중교통 이용을 지향합니다.",
  },
  {
    no: "02",
    icon: PH.coffee,
    title: "일회용품 줄이기",
    desc: "개인 텀블러 사용을 습관화하여 불필요한 일회용품 배출을 최소화하고 있습니다.",
  },
  {
    no: "03",
    icon: PH.handHeart,
    title: "사회공헌 활동",
    desc: "다양한 도우미 활동을 통해 주변의 어려운 이웃에게 따뜻한 도움을 전하고 있습니다.",
  },
];

export default function DirectionPage() {
  return (
    <SubLayout
      pathname="/greeting/direction"
      banner="greeting"
    >
      {/* ================================================================
          1) Intro — 원본 .intro-grid (2열, 정중앙 정렬, gap 2.5/5rem)
          ================================================================ */}
      <section className="grid items-center gap-10 md:gap-20 lg:grid-cols-2">
        {/* 좌측 이미지 — 오프셋 프레임(-2.5rem + 1rem 이동, 1px #e2e8f0) */}
        <Reveal type="fade-right">
          <div className="relative">
            <span
              aria-hidden
              className="absolute -top-10 -left-10 h-full w-full translate-x-4 translate-y-4 border border-[#e2e8f0]"
            />
            <div className="relative h-[500px] overflow-hidden rounded-[2px] shadow-[0_20px_50px_-12px_rgba(15,23,42,0.08)]">
              <Image
                src={CONTENT_IMAGES.direction}
                alt="Vision"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </Reveal>

        {/* 우측 텍스트 */}
        <Reveal type="fade-left">
          <h2 className="mb-4 text-[30px] leading-[1.25] font-extrabold tracking-[-0.02em] text-[#0f172a] md:mb-8 md:text-[36px]">
            친환경 에너지로 향하는
            <br />
            KPSC의 약속
          </h2>
          <p className="mb-5 text-[14px] leading-[2] font-light text-[#334155] md:mb-10 md:text-[18px]">
            저희 KPSC는 용인에너지협동조합의 소속된 구성원으로서 탄소중립실천 및 미래
            에너지 발전에 기여하여 친환경 에너지 발전으로 나아가겠습니다.
          </p>

          {/* 체크 리스트 — 원형 배지(#f1f5f9) + ph-check */}
          <ul className="space-y-4 md:space-y-6">
            {CHECKLIST.map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 text-[18px] font-medium text-[#334155] md:gap-5 md:text-[23px]"
              >
                <span
                  aria-hidden
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f1f5f9] text-[#0f172a] md:h-10 md:w-10"
                >
                  <PhIcon d={PH.check} className="h-[14px] w-[14px] md:h-[18px] md:w-[18px]" />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* ================================================================
          2) Our Action — 가운데 정렬 헤더 + 카드 3장
          (원본 섹션 간격: intro pb 2.5/8rem + action pt 1.25/3.5rem)
          ================================================================ */}
      <section className="mt-[3.75rem] md:mt-[11.5rem]">
        <Reveal className="mb-6 text-center md:mb-10">
          <h3 className="font-mont mb-2 text-[12px] font-extrabold tracking-[0.2em] text-[#94a3b8] uppercase md:mb-4 md:text-[14px]">
            Our Action
          </h3>
          <h2 className="text-[30px] font-extrabold text-[#0f172a] md:text-[36px]">
            일상 속 친환경 실천
          </h2>
        </Reveal>

        <ul className="grid gap-4 md:gap-8 lg:grid-cols-3">
          {ACTIONS.map((action, i) => (
            <Reveal as="li" key={action.no} delay={i * 0.2}>
              {/* 원본 .action-card: 1px #e2e8f0, 라운드 1rem, ambient shadow,
                  hover 시 -10px 부상 + 그림자 강화 (0.5s) */}
              <div className="group relative h-full overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.08)] transition-all duration-500 hover:-translate-y-2.5 hover:shadow-[0_30px_60px_-12px_rgba(15,23,42,0.12)] md:p-10">
                {/* 우상단 대형 이탤릭 숫자 — 거의 안 보이는 #f8fafc */}
                <span className="serif-italic absolute top-4 right-6 text-[48px] leading-none text-[#f8fafc] transition-colors duration-300 group-hover:text-[#f1f5f9] md:text-[72px]">
                  {action.no}
                </span>

                {/* 아이콘 박스 — 남색(#1e293b) 배경, hover 시 색 반전 */}
                <span
                  aria-hidden
                  className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#1e293b] text-white transition-colors duration-500 group-hover:bg-[#f8fafc] group-hover:text-[#1e293b] md:mb-8"
                >
                  <PhIcon d={action.icon} className="h-[18px] w-[18px] md:h-6 md:w-6" />
                </span>

                <h4 className="mb-2 text-[16px] font-bold text-[#1e293b] md:mb-4 md:text-[20px]">
                  {action.title}
                </h4>
                <p className="text-[14px] leading-[1.625] font-light text-[#475569] md:text-[16px]">
                  {action.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* ================================================================
          3) CTA — 원본 .cta-box: #0f172a, 라운드 2rem, max-w 64rem
          ================================================================ */}
      <Reveal as="section" className="mt-20 mb-10 md:mt-56 md:mb-24">
        <div className="relative mx-auto max-w-[64rem] overflow-hidden rounded-[2rem] bg-[#0f172a] p-6 md:p-12 lg:p-20">
          {/* 잎사귀 워터마크 — ph-leaf, rgba(255,255,255,0.05) */}
          <PhIcon
            d={PH.leaf}
            className="pointer-events-none absolute -right-10 -bottom-10 h-[160px] w-[160px] text-white/5 md:h-[320px] md:w-[320px]"
          />

          <div className="relative z-10 text-center">
            <h2 className="mb-4 text-[24px] leading-[1.4] font-extrabold text-white md:mb-8 md:text-[30px] lg:text-[36px]">
              지속 가능한 에너지를 위한 여정,
              <br />
              KPSC가 함께합니다.
            </h2>

            <Link
              href="/news/activities"
              className="group inline-flex items-center rounded-full bg-white px-5 py-2.5 text-[14px] font-extrabold text-[#0f172a] transition-all duration-300 hover:bg-[#f1f5f9] md:px-10 md:py-5 md:text-[16px]"
            >
              KPSC 활동
              <PhIcon
                d={PH.arrowRight}
                className="ml-1 h-[14px] w-[14px] transition-transform duration-300 group-hover:translate-x-1 md:ml-2 md:h-4 md:w-4"
              />
            </Link>
          </div>
        </div>
      </Reveal>
    </SubLayout>
  );
}
