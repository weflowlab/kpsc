import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { SiteProvider } from "@/components/blog/SiteProvider";
import { LivePreviewListener } from "@/components/blog/LivePreviewListener";
import { BlogHeader } from "@/components/blog/layout/BlogHeader";
import { BlogMobileBar } from "@/components/blog/layout/BlogMobileBar";
import { getSiteData } from "@/lib/payload";
import { SITE } from "@/lib/site";

const BLOG_TITLE = `${SITE.name} 웹블로그`;

/** 블로그 메타: 탭 제목은 "화면 이름 | 푸른안과 웹블로그", RSS 는 /blog/rss.xml */
export const metadata: Metadata = {
  title: { default: BLOG_TITLE, template: `%s | ${BLOG_TITLE}` },
  description: `${SITE.name}가 전하는 이야기. 소식, 나눔·사회공헌, 여행, 파트너십 이야기를 웹블로그에서 만나보세요.`,
  alternates: { types: { "application/rss+xml": "/blog/rss.xml" } },
  openGraph: { type: "website", siteName: BLOG_TITLE, locale: "ko_KR" },
};

/** 블로그(/blog) 레이아웃: 홈페이지 헤더는 /blog 에서 숨고(components/layout/Header), 대신 남색 블로그 헤더 하나 + 본문. 푸터·퀵메뉴는 홈페이지 것을 같이 쓴다.
 *  병원 정보·카테고리는 Payload 에서 읽어 SiteProvider 로 내려 준다. */
export default async function BlogLayout({ children }: LayoutProps<"/blog">) {
  const [site, { isEnabled: isPreview }] = await Promise.all([getSiteData(), draftMode()]);

  return (
    <SiteProvider value={site}>
      <div className="blog-root">
        {/* 관리자 미리보기 중이면 저장할 때마다 새로고침 */}
        {isPreview && <LivePreviewListener />}
        <BlogHeader />
        {children}
        {/* 모바일 하단 고정 바: 바로 전화 / 상담 신청하기 */}
        <BlogMobileBar />
      </div>
    </SiteProvider>
  );
}
