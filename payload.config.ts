// Payload CMS 설정. 홈페이지와 블로그가 하나의 관리자(/admin)·REST API(/api)를 쓴다.
// 관리자 메뉴: 홈페이지(상담 문의·팝업) / 블로그(글·카테고리·의료진·블로그 메인) / 공통(이미지·병원 정보) / 설정(관리자 계정) / 통계(유입 관리)
// DB: 개발은 로컬 SQLite 파일, 운영은 DATABASE_URI 로 Postgres(Neon) 등에 연결.
import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { ko } from "@payloadcms/translations/languages/ko";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Categories } from "./collections/Categories";
import { Doctors } from "./collections/Doctors";
import { Posts } from "./collections/Posts";
import { PageViews } from "./collections/PageViews";
import { Inquiries } from "./collections/Inquiries";
import { Popups } from "./collections/Popups";
import { Clinic } from "./globals/Clinic";
import { HomePage } from "./globals/HomePage";
import { migrations } from "./migrations";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const ADMIN_TITLE = "KPSC 블로그 관리자";

export default buildConfig({
  // KPSC 본체(/admin, /api)와 겹치지 않도록 Payload 관리자/ API 경로를 분리한다.
  routes: { admin: "/studio", api: "/blog-api" },
  // 관리자 UI
  admin: {
    user: Users.slug,
    theme: "light", // 기기 다크 모드와 무관하게 항상 흰 화면 (계정 메뉴의 테마 선택도 사라진다)
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: `| ${ADMIN_TITLE}`,
      description: `${ADMIN_TITLE}입니다.`,
      icons: [{ rel: "icon", type: "image/x-icon", url: "/favicon.ico" }],
      openGraph: {
        title: ADMIN_TITLE,
        description: `${ADMIN_TITLE}입니다.`,
        siteName: "KPSC",
        images: [{ url: `${process.env.NEXT_PUBLIC_SERVER_URL || ""}/og-image.jpg`, width: 1200, height: 630, alt: "KPSC" }],
      },
    },
    // 미리보기 창 기기 크기 (글 작성 중 미리보기)
    livePreview: {
      breakpoints: [
        { label: "모바일", name: "mobile", width: 390, height: 844 },
        { label: "태블릿", name: "tablet", width: 820, height: 1180 },
        { label: "데스크톱", name: "desktop", width: 1440, height: 900 },
      ],
    },
  },
  // 관리자 UI 한국어. 기본 번역에서 조사가 어색한 문구("글를")는 조사가 필요 없는 형태로 바꾼다
  i18n: {
    supportedLanguages: { ko },
    fallbackLanguage: "ko",
    translations: {
      ko: {
        general: {
          aboutToDelete: "{{label}} <1>{{title}}</1> 항목을 삭제하려고 합니다. 계속하시겠습니까?",
          aboutToDeleteCount_one: "{{label}} {{count}}개를 삭제하려고 합니다.",
          aboutToDeleteCount_many: "{{label}} {{count}}개를 삭제하려고 합니다.",
          aboutToDeleteCount_other: "{{label}} {{count}}개를 삭제하려고 합니다.",
          deletedCountSuccessfully: "{{label}} {{count}}개를 삭제했습니다.",
          // 체크박스 값 표시 (목록 칸·필터). 기본 번역 "참/거짓" 은 어색하다
          true: "켜짐",
          false: "꺼짐",
        },
      },
    },
  },
  collections: [Inquiries, Popups, Posts, Categories, Doctors, Media, Users, PageViews],
  globals: [HomePage, Clinic],
  editor: lexicalEditor(),
  // 이메일 발송은 쓰지 않는다 (비밀번호 변경은 관리자 계정 메뉴에서, 분실 시 개발자가 재설정).
  // 어댑터를 비워 두면 매 요청마다 경고가 찍히므로 아무것도 보내지 않는 어댑터를 둔다.
  email: () => ({
    name: "none",
    defaultFromAddress: "noreply@pureun-eye.kr",
    defaultFromName: "푸른안과",
    sendEmail: async () => undefined,
  }),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
  // DB: DATABASE_URI 가 Postgres 주소(Neon)면 Postgres, 없으면 로컬 SQLite 파일(payload.db).
  db: process.env.DATABASE_URI?.startsWith("postgres")
    ? postgresAdapter({
        // KPSC(Prisma)는 public 스키마, 블로그(Payload)는 blog 스키마 → 같은 Neon DB 공유, 테이블 충돌 없음
        schemaName: "blog",
        pool: { connectionString: process.env.DATABASE_URI },
        // 운영(production)에서는 개발처럼 스키마를 자동으로 밀어 넣지 않는다. migrations/ 의 마이그레이션을 기동 때(onInit, 아래) 실행해 테이블을 만든다.
        // 스키마(collections/globals)를 바꾸면: 개발 서버를 Postgres 로 띄운 뒤 `npm run payload:migrate-create` 로 새 마이그레이션을 만들어 함께 커밋한다 (README 참고).
        // (prodMigrations 옵션 대신 onInit 에서 직접 돌린다: Next 빌드가 워커 여러 개로 Payload 를 동시에 띄우면 같은 마이그레이션이 동시에 실행돼 한쪽이 실패하므로 Postgres 잠금으로 줄 세운다)
        migrationDir: path.resolve(dirname, "migrations"),
      })
    : sqliteAdapter({
        client: { url: process.env.DATABASE_URI || "file:./payload.db", authToken: process.env.DATABASE_AUTH_TOKEN },
        // SQLite 는 쓰기 잠금이 하나뿐이라, 요청 하나가 트랜잭션 안에서 실패하면 잠금이 풀리지 않고 서버 전체가 멈추는 일이 있었다.
        transactionOptions: false,
      }),
  // 이미지 저장소: BLOB_READ_WRITE_TOKEN 이 있으면 Vercel Blob, 없으면 public/media (로컬 개발용)
  plugins: process.env.BLOB_READ_WRITE_TOKEN
    ? [
        vercelBlobStorage({
          // 공개 사이트라 접근 제어가 필요 없으니 이미지 주소를 Blob CDN 주소로 바로 쓴다 (Payload 서버를 거치지 않음)
          collections: { media: { disablePayloadAccessControl: true } },
          token: process.env.BLOB_READ_WRITE_TOKEN,
        }),
      ]
    : [],
  sharp,
  // 운영 마이그레이션: Postgres 조언 잠금(advisory lock)으로 한 번에 한 프로세스만 실행. 이미 적용된 것은 Payload 가 건너뛴다.
  onInit: async (payload) => {
    if (process.env.NODE_ENV !== "production" || !process.env.DATABASE_URI?.startsWith("postgres")) return;
    const db = payload.db as unknown as { pool: { connect: () => Promise<{ query: (q: string) => Promise<unknown>; release: () => void }> } };
    const client = await db.pool.connect();
    try {
      await client.query("select pg_advisory_lock(727001)"); // 다른 워커가 돌리는 중이면 끝날 때까지 기다린다
      await payload.db.migrate({ migrations: migrations as never });
    } finally {
      await client.query("select pg_advisory_unlock(727001)");
      client.release();
    }
  },
  // 프론트/미리보기에서 쓰는 공개 URL
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000",
});
