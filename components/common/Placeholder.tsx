/* ==========================================================================
   이미지 플레이스홀더
   원본 사이트의 실제 이미지를 대체하는 자리 표시 컴포넌트.
   어떤 성격의 이미지가 들어갈 자리인지 라벨로 명시한다.
   ========================================================================== */

type PlaceholderProps = {
  /** 이 자리에 들어갈 이미지 설명 (예: "풍력발전기 / 초원 2000×1059") */
  label: string;
  /** 추가 클래스 (크기·라운딩은 부모에서 지정) */
  className?: string;
  /** 어두운 배경 위에 올릴 때 사용 */
  dark?: boolean;
};

export default function Placeholder({
  label,
  className = "",
  dark = false,
}: PlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={`이미지 자리: ${label}`}
      className={[
        "relative flex h-full w-full items-center justify-center overflow-hidden",
        dark ? "bg-white/5 text-white/50" : "bg-ink-100 text-ink-400",
        className,
      ].join(" ")}
    >
      {/* 대각선 해칭 패턴 — 플레이스홀더임을 시각적으로 구분 */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, currentColor 0 1px, transparent 1px 12px)`,
          opacity: 0.12,
        }}
      />
      {/* 라벨 */}
      <div className="relative z-10 px-4 text-center">
        <div className="mb-1 text-[10px] font-semibold tracking-[0.2em] uppercase opacity-70">
          Image
        </div>
        <div className="text-xs leading-relaxed font-medium sm:text-sm">{label}</div>
      </div>
    </div>
  );
}
