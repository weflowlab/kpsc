"use client";

/* ==========================================================================
   스크롤 진입 애니메이션 래퍼
   원본은 AOS + IntersectionObserver 3벌이 섹션별로 따로 구현돼 있었으나,
   여기서는 하나의 옵저버로 통합했다. (threshold 0.1 / rootMargin -10%)
   ========================================================================== */

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

type RevealType = "fade-up" | "fade-up-sm" | "fade-left" | "fade-right" | "zoom-out";

type RevealProps = {
  children: ReactNode;
  /** 진입 효과 종류 */
  type?: RevealType;
  /** 지연 시간(초) — 원본 money 블록의 0.15초 stagger 패턴을 따른다 */
  delay?: number;
  /** 렌더링할 태그 */
  as?: ElementType;
  className?: string;
};

export default function Reveal({
  children,
  type = "fade-up",
  delay = 0,
  as: Tag = "div",
  className = "",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let done = false;

    /* 옵저버가 끝내 발화하지 않는 상황(예: 진입 팝업이 body 스크롤을 잠가
       첫 화면 아래 섹션이 교차 판정을 받지 못하는 경우)에 대비한 직접 검사.
       한 번이라도 화면 안에 들어와 있으면 그대로 노출한다. */
    const check = () => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.9 && rect.bottom > 0) show();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) show();
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(el);
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    /* 하이드레이션 직후 레이아웃이 잡힌 뒤 초기 위치를 한 번 보정 */
    const timer = window.setTimeout(check, 400);

    function show() {
      if (done) return;
      done = true; // 1회만 재생
      setVisible(true);
      cleanup();
    }

    function cleanup() {
      observer.disconnect();
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
      window.clearTimeout(timer);
    }

    return cleanup;
  }, []);

  return (
    <Tag
      ref={ref}
      data-reveal={type}
      className={`${visible ? "is-visible" : ""} ${className}`}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </Tag>
  );
}
