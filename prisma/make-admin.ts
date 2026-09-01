/* ==========================================================================
   관리자 지정 스크립트 — 가입된 회원을 최고 관리자 등급으로 올린다.
   실행: npx tsx prisma/make-admin.ts <아이디>
   ========================================================================== */

import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const loginId = process.argv[2];
if (!loginId) {
  console.error("사용법: npx tsx prisma/make-admin.ts <아이디>");
  process.exit(1);
}

const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL }),
});

prisma.member
  .update({ where: { loginId }, data: { grade: "ADMIN" } })
  .then((m) => console.log(`'${m.loginId}' (${m.name}) 님을 최고 관리자로 지정했습니다.`))
  .catch(() => console.error(`'${loginId}' 회원을 찾을 수 없습니다.`))
  .finally(() => prisma.$disconnect());
