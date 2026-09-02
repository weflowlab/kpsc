/* ==========================================================================
   전체 화면 로딩 오버레이 — 삭제/이동 등 처리 중 휠 스피너를 덮어 보여준다.
   (삭제 직후 이미 지워진 글의 404 가 잠깐 노출되는 것을 가린다)
   ========================================================================== */

export default function LoadingOverlay({ label }: { label?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center gap-3 bg-white/70 backdrop-blur-sm"
    >
      <span className="h-10 w-10 animate-spin rounded-full border-4 border-ink-200 border-t-brand-600" />
      {label && <span className="text-[14px] text-ink-500">{label}</span>}
    </div>
  );
}
