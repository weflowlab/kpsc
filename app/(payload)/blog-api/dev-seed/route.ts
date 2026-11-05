// 개발 전용 시드: 첫 관리자 계정, 병원 정보·블로그 메인 기본 문구, 카테고리·의료진(lib/mock.ts ← lib/site.ts·lib/doctors.ts), 주제별 글 4편(lib/articles.ts) + 본보기 글(lib/samplePost.ts).
// 사용: 개발 서버 실행 중 `npm run seed` (GET /api/dev-seed). 여러 번 실행해도 안전하다:
//   - 카테고리·의료진은 없을 때만 만들고, 글은 slug 로 찾아 내용만 덮어쓴다 (사진·조회수·발행일 유지). 사진은 비어 있을 때만 스톡 사진으로 채운다.
//   - 병원 정보는 매번 lib/site.ts 기준으로 맞추고(글 하단 문구는 비어 있을 때만), 블로그 메인은 비어 있는 문구만 채운다.
// 운영 DB 에는 절대 실행하지 않는다 (NODE_ENV=production 이면 404).
import { getPayload, type Payload } from "payload";
import config from "@payload-config";
import { clinic, categories, doctors, popularKeywords } from "@/lib/mock";
import * as homeDefaults from "@/lib/homeDefaults";
import * as clinicDefaults from "@/lib/clinicDefaults";
import { samplePost } from "@/lib/samplePost";
import { articles, type Article } from "@/lib/articles";
import path from "path";
import fs from "fs/promises";

// 블로그 메인 배너 스톡 사진 (public/images/stock, Pexels 무료). 배너 순서대로. 병원 사진을 받으면 관리자에서 교체
const BANNER_STOCK = [
  { file: "consult.webp", alt: "진료실에서 상담하는 의료진" },
  { file: "exam-slitlamp.webp", alt: "세극등 현미경으로 눈을 검사하는 모습" },
];

// 파일명으로 이미지를 찾고, 없으면 public/images/stock 의 파일을 올린다 → media id
async function stockMediaId(payload: Payload, context: Record<string, unknown>, file: string, alt: string): Promise<number | null> {
  const found = await payload.find({ collection: "media", where: { filename: { equals: file } }, limit: 1, depth: 0 });
  if (found.docs[0]) return found.docs[0].id;
  try {
    const data = await fs.readFile(path.resolve(process.cwd(), "public/images/stock", file));
    // context 는 호출마다 새 객체로 (Blob 플러그인이 req.context 에 업로드 건너뛰기 표시를 남기는 일이 있다)
    const doc = await payload.create({ collection: "media", context: { ...context }, file: { data, name: file, mimetype: "image/webp", size: data.byteLength }, data: { alt } });
    return doc.id;
  } catch (e) {
    payload.logger.warn(`스톡 사진 올리기 실패: ${file} — ${(e as Error).message}`);
    return null;
  }
}

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || "admin@pureun-eye.kr";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || "pureun1234!";

// 글 한 편을 넣거나 갱신한다 (lib/articles.ts 4편 + 본보기 글). slug 로 찾아 있으면 내용만 덮어쓰고(사진·조회수·발행일 유지), 없으면 새로 만든다.
// 사진(썸네일·상단 슬라이드)은 비어 있을 때만 public/images/stock 의 스톡 사진으로 채운다. 관련 글은 모든 글의 id 가 정해진 뒤 2차로 넣는다.
async function upsertPost(payload: Payload, context: Record<string, unknown>, a: Article, order: number): Promise<{ id: number; log: string }> {
  const [cat, doc] = await Promise.all([
    payload.find({ collection: "categories", where: { slug: { equals: a.categorySlug } }, limit: 1, depth: 0 }),
    payload.find({ collection: "doctors", where: { slug: { equals: a.authorSlug } }, limit: 1, depth: 0 }),
  ]);
  const category = cat.docs[0]?.id;
  const author = doc.docs[0]?.id;
  if (!category || !author) throw new Error(`${a.slug}: 카테고리(${a.categorySlug}) 또는 의료진(${a.authorSlug}) 없음`);

  const data = {
    _status: "published" as const,
    title: a.title,
    slug: a.slug,
    category,
    author,
    summary: a.summary,
    keyPoints: a.keyPoints.map((text) => ({ text })),
    content: a.content as never,
    faq: a.faq,
    sources: a.sources,
    tags: a.tags.map((tag) => ({ tag })),
  };
  const existing = (await payload.find({ collection: "posts", where: { slug: { equals: a.slug } }, limit: 1, depth: 0 })).docs[0];

  // 스톡 사진: 비어 있을 때만 (이미지 문서가 지워져 image 가 빈 슬라이드 행은 없는 것으로 친다)
  const thumbnail = existing?.thumbnail ? undefined : await stockMediaId(payload, context, a.thumbnail, a.title);
  const hasImages = (existing?.images ?? []).some((i) => i.image);
  const imageIds = hasImages ? [] : (await Promise.all(a.images.map((file) => stockMediaId(payload, context, file, a.title)))).filter((id): id is number => id !== null);
  const photos = { ...(thumbnail ? { thumbnail } : {}), ...(imageIds.length ? { images: imageIds.map((image) => ({ image })) } : {}) };

  if (existing) {
    await payload.update({ collection: "posts", id: existing.id, context, draft: false, data: { ...data, ...photos } });
    return { id: existing.id, log: `갱신 /blog/${a.categorySlug}/${a.slug}` };
  }
  const publishedAt = new Date(Date.now() - order * 86400000).toISOString(); // 하루씩 간격을 둔 발행일
  const created = await payload.create({ collection: "posts", context, draft: false, data: { ...data, ...photos, publishedAt, views: a.views } });
  return { id: created.id, log: `생성 /blog/${a.categorySlug}/${a.slug}` };
}

// 본보기 글(lib/samplePost.ts)도 같은 모양으로. 사진은 스톡, 관련 글은 망막·백내장 글
const sampleArticle: Article = {
  ...samplePost,
  related: ["floaters-when-to-worry-retinal-detachment", "cataract-surgery-timing-and-iol"],
  thumbnail: "senior-couple-2.webp",
  images: ["exam-slitlamp.webp", "eye-warm.webp"],
  views: 120,
};

// GET /api/dev-seed?reset=home → 블로그 메인 문구(히어로·소개·장점·FAQ)를 lib/homeDefaults.ts 기본값으로 되돌린다 (배너 이미지·관리자 수정값 무시)
export async function GET(req: Request): Promise<Response> {
  if (process.env.NODE_ENV === "production") return new Response("Not available", { status: 404 });
  const resetHome = new URL(req.url).searchParams.get("reset") === "home";
  const payload = await getPayload({ config });
  const context = { disableRevalidate: true, seed: true }; // 페이지 재생성 폭주 방지
  const log: string[] = [];

  // 1) 첫 관리자 계정
  const users = await payload.find({ collection: "users", limit: 1 });
  if (users.totalDocs === 0) {
    await payload.create({ collection: "users", data: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD, name: "관리자" } });
    log.push(`관리자 계정 생성: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
  }

  // 2) 병원 정보 글로벌 (글 하단 문구 3개는 비어 있을 때만 기본 문구로 채운다)
  const savedClinic = await payload.findGlobal({ slug: "clinic", depth: 0 });
  await payload.updateGlobal({
    slug: "clinic",
    context,
    data: {
      disclaimerText: savedClinic.disclaimerText || clinicDefaults.DISCLAIMER_TEXT,
      ctaTitle: savedClinic.ctaTitle || clinicDefaults.CTA_TITLE,
      ctaText: savedClinic.ctaText || clinicDefaults.ctaText(clinic.name),
      name: clinic.name,
      nameEn: clinic.nameEn,
      homepageUrl: clinic.homepageUrl,
      address: clinic.address,
      phone: clinic.phone,
      fax: clinic.fax,
      businessNumber: clinic.businessNumber,
      representatives: clinic.representatives.map((value) => ({ value })),
      stats: clinic.stats,
      statsNote: clinic.statsNote,
      hours: clinic.hours,
      directions: clinic.directions,
      parking: clinic.parking.map((value) => ({ value })),
      mapLinks: clinic.mapLinks,
      consultUrl: clinic.consultUrl,
      kakaoChannelUrl: clinic.kakaoChannelUrl,
      sns: clinic.sns,
      legalLinks: clinic.legalLinks,
      homepageMenu: clinic.homepageMenu,
    },
  });
  log.push("병원 정보 저장");

  // 3) 블로그 메인 글로벌: 비어 있는 문구만 기본 문구(lib/homeDefaults.ts)로 채운다. 관리자가 이미 고친 값과 배너 이미지는 그대로 둔다.
  const saved = await payload.findGlobal({ slug: "home", depth: 0 });
  const home = resetHome ? { ...saved, heroTitle: "", heroText: "", searchPlaceholder: "", popularKeywords: [], doctorsTitle: "", doctorsText: "", doctorsButton: "", doctorsLink: "", summaryTitle: "", summaryText: "", keyPoints: [], faq: [] } : saved;
  const bannerRows = home.banners?.length ? home.banners : homeDefaults.BANNERS.map((b) => ({ ...b, image: null, mobileImage: null }));
  const banners = [];
  for (const [i, b] of bannerRows.entries()) {
    const d = homeDefaults.BANNERS[i % homeDefaults.BANNERS.length];
    // 이미지가 비어 있으면 스톡 사진으로 채운다 (관리자가 올린 사진은 그대로)
    const stock = BANNER_STOCK[i % BANNER_STOCK.length];
    const image = b.image ?? (await stockMediaId(payload, context, stock.file, stock.alt));
    banners.push({ ...b, label: b.label || d.label, text: b.text || d.text, image });
  }
  await payload.updateGlobal({
    slug: "home",
    context,
    draft: false,
    data: {
      _status: "published",
      heroTitle: home.heroTitle || homeDefaults.heroTitle(clinic),
      heroText: home.heroText || homeDefaults.HERO_TEXT,
      searchPlaceholder: home.searchPlaceholder || homeDefaults.SEARCH_PLACEHOLDER,
      popularKeywords: home.popularKeywords?.length ? home.popularKeywords : popularKeywords.map((value) => ({ value })),
      banners,
      doctorsTitle: home.doctorsTitle || homeDefaults.doctorsTitle(clinic),
      doctorsText: home.doctorsText || homeDefaults.DOCTORS_TEXT,
      doctorsButton: home.doctorsButton || homeDefaults.DOCTORS_BUTTON,
      doctorsLink: home.doctorsLink || homeDefaults.DOCTORS_LINK,
      summaryTitle: home.summaryTitle || homeDefaults.SUMMARY_TITLE,
      summaryText: home.summaryText || homeDefaults.summaryText(clinic),
      keyPoints: home.keyPoints?.length ? home.keyPoints : homeDefaults.KEY_POINTS.map(({ title, text }) => ({ title, value: text })),
      faq: home.faq?.length ? home.faq : homeDefaults.faq(clinic),
    },
  });
  log.push(resetHome ? "블로그 메인 문구를 기본값으로 되돌림" : "블로그 메인 저장 (비어 있던 문구를 기본 문구로 채움)");

  // 4) 카테고리 / 의료진: slug 로 찾아 없을 때만 만든다 (관리자가 고친 내용과 사진은 보존)
  let newCategories = 0;
  for (const [i, c] of categories.entries()) {
    const found = await payload.find({ collection: "categories", where: { slug: { equals: c.slug } }, limit: 1, depth: 0 });
    if (!found.docs[0]) {
      await payload.create({ collection: "categories", context, data: { name: c.name, slug: c.slug, description: c.description, order: i } });
      newCategories++;
    }
  }
  let newDoctors = 0;
  for (const [i, d] of doctors.entries()) {
    const found = await payload.find({ collection: "doctors", where: { slug: { equals: d.slug } }, limit: 1, depth: 0 });
    if (!found.docs[0]) {
      await payload.create({
        collection: "doctors",
        context,
        data: {
          name: d.name,
          slug: d.slug,
          title: d.title,
          bio: d.bio,
          specialties: d.specialties.map((value) => ({ value })),
          career: d.career.map((value) => ({ value })),
          order: i,
        },
      });
      newDoctors++;
    }
  }
  log.push(`카테고리 ${categories.length}개 (새로 만든 것 ${newCategories}), 의료진 ${doctors.length}명 (새로 만든 것 ${newDoctors})`);

  // 5) 글: 주제별 4편 + 본보기 글 (스톡 사진 연결 포함). 관련 글은 id 가 모두 정해진 뒤 2차로 연결
  const all = [...articles, sampleArticle];
  const postIds = new Map<string, number>();
  for (const [i, a] of all.entries()) {
    const r = await upsertPost(payload, context, a, i + 1);
    postIds.set(a.slug, r.id);
    log.push(`글 ${r.log}`);
  }
  for (const a of all) {
    const related = a.related.map((slug) => postIds.get(slug)).filter((id): id is number => id !== undefined);
    await payload.update({ collection: "posts", id: postIds.get(a.slug)!, context, draft: false, data: { related } });
  }
  log.push("관련 글 연결");

  return new Response(log.join("\n"));
}
