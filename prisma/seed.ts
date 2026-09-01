/* ==========================================================================
   시드 스크립트 — 하드코딩되어 있던 게시판 데이터와 약관을 DB 로 이관한다.
   실행: npx tsx prisma/seed.ts
   - 게시글 id 는 원본 uid 를 그대로 사용해 기존 URL(/news/notice/59 등)을
     보존하고, 시퀀스를 max(id)+1 로 맞춘다
   - 이미 글이 있으면 건너뛴다(재실행 안전)
   ========================================================================== */

import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { NOTICE, ACTIVITIES } from "../lib/content/board";
import { POST_CONTENTS } from "../lib/content/board-contents";
import { PRIVACY_POLICY, TERMS_OF_SERVICE } from "../lib/content/terms";

const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL }),
});

/* "26.07.07" → 2026-07-07 09:00 KST (시각 정보가 없어 오전 9시로 통일) */
function parseDate(yymmdd: string): Date {
  const [yy, mm, dd] = yymmdd.split(".").map(Number);
  return new Date(Date.UTC(2000 + yy, mm - 1, dd, 0, 0, 0));
}

async function main() {
  const existing = await prisma.post.count();
  if (existing > 0) {
    console.log(`이미 게시글 ${existing}건이 있어 게시글 시드는 건너뜁니다.`);
  } else {
    const rows = [
      ...NOTICE.posts.map((p) => ({ boardKey: "notice", post: p })),
      ...ACTIVITIES.posts.map((p) => ({ boardKey: "activities", post: p })),
    ];

    for (const { boardKey, post } of rows) {
      /* 본문: 스크래핑한 HTML > 리스트 데이터의 줄단위 본문 > 빈 값 순으로 사용 */
      const contentHtml =
        POST_CONTENTS[post.uid] ??
        (post.content ? post.content.map((l) => `<div>${l || "<br>"}</div>`).join("") : "");

      await prisma.post.create({
        data: {
          id: post.uid, // 원본 uid 를 그대로 써서 URL 보존
          boardKey,
          category: post.category,
          title: post.title,
          contentHtml,
          authorName: post.author,
          hit: post.hit,
          createdAt: parseDate(post.date),
        },
      });
    }
    /* 명시적 id insert 후 시퀀스 보정 */
    await prisma.$executeRawUnsafe(
      `SELECT setval(pg_get_serial_sequence('posts','id'), (SELECT MAX(id) FROM posts))`
    );
    console.log(`게시글 ${rows.length}건 이관 완료.`);
  }

  /* 약관/개인정보 — 없을 때만 넣는다 (관리자에서 수정한 값 보호) */
  for (const [key, value] of [
    ["terms", TERMS_OF_SERVICE],
    ["privacy", PRIVACY_POLICY],
  ] as const) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: {},
      create: { key, value },
    });
  }
  console.log("약관/개인정보 설정 시드 완료.");

  /* 기존 하드코딩 팝업(KPSC 안내) — 원본 관리자의 등록값과 동일한 기간 */
  const popupCount = await prisma.popup.count();
  if (popupCount === 0) {
    await prisma.popup.create({
      data: {
        title: "KPSC 안내",
        startDate: new Date(Date.UTC(2026, 6, 4)),
        endDate: new Date(Date.UTC(2100, 6, 4)),
        hideToday: true,
        pcImage: "/images/popup.webp",
      },
    });
    console.log("기본 팝업(KPSC 안내) 시드 완료.");
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
