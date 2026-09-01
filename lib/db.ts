/* ==========================================================================
   Prisma 클라이언트 싱글턴 (Prisma 7 + Neon 서버리스 어댑터)
   - Vercel 서버리스에서 WebSocket 기반 Neon 드라이버로 연결한다
   - 개발 모드 HMR 시 클라이언트가 매번 새로 생성되어 커넥션이 누적되는
     것을 막기 위해 globalThis 에 캐시한다 (Prisma 공식 권장 패턴)
   ========================================================================== */

import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient() {
  const adapter = new PrismaNeon({
    connectionString: process.env.DATABASE_URL,
  });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
