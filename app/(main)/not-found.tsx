/* ==========================================================================
   404 — 페이지를 찾을 수 없음
   루트 레이아웃(헤더/푸터) 안에서 렌더링된다.
   헤더는 최상단에서 '투명 + 흰색 로고/메뉴'이므로, 이 페이지의 첫 화면을
   어두운 풀블리드 배경으로 깔아 헤더가 그 위에서 또렷이 보이게 한다.
   (다른 페이지의 히어로·서브 비주얼과 같은 원리)
   notFound() 호출 + 매칭되지 않는 모든 URL 에서 표시된다.
   ========================================================================== */

import Link from "next/link";

export default function NotFound() {
  /* 고정 헤더(메뉴바) 높이만큼 위를 띄우고 그 아래 영역에서 가운데 정렬 →
     메뉴바 바로 아래부터 콘텐츠가 시작하고 위/아래 간격이 같아진다.
     헤더 높이: 모바일 ≈102px(로고행+슬라이더) / 태블릿 ≈64px / 데스크톱 ≈130px */
  return (
    <section className="font-pretendard relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#0f172a] to-[#1e293b] px-6 pt-[102px] pb-0 text-center md:pt-[64px] lg:pt-[130px]">
      {/* 배경 워터마크 — 큰 세리프 KPSC (다른 페이지 CTA 박스와 동일 톤) */}
      <span
        aria-hidden
        className="serif-italic pointer-events-none absolute -right-8 -bottom-10 text-[12rem] leading-none text-white/[0.04] select-none md:text-[20rem]"
      >
        KPSC
      </span>

      <div className="relative z-10 flex -translate-y-[11px] flex-col items-center">
        {/* 큰 404 — Montserrat 워드마크 */}
        <p className="font-mont text-[84px] leading-none font-extrabold tracking-[-0.03em] text-white md:text-[140px]">
          404
        </p>

        {/* 포인트 라인 */}
        <span aria-hidden className="mt-6 block h-[2px] w-12 bg-[#6366f1]" />

        <h1 className="mt-8 text-[22px] font-bold text-white md:text-[28px]">
          페이지를 찾을 수 없습니다
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-[#94a3b8] md:text-[16px]">
          요청하신 페이지가 삭제되었거나 주소가 변경되었을 수 있습니다.
          <br className="hidden md:block" />
          아래 버튼으로 다시 시작해 보세요.
        </p>

        {/* 이동 버튼 */}
        <div className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-[15px] font-semibold text-[#0f172a] transition-colors hover:bg-[#6366f1] hover:text-white"
          >
            홈으로 돌아가기
          </Link>
          <Link
            href="/news/notice"
            className="inline-flex items-center justify-center rounded-full border border-white/30 px-8 py-4 text-[15px] font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
          >
            공지사항 보기
          </Link>
        </div>
      </div>
    </section>
  );
}
