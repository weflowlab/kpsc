/* ==========================================================================
   Prisma 7 설정 — 마이그레이션/스튜디오 등 CLI 가 사용할 DB 연결 정보.
   Prisma 7 은 .env 를 자동 로드하지 않으므로 dotenv 를 직접 불러온다.
   런타임(PrismaClient)은 lib/db.ts 의 Neon 어댑터가 담당한다.
   ========================================================================== */

import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    /* 마이그레이션은 advisory lock 을 쓰므로 PgBouncer(pooled) 연결에서
       타임아웃이 난다. CLI 는 Neon 직접 연결(-pooler 제거)을 쓴다.
       런타임(lib/db.ts)은 그대로 pooled 연결 사용. */
    url: env("DATABASE_URL").replace("-pooler.", "."),
  },
});
