/* ==========================================================================
   KPSC소개 > KPSC와 함께하는 사람들  (원본 /partner.php?pg=12)
   구성
     1) 히어로 — 텍스트 전용 중앙 정렬
     2) 파트너 카드 2장 (PC 2열) — 상단 이미지 + 하단 텍스트
     3) 파트너 모집 카드 — 3단계 타임라인 + 전화 CTA
   ========================================================================== */

import type { Metadata } from "next";
import SubLayout from "@/components/sub/SubLayout";
import Reveal from "@/components/common/Reveal";
import Image from "next/image";
import { CONTENT_IMAGES } from "@/lib/images";
import { COMPANY } from "@/lib/site-config";

export const metadata: Metadata = { title: "KPSC와 함께하는 사람들" };

/* --------------------------------------------------------------------------
   협력 파트너사 — 2026-08 클라이언트 전달 문구 기준 4개사
   (WEFLOW / 미니미니핸드폰 설명은 전달받지 못해 기존 문구 패턴에 맞춰 작성)
   -------------------------------------------------------------------------- */
type Partner = {
  title: string;
  desc: string;
  image: string;
  /** 외부 사이트가 있는 파트너만 지정 — 카드 전체가 새 창 링크가 된다 */
  href?: string;
};

const PARTNERS: Partner[] = [
  {
    title: "홈페이지 담당 파트너 : WEFLOW[위플로우]",
    desc: "KPSC와 함께 미래에너지 혁신과 더 나은 세상을 위한 변화를 실천하는 홈페이지 제작 전문 웹 에이전시입니다.",
    image: CONTENT_IMAGES.partner3,
    /* 유일하게 외부 사이트가 연결된 파트너 — 강조 + 새 창 링크 */
    href: "http://weflowlab.kr/",
  },
  {
    title: "여행 관련 파트너 : RETOO[레투코리아]",
    desc: "KPSC와 함께 미래에너지 혁신과 더 나은 세상을 위한 변화를 실천하는 국내 No.1 여행캐리어 전문업체입니다.",
    image: CONTENT_IMAGES.partner1,
  },
  {
    title: "프린트 및 인쇄 디자인 파트너 : 프린트천국",
    desc: "KPSC와 함께 미래에너지 혁신과 더 나은 세상을 위한 변화를 실천하는 국내 전문 프린트업체입니다.",
    image: CONTENT_IMAGES.partner2,
  },
  {
    title: "핸드폰 액세서리 관련 파트너 : 미니미니핸드폰 분당서현점",
    desc: "KPSC와 함께 미래에너지 혁신과 더 나은 세상을 위한 변화를 실천하는 핸드폰 액세서리 전문 매장입니다.",
    image: CONTENT_IMAGES.partner4,
  },
];

/* --------------------------------------------------------------------------
   파트너 모집 3단계 타임라인
   -------------------------------------------------------------------------- */
const TIMELINE = [
  { no: "1", title: "가치 공유", desc: "미래에너지 혁신을 위한 첫 걸음" },
  { no: "2", title: "전략 제안", desc: "업체별 최적화된 협력 모델 구축" },
  { no: "3", title: "혁신 실행", desc: "더 나은 세상을 위한 변화의 실천" },
];

/* 외부 링크 아이콘 — 새 창으로 이동함을 알리는 ↗ (박스 밖으로 나가는 화살표) */
function ExternalLinkIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M14 4h6v6" />
      <path d="M20 4l-8.5 8.5" />
      <path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
    </svg>
  );
}

/* 카드 내용 — 링크 파트너는 <a>, 나머지는 <article> 로 감싸므로 본문만 분리 */
function PartnerCardBody({ partner }: { partner: Partner }) {
  return (
    <>
      {/* hover 시 천천히 나타나는 청록→파랑→보라 그라데이션 테두리
          (mask 로 2px 링만 남기고 속을 뚫는다)
          링크 파트너는 실선 테두리로 강조하므로 이 링을 쓰지 않는다.
          (두 테두리가 겹치면 1px 어긋나 떠 보인다) */}
      {!partner.href && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 rounded-2xl p-[1px] opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          style={{
            background: "linear-gradient(135deg, #2dd4bf, #3b82f6, #8b5cf6)",
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />
      )}

      {/* 상단 이미지 */}
      <div className="h-[220px] overflow-hidden lg:h-[280px]">
        <div className="relative h-full w-full transition-transform duration-[600ms] group-hover:scale-105">
          <Image
            src={partner.image}
            alt={partner.title}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>

      {/* 하단 텍스트 */}
      <div className="p-7 lg:p-8">
        <h3 className="flex items-start gap-1.5 text-[18px] font-bold text-brand-600 lg:text-[20px]">
          <span>{partner.title}</span>
          {partner.href && (
            <ExternalLinkIcon className="mt-1 h-4 w-4 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          )}
        </h3>
        <p className="mt-3 text-[14px] leading-[1.75] text-ink-500 lg:text-[15px]">
          {partner.desc}
        </p>
      </div>
    </>
  );
}

export default function PartnersPage() {
  return (
    <SubLayout
      pathname="/about/partners"
      banner="about"
    >
      {/* ================================================================
          1) 히어로 — 텍스트 전용
          ================================================================ */}
      <Reveal as="section">
        <span className="inline-block rounded-full bg-brand-50 px-4 py-1.5 text-[12px] font-extrabold tracking-[0.1em] text-brand-600">
          OUR PARTNERS
        </span>
        {/* 클라이언트 전달 문구 (맞춤법 교정) */}
        <h2 className="mt-5 text-[24px] leading-tight font-bold text-ink-900 lg:text-[38px]">
          든든한 KPSC는 다양한 파트너들과 함께
          <br />
          오늘도 성장하고 있습니다.
        </h2>
      </Reveal>

      {/* ================================================================
          2) 파트너 카드 4장 (PC 2×2)
          ================================================================ */}
      <section className="mt-14 lg:mt-20">
        <Reveal>
          <h3 className="text-[20px] leading-[1.6] font-bold text-ink-900 lg:text-[28px]">
            KPSC와 함께하는 든든한 파트너
          </h3>
        </Reveal>

        <div className="mt-8 grid gap-8 lg:mt-12 lg:grid-cols-2">
          {PARTNERS.map((partner, i) => {
            /* 링크 파트너는 카드 전체가 클릭 영역이 되고, 테두리·그림자를
               한 단계 더 올려 다른 카드보다 눈에 띄게 한다 */
            const cardClass = [
              "group relative block h-full overflow-hidden rounded-2xl bg-white transition-all duration-300 hover:-translate-y-1",
              partner.href
                ? "border-2 border-brand-600 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)]"
                : "border border-ink-200 hover:shadow-[var(--shadow-card)]",
            ].join(" ");

            return (
              <Reveal key={partner.title} delay={(i % 2) * 0.15}>
                {partner.href ? (
                  <a
                    href={partner.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={`${partner.title} 홈페이지 새 창으로 열기`}
                    className={cardClass}
                  >
                    <PartnerCardBody partner={partner} />
                  </a>
                ) : (
                  <article className={cardClass}>
                    <PartnerCardBody partner={partner} />
                  </article>
                )}
              </Reveal>
            );
          })}
        </div>

        {/* 마무리 문구 — 섹션 제목("KPSC와 함께하는 든든한 파트너")과 동일 서식 */}
        <Reveal className="mt-10 lg:mt-14">
          <h3 className="text-[20px] leading-[1.6] font-bold text-ink-900 lg:text-[28px]">
            앞으로도 저희는 저희 KPSC를 방문해주시는 모든 분들께
            <br className="hidden md:inline" />
            협력 파트너들과 함께 정성을 다하겠습니다.
          </h3>
        </Reveal>
      </section>

      {/* ================================================================
          3) 파트너 모집 카드 — 전체 폭
          ================================================================ */}
      <Reveal as="section" className="mt-8 lg:mt-10">
        {/* 원본 서식: 좌측 정렬 + 흰 카드 타임라인 + 파란 CTA 버튼 */}
        <div className="rounded-2xl bg-ink-50 p-8 lg:p-14">
          {/* 칩 — 상단 OUR PARTNERS 칩과 동일 형식 */}
          <span className="inline-block rounded-full bg-brand-50 px-4 py-1.5 text-[12px] font-extrabold tracking-[0.1em] text-brand-600">
            NETWORK EXPANSION
          </span>
          <h3 className="mt-5 text-[22px] leading-tight font-bold text-ink-900 lg:text-[32px]">
            저희는 이렇게 저희와 함께할
            <br />
            파트너를 모집합니다.
          </h3>

          {/* 3단계 타임라인 — 흰 카드, 좌측 정렬 */}
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {TIMELINE.map((step, i) => (
              <Reveal
                as="li"
                key={step.no}
                delay={i * 0.1}
                className="rounded-xl border border-ink-200 bg-white p-6 lg:p-7"
              >
                {/* 원형 번호 */}
                <span className="font-mont flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-[14px] font-bold text-white">
                  {step.no}
                </span>
                <h4 className="mt-4 text-[17px] font-bold text-ink-900">{step.title}</h4>
                <p className="mt-2 text-[14px] text-ink-500">{step.desc}</p>
              </Reveal>
            ))}
          </ol>

          {/* 전화 CTA — 파란 버튼, 좌측 정렬 */}
          <div className="mt-10">
            <a
              href={`tel:${COMPANY.tel}`}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-7 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-brand-700"
            >
              파트너 참여하기 : {COMPANY.tel}
            </a>
          </div>
        </div>
      </Reveal>
    </SubLayout>
  );
}
