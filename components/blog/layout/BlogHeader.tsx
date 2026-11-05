"use client";
// 블로그 헤더. 블로그(/blog) 안에서는 홈페이지 헤더 대신 이 남색 띠 하나만 보인다 (components/layout/Header 가 /blog 에서 숨는다).
// 왼쪽: 흰 로고(블로그 홈) + 홈페이지 바로가기 / 오른쪽: 전체 글 + 카테고리(md 이상), 검색, 햄버거(모바일만 — 전체 메뉴 드로어)
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import { lockScroll } from "@/lib/scrollLock";
import { IconArrowRight, IconMenu2, IconSearch, IconX } from "@tabler/icons-react";
import { useSite } from "@/components/blog/SiteProvider";
import { Container } from "@/components/blog/ui/Container";
import { SearchBox } from "@/components/blog/layout/SearchBox";
import { BlogMenuSheet } from "@/components/blog/layout/BlogMenuSheet";

export function BlogHeader() {
  const { clinic, categories } = useSite();
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // 전체 메뉴 (햄버거)
  // 클라이언트 마운트 여부 (포털용). 서버 스냅샷은 false
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const nav = [
    { id: "posts", href: "/blog/posts", label: "전체 글" },
    ...categories.map((c) => ({ id: c.slug, href: `/blog/${c.slug}`, label: c.name })),
  ].map((n) => ({ ...n, active: isActive(n.href) }));

  // 경로가 바뀌면 열려 있던 패널 모두 닫기 (렌더 중 파생 상태 갱신)
  const [prevPath, setPrevPath] = useState(pathname);
  if (pathname !== prevPath) {
    setPrevPath(pathname);
    setSearchOpen(false);
    setMenuOpen(false);
  }

  // 전체 메뉴가 열리면 페이지 스크롤 잠금 (드로어 Sheet 도 같은 잠금을 걸지만 겹쳐도 안전하다)
  useEffect(() => {
    if (!menuOpen) return;
    return lockScroll();
  }, [menuOpen]);

  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // 검색과 메뉴는 동시에 열리지 않는다
  const toggleSearch = () => {
    setMenuOpen(false);
    setSearchOpen((v) => !v);
  };
  const toggleMenu = () => {
    setSearchOpen(false);
    setMenuOpen((v) => !v);
  };

  return (
    <>
      {/* sticky 남색 띠. 홈페이지 헤더(z 9999)는 /blog 에서 숨겨지므로 여기가 맨 위 */}
      <header className="sticky top-0 z-30 relative">
        <div className="bg-primary text-white">
          <Container size="4xl" className="flex h-16 items-center justify-between gap-3 md:gap-8 lg:h-20">
            {/* 왼쪽: 블로그 로고 + 홈페이지 바로가기 */}
            <div className="flex min-w-0 items-center gap-2 sm:gap-3 lg:gap-6">
              <Link href="/blog" aria-label="웹블로그 홈으로 이동" className="flex shrink-0 items-center">
                <Image src="/images/logo-white.webp" alt={`${clinic.name} 블로그`} width={188} height={60} loading="eager" className="relative -top-[3px] h-8 w-auto lg:-top-[2px] lg:h-10" />
              </Link>
              <Link
                href={clinic.homepageUrl || "/"}
                aria-label="홈페이지 바로가기"
                className="flex min-w-0 items-center gap-1.5 rounded-full border border-white/40 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-white hover:text-primary lg:gap-2 lg:px-6 lg:py-2.5 lg:text-base lg:tracking-[-0.18px]"
              >
                <span className="min-w-0 truncate">홈페이지 바로가기</span>
                <IconArrowRight className="size-2.5 shrink-0 lg:size-[15px]" stroke={2.5} />
              </Link>
            </div>

            {/* 오른쪽: 카테고리 메뉴(md 이상) + 검색 + 전체 메뉴 햄버거 */}
            <div className="flex h-full min-w-0 flex-1 items-center justify-end gap-2 md:gap-6 lg:gap-8">
              <nav className="hidden h-full min-w-0 flex-1 items-center justify-end gap-6 md:flex lg:gap-8 xl:gap-[clamp(1rem,5%,5rem)]">
                {nav.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`group relative flex min-w-0 max-w-30 shrink items-center py-1 text-sm font-semibold transition-colors lg:max-w-40 lg:text-base ${item.active ? "text-white" : "text-white/90 hover:text-white"}`}
                  >
                    <span className="block min-w-0 truncate">{item.label}</span>
                    {/* hover 시 가운데서 퍼지는 밑줄 */}
                    <div className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-white transition-all duration-300 group-hover:w-full" />
                    {/* 활성 밑줄 */}
                    {item.active && <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-white" />}
                  </Link>
                ))}
              </nav>
              <div className="flex shrink-0 items-center gap-1 md:gap-2">
                <button
                  type="button"
                  onClick={toggleSearch}
                  aria-label={searchOpen ? "검색 닫기" : "검색 열기"}
                  aria-expanded={searchOpen}
                  className="rounded-full p-2 text-white transition-colors hover:bg-white/15"
                >
                  <IconSearch className="size-6 lg:size-7" />
                </button>
                {/* 햄버거는 모바일(md 미만)에서만. PC 는 메뉴가 헤더에 다 있어 불필요 */}
                <button
                  type="button"
                  data-sheet-toggle
                  onClick={toggleMenu}
                  aria-label={menuOpen ? "전체 메뉴 닫기" : "전체 메뉴 열기"}
                  aria-expanded={menuOpen}
                  className="rounded-full p-2 text-white transition-colors hover:bg-white/15 md:hidden"
                >
                  {menuOpen ? <IconX className="size-7 lg:size-8" /> : <IconMenu2 className="size-7 lg:size-8" />}
                </button>
              </div>
            </div>
          </Container>
        </div>

        {/* 검색 패널: 헤더 아래에 덮어서 펼쳐짐(페이지를 밀지 않음) + 뒤쪽 어두운 배경(바깥 클릭 닫기) */}
        {searchOpen && (
          <>
            {mounted && createPortal(<div onClick={closeSearch} aria-hidden className="fixed inset-0 z-20 bg-black/40" />, document.body)}
            <SearchBox variant="header" showKeywords autoFocus onClose={closeSearch} />
          </>
        )}
      </header>

      {/* 전체 메뉴 드로어 (모바일): 블로그 카테고리 + 홈페이지·전화·상담 신청 */}
      <BlogMenuSheet open={menuOpen} onClose={closeMenu} />
    </>
  );
}
