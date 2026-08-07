/* ==========================================================================
   브랜드 아이콘 (카카오톡 채널 / 네이버 블로그)
   원본 사이트는 38×38 PNG 를 쓰는데 해상도가 낮아 확대하면 깨진다.
   여기서는 같은 형태를 인라인 SVG 로 다시 그려 어떤 크기에서도 선명하게 한다.
   ※ 공식 배포 에셋이 아닌 재현본이다. 정확한 브랜드 자산이 필요하면
     카카오/네이버 브랜드 리소스 페이지의 원본 파일로 교체할 것.
   브랜드 컬러: 카카오 #FEE500 / 심볼 #3C1E1E, 네이버 블로그 #03C75A
   ========================================================================== */

type IconProps = {
  /** 아이콘 한 변 크기(px) */
  size?: number;
  className?: string;
};

/* --------------------------------------------------------------------------
   카카오톡 채널 — 노란 원 + 갈색 말풍선
   -------------------------------------------------------------------------- */
export function KakaoIcon({ size = 40, className = "" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      role="img"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <circle cx="24" cy="24" r="24" fill="#FEE500" />
      {/* 말풍선 — 좌하단으로 꼬리가 뻗은 카카오톡 특유의 형태 */}
      <path
        fill="#3C1E1E"
        d="M24 12c-6.9 0-12.5 4.4-12.5 9.9 0 3.5 2.3 6.6 5.8 8.4-.26.94-.94 3.4-1.07 3.93-.17.66.24.65.5.47.2-.14 3.2-2.17 4.5-3.06.9.13 1.83.2 2.77.2 6.9 0 12.5-4.43 12.5-9.9S30.9 12 24 12z"
      />
    </svg>
  );
}

/* --------------------------------------------------------------------------
   네이버 블로그 — 초록 원 + 흰색 blog 워드마크
   (카카오 아이콘과 나란히 놓이므로 같은 원형으로 맞춘다)
   -------------------------------------------------------------------------- */
export function NaverBlogIcon({ size = 40, className = "" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      role="img"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <circle cx="24" cy="24" r="24" fill="#03C75A" />
      {/* blog 워드마크 */}
      <text
        x="24"
        y="24"
        textAnchor="middle"
        dominantBaseline="central"
        fill="#FFFFFF"
        fontSize="14"
        fontWeight="800"
        fontFamily="Pretendard, 'Apple SD Gothic Neo', Arial, sans-serif"
        letterSpacing="-0.6"
      >
        blog
      </text>
    </svg>
  );
}
