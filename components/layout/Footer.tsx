/* ==========================================================================
   푸터
   원본 .befooter-standard-footer 재현
   - 배경 #2A2D34, 라벨 #E4E6EB, 값 #B0B3B8, 구분선 #4B515D
   - PC 그리드 1fr 220px (align-items:flex-end), 모바일 세로 스택
   - 우측 바로가기는 테두리 버튼 형태, hover 시 화살표가 4px 이동 + opacity .4 → 1
   ========================================================================== */

import Link from "next/link";
import { COMPANY } from "@/lib/site-config";

/* 값 사이 세로 구분선 — 모바일에서는 숨기고 세로 스택으로 전환 */
function Divider() {
  return (
    <span aria-hidden className="hidden h-3 w-px bg-[#4B515D] sm:inline-block" />
  );
}

export default function Footer() {
  return (
    <footer className="font-pretendard mt-auto bg-[#2A2D34] pt-12 pb-28 lg:pt-16 lg:pb-28">
      <div className="container-narrow grid gap-12 lg:grid-cols-[1fr_220px] lg:items-end">
        {/* ================================================================
            좌측 — 로고 + 회사 정보 + 카피라이트
            ================================================================ */}
        <div className="flex flex-col gap-6">
          {/* 로고 (원본도 이미지가 아닌 텍스트 워드마크) */}
          <div className="font-mont text-[1.375rem] leading-relaxed font-extrabold tracking-[-0.5px] text-white lg:text-2xl">
            {COMPANY.name}
          </div>

          {/* 회사 정보 3줄 */}
          <div className="flex flex-col gap-2 text-[0.825rem] leading-relaxed text-[#B0B3B8] lg:text-[0.95rem]">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
              <span>
                <strong className="mr-2 font-semibold text-[#E4E6EB]">대표자명</strong>
                {COMPANY.ceo}
              </span>
            </div>

            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
              <span>
                <strong className="mr-2 font-semibold text-[#E4E6EB]">주소</strong>
                {COMPANY.address}
              </span>
            </div>

            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
              <span>
                <strong className="mr-2 font-semibold text-[#E4E6EB]">전화번호</strong>
                <a href={`tel:${COMPANY.tel}`} className="hover:text-white">
                  {COMPANY.tel}
                </a>
              </span>
              <Divider />
              <span>
                <strong className="mr-2 font-semibold text-[#E4E6EB]">이메일</strong>
                <a href={`mailto:${COMPANY.email}`} className="hover:text-white">
                  {COMPANY.email}
                </a>
              </span>
              <Divider />
              <span>
                <strong className="mr-2 font-semibold text-[#E4E6EB]">카톡</strong>
                <a
                  href="https://pf.kakao.com/_VqFIX"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="hover:text-white"
                >
                  KPSC 메인채널
                </a>
                <span aria-hidden className="mx-2 text-[#4B515D]">
                  ·
                </span>
                <a
                  href="https://pf.kakao.com/_KmtfX"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="hover:text-white"
                >
                  온라인파트너톡(KPSM)
                </a>
              </span>
            </div>

            {/* 카피라이트 */}
            <p className="mt-4 text-[0.8rem] text-[#4B515D]">{COMPANY.copyright}</p>
          </div>
        </div>

        {/* ================================================================
            우측 — 바로가기 텍스트 링크 2개
            ================================================================ */}
        <nav className="flex flex-col gap-3">
          {[
            { label: "KPSC 활동", href: "/news/activities" },
            { label: "공지사항 / 뉴스", href: "/news/notice" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center justify-between rounded-lg border border-[#4B515D] px-5 py-3.5 text-[0.9rem] text-[#B0B3B8] transition-colors hover:border-[#B0B3B8] hover:text-white"
            >
              {item.label}
              <span
                aria-hidden
                className="opacity-40 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
              >
                ⟶
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
