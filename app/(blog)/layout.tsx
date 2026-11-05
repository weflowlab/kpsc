/* 블로그(/blog) 루트 레이아웃 — KPSC 사이트/관리자와 분리된 독립 루트.
   html/body + 전역 CSS(블로그 토큰 포함) 를 제공하고, 실제 블로그 헤더/본문은
   하위 app/(blog)/blog/layout.tsx 가 꾸민다. 푸터는 KPSC 홈페이지 것을 공유한다. */
import "../(main)/globals.css";
import Footer from "@/components/layout/Footer";

export default function BlogRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="h-full">
      <body className="flex min-h-full flex-col">
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
