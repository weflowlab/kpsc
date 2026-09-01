"use client";

/* ==========================================================================
   레이어 팝업 (#PopUpWrap)
   원본 재현 포인트
   - 페이지 진입 시 자동 노출, 딤(#000 / opacity .7) 클릭 시 닫힘
   - "오늘 하루 안 보기" 선택 시 쿠키 1일 저장 (팝업별로 따로 기억)
   - 팝업 데이터는 관리자(팝업창 관리)가 등록한 DB 목록을 /api/popups 로
     받아온다. 여러 개면 닫을 때마다 다음 팝업이 이어서 나온다.
   - PC/모바일 이미지 분기 (모바일 이미지가 없으면 PC 이미지 사용)
   ========================================================================== */

import { useEffect, useState } from "react";
import Image from "next/image";

type PopupData = {
  id: number;
  title: string;
  linkUrl: string | null;
  newWindow: boolean;
  hideToday: boolean;
  pcImage: string;
  mobImage: string | null;
};

const cookieKey = (id: number) => `kpsc_pop_${id}`;

/* 쿠키 조회 — 원본 getCookie() 대응 */
function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

/* 쿠키 저장 — 원본 setCookie(name, value, days) 대응 */
function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

export default function LayerPopup() {
  /* 노출할 팝업 큐 — 오늘 하루 안 보기 처리된 것은 제외 */
  const [queue, setQueue] = useState<PopupData[]>([]);

  useEffect(() => {
    fetch("/api/popups")
      .then((r) => (r.ok ? r.json() : []))
      .then((popups: PopupData[]) =>
        setQueue(popups.filter((p) => getCookie(cookieKey(p.id)) !== "done"))
      )
      .catch(() => {});
  }, []);

  const popup = queue[0] ?? null;
  const open = popup !== null;

  const closeCurrent = () => setQueue((q) => q.slice(1));

  /* 팝업이 열려 있는 동안 배경 스크롤 잠금 */
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  /* ESC 로 닫기 (원본에는 없던 접근성 보강) */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCurrent();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!popup) return null;

  /* 오늘 하루 안 보기 — 팝업별 쿠키 1일 저장 후 닫기 */
  const hideToday = () => {
    setCookie(cookieKey(popup.id), "done", 1);
    closeCurrent();
  };

  const img = (
    <>
      {/* PC 이미지 — 모바일 이미지가 있으면 768px 미만에서 교체 */}
      <Image
        src={popup.pcImage}
        alt={popup.title}
        width={1408}
        height={768}
        sizes="(max-width: 768px) 100vw, 720px"
        className={`h-auto w-full ${popup.mobImage ? "hidden md:block" : ""}`}
        priority
        unoptimized
      />
      {popup.mobImage && (
        <Image
          src={popup.mobImage}
          alt={popup.title}
          width={768}
          height={1024}
          sizes="100vw"
          className="h-auto w-full md:hidden"
          priority
          unoptimized
        />
      )}
    </>
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${popup.title} 팝업`}
      className="fixed inset-0 z-[19999] flex items-center justify-center px-4"
    >
      {/* 딤 배경 — 클릭 시 닫힘 */}
      <button
        type="button"
        aria-label="팝업 닫기"
        onClick={closeCurrent}
        className="absolute inset-0 bg-black/70"
      />

      {/* 팝업 본체 */}
      <div className="relative w-full max-w-[720px] overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* 클릭 시 이동 URL 이 있으면 링크로 감싼다 */}
        {popup.linkUrl ? (
          <a
            href={popup.linkUrl}
            target={popup.newWindow ? "_blank" : "_self"}
            rel={popup.newWindow ? "noreferrer noopener" : undefined}
          >
            {img}
          </a>
        ) : (
          img
        )}

        {/* 하단 컨트롤 바 */}
        <div className="flex items-center justify-between bg-ink-900 px-4 py-2.5 text-[12px] text-white">
          {popup.hideToday ? (
            <button type="button" onClick={hideToday} className="hover:underline">
              오늘 하루 열지 않기
            </button>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={closeCurrent}
            className="font-semibold hover:underline"
          >
            닫기 ✕
          </button>
        </div>
      </div>
    </div>
  );
}
