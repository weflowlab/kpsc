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

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target); // 1회만 재생
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
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
