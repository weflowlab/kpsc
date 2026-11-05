// 개발 전용: 주제별 샘플 블로그 글 1개씩 시드 (메인페이지 콘텐츠 기반).
// 글(posts)은 mock 폴백이 없어 DB 에 있어야 보이므로, 카테고리·작성자·글을 Payload 로컬 API 로 생성한다.
// 사용: 개발 서버 실행 중 GET /blog-api/dev-seed-posts (멱등 — 이미 있으면 건너뜀)
import path from "path";
import config from "@payload-config";
import { getPayload } from "payload";

// ── Lexical richText 빌더 ──────────────────────────────
type Block = ["p" | "h2", string];
const textNode = (t: string) => ({ detail: 0, format: 0, mode: "normal", style: "", text: t, type: "text", version: 1 });
const node = ([kind, t]: Block) =>
  kind === "h2"
    ? { children: [textNode(t)], direction: "ltr", format: "", indent: 0, type: "heading", version: 1, tag: "h2" }
    : { children: t ? [textNode(t)] : [], direction: "ltr", format: "", indent: 0, type: "paragraph", version: 1, textFormat: 0, textStyle: "" };
const editor = (blocks: Block[]) => ({
  root: { children: blocks.map(node), direction: "ltr" as const, format: "" as const, indent: 0, type: "root", version: 1 },
});

// ── 주제별 샘플 글 (메인페이지 참고) ───────────────────
const CATEGORIES = [
  { slug: "news", name: "KPSC 소식", description: "KPSC의 새로운 소식과 공지를 전합니다.", order: 1 },
  { slug: "share", name: "나눔·사회공헌", description: "수익을 나누어 지역사회와 상생하는 나눔 이야기.", order: 2 },
  { slug: "travel", name: "여행 이야기", description: "KPSC여행사와 함께하는 여행 이야기.", order: 3 },
  { slug: "partners", name: "파트너", description: "KPSC와 함께 성장하는 파트너들의 이야기.", order: 4 },
];

const POSTS: { category: string; slug: string; title: string; summary: string; publishedAt: string; thumb: string; content: Block[] }[] = [
  {
    category: "news",
    slug: "kpsc-10-years",
    thumb: "images/hero/c_main_1.webp", // 메인 히어로 1번 (풍력)
    title: "믿음과 신뢰로 달려온 10년, KPSC 이야기",
    summary: "믿음과 신뢰로 성장해 온 성장형 브랜드 KPSC의 지난 10년과 앞으로의 방향을 전합니다.",
    publishedAt: "2026-10-28T09:00:00.000Z",
    content: [
      ["p", "KPSC는 믿음과 신뢰로 성장하는 성장형 브랜드입니다. 여러분과 함께 달려 온 10년, 여러 브랜드와 위플로우가 있어 한 걸음 더 성장하고 발전하고 있습니다."],
      ["h2", "함께 성장해 온 10년"],
      ["p", "단순 발전을 넘어 친환경 전환으로 지속 가능한 생태계를 구축하고, 여행 서비스와 여러 파트너와의 협력으로 더 나은 서비스를 만들어 왔습니다. KPSC와 함께한 파트너 분들과 위플로우에 진심으로 감사드립니다."],
      ["h2", "운영 안내"],
      ["p", "운영시간은 월~일 AM 09:00 ~ PM 06:00 이며, 금요일과 공휴일은 휴무입니다. 궁금한 점은 카카오톡 채널로 언제든 문의해 주세요."],
      ["p", "앞으로도 함께 성장하고, 함께 나누는 KPSC가 되겠습니다."],
    ],
  },
  {
    category: "share",
    slug: "sharing-with-community",
    thumb: "images/partners/k_main_banner_3.webp", // 메인 PARTNERS 카드 3번 (숲)
    title: "수익을 나누어 지역사회와 상생합니다",
    summary: "차세대 친환경 기술로 거둔 성과를 지역사회와 나누며 따뜻한 가치를 실천합니다.",
    publishedAt: "2026-10-21T09:00:00.000Z",
    content: [
      ["p", "KPSC는 미래 에너지를 선도하는 동시에, 그 수익을 나누어 지역사회와 상생하는 따뜻한 가치를 지향합니다."],
      ["h2", "나눔으로 잇는 상생"],
      ["p", "차세대 친환경 기술 혁신으로 만든 성과를 지역사회와 함께 나누고, 작은 실천이 모여 더 큰 변화를 만든다고 믿습니다. 일상 속 진정성 있는 실천으로 친환경 미래를 만들어갑니다."],
      ["h2", "함께 나누는 KPSC"],
      ["p", "믿음과 신뢰를 바탕으로 파트너와 함께 성장하며, 나눔과 사회공헌을 꾸준히 이어가겠습니다. 함께 성장하고, 함께 나누는 KPSC가 되겠습니다."],
    ],
  },
  {
    category: "travel",
    slug: "kpsc-travel-companion",
    thumb: "images/content/kpsc-travel-logo.webp", // KPSC여행사
    title: "KPSC여행사와 함께하는 아름다운 동행",
    summary: "KPSC의 또 다른 브랜드, KPSC여행사와 함께 떠나는 여행 이야기를 소개합니다.",
    publishedAt: "2026-10-14T09:00:00.000Z",
    content: [
      ["p", "KPSC여행사는 KPSC의 또 다른 브랜드로, 함께 성장하고 가치를 나누는 아름다운 동행을 만들어갑니다."],
      ["h2", "여행으로 잇는 인연"],
      ["p", "KPSC브랜드는 여행 서비스 제공과 여러 파트너와의 협력을 통해 여러분에게 더 나은 서비스를 제공합니다. 길 위에서 만나는 작은 순간들이 모여 오래 기억될 여정이 됩니다."],
      ["h2", "함께 떠나는 여행"],
      ["p", "믿음과 신뢰를 바탕으로, 여러분과 함께하는 편안하고 특별한 여행을 준비하겠습니다. 다양한 여행 이야기를 블로그에서 계속 전해 드릴게요."],
    ],
  },
  {
    category: "partners",
    slug: "growing-with-partners",
    thumb: "images/partners/k_main_banner_4.webp", // 메인 PARTNERS 카드 4번 (태양광)
    title: "위플로우와 파트너, 함께 성장하는 KPSC",
    summary: "여러 브랜드·위플로우·파트너와 협력하여 더 나은 가치를 만들어가는 KPSC의 파트너십.",
    publishedAt: "2026-10-07T09:00:00.000Z",
    content: [
      ["p", "KPSC는 여러 브랜드와 위플로우가 있어 한 걸음 더 성장하고 발전하고 있습니다. 올바른 방향으로 파트너의 성공을 지원합니다."],
      ["h2", "협력으로 만드는 가치"],
      ["p", "태양광, 풍력, 효율적인 에너지 저장 시스템(ESS) 구축을 통해 안전하고 혁신적인 맞춤형 에너지 솔루션을 제공하며, 확고한 책임 경영과 투명한 운영으로 파트너와 함께 성장합니다."],
      ["h2", "함께라서 가능한 성장"],
      ["p", "KPSC와 함께한 파트너 분들과 위플로우에 진심으로 감사드립니다. 앞으로도 여러 파트너와 협력하여 더 나은 가치를 전하겠습니다."],
    ],
  },
];

export async function GET(): Promise<Response> {
  if (process.env.NODE_ENV === "production") return new Response("Not available", { status: 404 });
  const payload = await getPayload({ config });
  const log: string[] = [];

  // 카테고리 (없으면 생성)
  const catId: Record<string, number> = {};
  for (const c of CATEGORIES) {
    const found = await payload.find({ collection: "categories", where: { slug: { equals: c.slug } }, limit: 1 });
    if (found.docs[0]) {
      catId[c.slug] = found.docs[0].id;
      log.push(`category skip: ${c.slug}`);
    } else {
      const doc = await payload.create({ collection: "categories", data: c });
      catId[c.slug] = doc.id;
      log.push(`category created: ${c.slug}`);
    }
  }

  // 작성자 (없으면 생성)
  let authorId: number;
  const foundAuthor = await payload.find({ collection: "doctors", where: { slug: { equals: "kpsc" } }, limit: 1 });
  if (foundAuthor.docs[0]) {
    authorId = foundAuthor.docs[0].id;
    // 화면에는 "이름 직함" 으로 나온다 → 이름 "KPSC" + 직함 "운영팀" ("KPSC 운영팀 운영팀" 중복 방지)
    if (foundAuthor.docs[0].name !== "KPSC") {
      await payload.update({ collection: "doctors", id: authorId, data: { name: "KPSC" } });
      log.push("author renamed: KPSC");
    } else log.push("author skip: kpsc");
  } else {
    const doc = await payload.create({
      collection: "doctors",
      data: { name: "KPSC", slug: "kpsc", title: "운영팀", bio: "KPSC의 소식과 이야기를 전합니다." },
    });
    authorId = doc.id;
    log.push("author created: kpsc");
  }

  // 썸네일: 메인페이지 사진(public/images)을 이미지 컬렉션에 올린다
  const uploadThumb = async (file: string, alt: string) => {
    const doc = await payload.create({ collection: "media", data: { alt }, filePath: path.resolve(process.cwd(), "public", file) });
    return doc.id;
  };

  // 글 (없으면 생성, 있는데 썸네일이 없으면 썸네일만 채움)
  for (const p of POSTS) {
    const found = await payload.find({ collection: "posts", where: { slug: { equals: p.slug } }, limit: 1 });
    const existing = found.docs[0];
    if (existing) {
      if (existing.thumbnail) {
        log.push(`post skip: ${p.slug}`);
        continue;
      }
      const thumbnail = await uploadThumb(p.thumb, p.title);
      await payload.update({ collection: "posts", id: existing.id, data: { thumbnail, _status: "published" } });
      log.push(`post thumbnail added: ${p.slug}`);
      continue;
    }
    const thumbnail = await uploadThumb(p.thumb, p.title);
    await payload.create({
      collection: "posts",
      data: {
        title: p.title,
        slug: p.slug,
        category: catId[p.category],
        author: authorId,
        thumbnail,
        summary: p.summary,
        publishedAt: p.publishedAt,
        content: editor(p.content),
        _status: "published",
      },
    });
    log.push(`post created: ${p.slug}`);
  }

  return new Response(log.join("\n") + "\n\n완료: /blog 에서 확인하세요.", { headers: { "content-type": "text/plain; charset=utf-8" } });
}
