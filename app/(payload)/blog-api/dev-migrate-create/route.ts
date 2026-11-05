// 개발 전용: Postgres 마이그레이션 파일을 만든다 (migrations/{날짜}_{이름}.ts + .json 스냅샷 + index.ts).
// `payload migrate:create` CLI 가 이 환경에서 깨져서 Next 런타임 안에서 같은 함수를 호출한다.
// 사용: .env 의 DATABASE_URI 를 Postgres 주소로 두고 `PAYLOAD_MIGRATING=true npx next dev --port 3001` 로 띄운 뒤
//       `curl "http://localhost:3001/api/dev-migrate-create?name=이름"`. (PAYLOAD_MIGRATING=true 는 개발용 스키마 자동 반영(push)을 막는다)
// SQLite 로 띄우면 SQLite 용 마이그레이션이 만들어지므로 운영용은 반드시 Postgres 로.
import { getPayload } from "payload";
import config from "@payload-config";

export async function GET(req: Request): Promise<Response> {
  if (process.env.NODE_ENV === "production") return new Response("Not available", { status: 404 });
  const name = new URL(req.url).searchParams.get("name") || "migration";
  const payload = await getPayload({ config });
  await payload.db.createMigration({ migrationName: name, payload, forceAcceptWarning: true });
  return new Response(`마이그레이션 생성: ${payload.db.migrationDir}/*_${name}.ts`);
}
