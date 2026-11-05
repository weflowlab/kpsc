// 블로그 모바일 하단 고정 바: 바로 전화(흰색) / 문의하기(남색, 카카오채널) (md 미만에서만).
// 바 높이(56px)만큼 본문 아래 여백은 app/blog.css (body:has(.blog-root)) 가 준다.
import { IconMessageCircle, IconPhone } from "@tabler/icons-react";
import { SITE } from "@/lib/site";

export function BlogMobileBar() {
  const tel = `tel:${SITE.tel.replace(/[^0-9+]/g, "")}`;
  const inquiry = SITE.openChatUrl || SITE.kakaoUrl; // 오픈채팅 (없으면 메인 카카오채널)
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-2 bg-primary pb-[env(safe-area-inset-bottom)] md:hidden">
      <a href={tel} className="flex h-14 items-center justify-center gap-2 bg-white text-base font-bold text-primary active:bg-neutral-100">
        <IconPhone className="size-5 animate-wiggle motion-reduce:animate-none" />
        바로 전화
      </a>
      <a
        href={inquiry}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-14 items-center justify-center gap-2 bg-primary text-base font-bold text-white active:bg-brand-secondary"
      >
        <IconMessageCircle className="size-5 -translate-y-px animate-wiggle motion-reduce:animate-none" style={{ animationDelay: "1s" }} />
        <span className="relative -top-[2px]">문의하기</span>
      </a>
    </div>
  );
}
