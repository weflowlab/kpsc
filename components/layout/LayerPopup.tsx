"use client";

/* ==========================================================================
   레이어 팝업 (#PopUpWrap)
   원본 재현 포인트
   - 페이지 진입 시 자동 노출, 딤(#000 / opacity .7) 클릭 시 닫힘
   - "오늘 하루 안 보기" 선택 시 쿠키 thisLayerPop=done 을 1일간 저장
   - 원본은 PC/모바일 이미지를 분기하지만 실제 파일이 동일해 한 장만 사용
   ========================================================================== */

import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { POPUP_IMAGE } from "@/lib/images";

const COOKIE_KEY = "thisLayerPop";

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

/* 쿠키는 외부 저장소이므로 구독 대상이 없다 (변경 알림 불필요) */
const noopSubscribe = () => () => {};

export default function LayerPopup() {
  /* ------------------------------------------------------------------
     쿠키 확인 — 서버 렌더 시에는 항상 숨김, 하이드레이션 이후 실제 값 반영.
     effect 안에서 setState 하지 않도록 useSyncExternalStore 로 읽는다.
     ------------------------------------------------------------------ */
  const allowed = useSyncExternalStore(
    noopSubscribe,
    () => getCookie(COOKIE_KEY) !== "done",
    () => false
  );

  /* 사용자가 직접 닫았는지 여부 */
  const [dismissed, setDismissed] = useState(false);
  const open = allowed && !dismissed;

  /* 닫기 핸들러 */
  const setOpen = (next: boolean) => setDismissed(!next);

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
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  /* 오늘 하루 안 보기 — 쿠키 1일 저장 후 닫기 */
  const hideToday = () => {
    setCookie(COOKIE_KEY, "done", 1);
    setOpen(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="KPSC 안내 팝업"
      className="fixed inset-0 z-[19999] flex items-center justify-center px-4"
    >
      {/* 딤 배경 — 클릭 시 닫힘 */}
      <button
        type="button"
        aria-label="팝업 닫기"
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-black/70"
      />

      {/* 팝업 본체 */}
      <div className="relative w-full max-w-[720px] overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* 원본 /upload/...png — 대표 인사 카드 */}
        <Image
          src={POPUP_IMAGE}
          alt="KPSC 안내"
          width={1408}
          height={768}
          sizes="(max-width: 768px) 100vw, 720px"
          className="h-auto w-full"
          priority
        />

        {/* 하단 컨트롤 바 */}
        <div className="flex items-center justify-between bg-ink-900 px-4 py-2.5 text-[12px] text-white">
          <button type="button" onClick={hideToday} className="hover:underline">
            오늘 하루 열지 않기
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="font-semibold hover:underline"
          >
            닫기 ✕
          </button>
        </div>
      </div>
    </div>
  );
}
