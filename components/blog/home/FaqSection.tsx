// 메인 페이지 "자주 묻는 질문" 섹션 (푸터 바로 위). 왼쪽 아이브로우 + 제목 + 안내, 오른쪽 아코디언.
import { FaqAccordion } from "@/components/blog/ui/FaqAccordion";
import { getClinic } from "@/lib/payload";
import { faq as defaultFaq } from "@/lib/homeDefaults"; // 글로벌의 FAQ 가 비어 있을 때의 기본값
import type { FaqItem } from "@/lib/types";

type Props = { items?: FaqItem[] }; // HomeContent.faq

export async function FaqSection({ items }: Props) {
  const clinic = await getClinic();
  const faqItems = items && items.length > 0 ? items : defaultFaq(clinic);

  return (
    <section aria-labelledby="home-faq-title" className="py-16 md:py-24">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-site-4xl">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-16">
          {/* 왼쪽: 아이브로우 + 제목 + 안내 */}
          <div className="lg:col-span-4">
            <p className="text-sm font-semibold text-primary md:text-base">FAQ</p>
            <h2 id="home-faq-title" className="mt-1 text-2xl font-bold leading-tight md:text-3xl lg:text-4xl">
              자주 묻는 질문
            </h2>
            {/* Noto Sans KR 은 모두의안과 블로그의 Pretendard 보다 글자가 넓어, 같은 문구가 왼쪽 칸(4/12)에서 두 줄에 들어가려면 16px + 자간 살짝 좁힘 */}
            <p className="mt-3 whitespace-pre-line text-base leading-relaxed tracking-[-0.01em] text-neutral-600">
              {"자주 문의하시는 내용을 모았습니다.\n더 궁금한 점은 오른쪽 아래 퀵메뉴로 문의해 주세요."}
            </p>
          </div>
          {/* 오른쪽: 아코디언 */}
          <div className="lg:col-span-8">
            <FaqAccordion items={faqItems} className="divide-y divide-neutral-200 border-y border-neutral-200" />
          </div>
        </div>
      </div>
    </section>
  );
}
