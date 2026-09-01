/* ==========================================================================
   날짜/시간 표시 헬퍼 — DB 는 UTC 로 저장되므로 화면 표시는 항상 KST(+9)로
   변환한다. (KST 는 서머타임이 없어 고정 오프셋 계산이 안전하다)
   ========================================================================== */

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

function toKst(d: Date): Date {
  return new Date(d.getTime() + KST_OFFSET_MS);
}

/** "2026-09-01" (KST 기준 날짜) */
export function kstDate(d: Date): string {
  return toKst(d).toISOString().slice(0, 10);
}

/** "2026.09.01" */
export function kstDateDot(d: Date): string {
  return kstDate(d).replace(/-/g, ".");
}

/** "2026.09.01 14:52" */
export function kstDateTime(d: Date): string {
  return toKst(d).toISOString().slice(0, 16).replace("T", " ").replace(/-/g, ".");
}

/** 오늘 날짜 "2026-09-01" (KST 기준) */
export function kstToday(): string {
  return kstDate(new Date());
}
