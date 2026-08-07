/* ==========================================================================
   조직 구성 > 운영진 소개  (원본 /team.php?pg=31)
   구성
     1) 섹션 헤드 — 제목 + 구분선
     2) 조직도 1단 — 대표 카드 단독 중앙 정렬
     3) 조직도 2단 — 운영진 카드 2장 (PC 2열)
     4) 하단 CTA — KPSC 워터마크 텍스트
   카드는 우하단 오프셋 라인(.offset-line) + hover 시 부양 효과를 갖는다.
   ========================================================================== */

import type { Metadata } from "next";
import Link from "next/link";
import SubLayout from "@/components/sub/SubLayout";
import Reveal from "@/components/common/Reveal";

export const metadata: Metadata = { title: "운영진 소개" };

/* --------------------------------------------------------------------------
   조직도 카드 데이터 — 원본 텍스트 그대로
   -------------------------------------------------------------------------- */
type MemberCard = {
  no: string;
  icon: string;
  roleEn: string;
  name: string;
  desc: string;
};

/** 1단 — 대표 */
const REPRESENTATIVE: MemberCard = {
  no: "01",
  icon: "👤",
  roleEn: "Representative",
  name: "대표 이도영",
  desc: "KPSC의 총괄 및 비전을 이끕니다.",
};

/** 2단 — 운영진 */
const TEAMS: MemberCard[] = [
  {
    no: "02",
    icon: "📣",
    roleEn: "Operation Team",
    name: "운영진: SNS 운영팀",
    desc: "온라인 브랜드 커뮤니케이션 관리",
  },
  {
    no: "03",
    icon: "🛡️",
    roleEn: "Security Team",
    name: "운영진: 경호팀 KPSM",
    desc: "자산 보호 및 전문 경호 서비스 운영",
  },
];

/* --------------------------------------------------------------------------
   조직도 카드 공용 컴포넌트
   -------------------------------------------------------------------------- */
function OrgCard({ member }: { member: MemberCard }) {
  return (
    <div className="offset-line h-full rounded-2xl border border-ink-200 bg-white p-8 transition-transform duration-300 hover:-translate-y-2 lg:p-10">
      {/* 번호 */}
      <span className="serif-italic block text-[36px] leading-none text-ink-200">
        {member.no}
      </span>

      {/* 원형 아이콘 */}
      <span
        aria-hidden
        className="mt-6 flex h-16 w-16 items-center justify-center rounded-full bg-ink-50 text-[26px]"
      >
        {member.icon}
      </span>

      {/* 역할 라벨 */}
      <p className="font-mont mt-6 text-[11px] font-bold tracking-[0.2em] text-brand-600 uppercase">
        {member.roleEn}
      </p>

      <h3 className="mt-2 text-[20px] font-bold text-ink-900 lg:text-[22px]">
        {member.name}
      </h3>
      <p className="mt-3 text-[14px] leading-[1.75] text-ink-500 lg:text-[15px]">
        {member.desc}
      </p>
    </div>
  );
}

export default function TeamPage() {
  return (
    <SubLayout
      pathname="/organization/team"
      visualPlaceholder="조직 구성 서브 배너 (팀 이미지)"
    >
      {/* ================================================================
          1) 섹션 헤드
          ================================================================ */}
      <Reveal className="mb-12 lg:mb-16">
        <h2 className="text-[24px] font-bold text-ink-900 lg:text-[34px]">
          조직도 및 운영진 소개
        </h2>
        <span aria-hidden className="mt-5 block h-px w-full bg-ink-200" />
      </Reveal>

      {/* ================================================================
          2) 1단 — 대표 (단독 중앙 정렬)
          ================================================================ */}
      <Reveal as="section" className="flex justify-center">
        <div className="w-full max-w-md">
          <OrgCard member={REPRESENTATIVE} />
        </div>
      </Reveal>

      {/* 연결선 */}
      <div aria-hidden className="mx-auto my-10 h-16 w-px bg-ink-200 lg:my-14" />

      {/* ================================================================
          3) 2단 — 운영진 2열
          ================================================================ */}
      <section className="mx-auto grid max-w-4xl gap-12 lg:grid-cols-2 lg:gap-20">
        {TEAMS.map((member, i) => (
          <Reveal key={member.no} delay={i * 0.15}>
            <OrgCard member={member} />
          </Reveal>
        ))}
      </section>

      {/* ================================================================
          4) 하단 CTA — KPSC 워터마크
          ================================================================ */}
      <Reveal as="section" className="mt-24 lg:mt-32">
        <div className="relative overflow-hidden rounded-2xl bg-ink-900 p-10 text-center lg:p-20">
          {/* 배경 워터마크 텍스트 */}
          <span
            aria-hidden
            className="serif-italic pointer-events-none absolute inset-x-0 bottom-0 text-[120px] leading-none font-bold text-white opacity-[0.05] lg:text-[200px]"
          >
            KPSC
          </span>

          <h2 className="relative text-[22px] font-bold text-white lg:text-[30px]">
            함께 만드는 미래, 지금 시작하세요.
          </h2>
          <p className="relative mt-3 text-[15px] text-white/70">
            KPSC는 언제나 여러분의 제안과 참여를 기다립니다.
          </p>

          <Link
            href="/news/activities"
            className="group relative mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-[15px] font-semibold text-ink-900 transition-colors hover:bg-brand-600 hover:text-white"
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
