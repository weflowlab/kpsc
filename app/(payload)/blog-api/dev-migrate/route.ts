// 개발 전용: migrations/ 의 미적용 마이그레이션을 현재 DATABASE_URI 에 적용한다 (운영 Neon 에 로컬에서 시드를 돌리기 전 등).
// 사용: `PAYLOAD_MIGRATING=true npx next dev` 로 띄운 뒤 `curl http://localhost:3000/api/dev-migrate`
import { getPayload } from "payload";
import config from "@payload-config";
import { migrations } from "@/migrations";

export async function GET(): Promise<Response> {
  if (process.env.NODE_ENV === "production") return new Response("Not available", { status: 404 });
  if (!process.env.DATABASE_URI?.startsWith("postgres")) return new Response("Postgres(DATABASE_URI) 일 때만 씁니다. SQLite 개발 DB 는 자동 반영됩니다.", { status: 400 });
  const payload = await getPayload({ config });
  await payload.db.migrate({ migrations: migrations as never });
  return new Response(`마이그레이션 적용 완료 (${migrations.length}개 등록, 미적용분만 실행)`);
}
