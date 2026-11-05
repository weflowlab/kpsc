// 글 상세 본문. prose-content 래퍼 안에 상단 슬라이드 → 본문 순으로 렌더. 요약은 KeySummary(목차 위), FAQ 는 PostFaq 로 분리.
// 본문은 Payload 리치텍스트(post.content)가 있으면 RichTextContent 로, 없으면(목 데이터) sections HTML 로 그린다.
import type { Post } from "@/lib/types";
import { FaqAccordion } from "@/components/blog/ui/FaqAccordion";
import { PostImageSlider } from "./PostImageSlider";
import { RichTextContent } from "./RichTextContent";
import { PostSectionHeading } from "./PostSectionHeading";

export const FAQ_SECTION_ID = "faq";

type Props = { post: Post };

// 목 데이터(sections HTML) 렌더
function SectionsBody({ post }: Props) {
  return post.sections.map((section, i) => (
    <section key={section.id}>
      <PostSectionHeading id={section.id} number={i + 1} title={section.heading} />
      <div dangerouslySetInnerHTML={{ __html: section.html }} />
    </section>
  ));
}

export function PostBody({ post }: Props) {
  return (
    <div className="prose-content mt-8">
      {/* 본문 상단 이미지 슬라이드 (◀ ▶ 이동). 관리자가 올린 이미지가 없으면 그리지 않는다 */}
      <PostImageSlider images={post.images} />

      {/* 본문: Payload 리치텍스트 우선, 없으면 섹션 HTML. 첫 문단이 도입(리드) 역할을 한다 */}
      {post.content ? <RichTextContent content={post.content} className="mt-6" /> : <SectionsBody post={post} />}
    </div>
  );
}

// FAQ 섹션 (출처 다음에 배치). 목차의 마지막 항목이 여기로 연결된다. number 는 본문 섹션 수 + 1.
export function PostFaq({ post, number }: Props & { number: number }) {
  if (post.faq.length === 0) return null;
  return (
    <section className="prose-content">
      <PostSectionHeading id={FAQ_SECTION_ID} number={number} label="FAQ" title="자주 묻는 질문" />
      <FaqAccordion items={post.faq} className="mt-[22px]" />
    </section>
  );
}
