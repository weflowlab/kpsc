/* Payload REST API (/api/*). 관리자 UI 와 외부 연동이 사용한다. */
import config from "@payload-config";
import "@payloadcms/next/css";
import { REST_DELETE, REST_GET, REST_OPTIONS, REST_PATCH, REST_POST, REST_PUT } from "@payloadcms/next/routes";

export const GET = REST_GET(config);
export const POST = REST_POST(config);
export const DELETE = REST_DELETE(config);
export const PATCH = REST_PATCH(config);
export const PUT = REST_PUT(config);
export const OPTIONS = REST_OPTIONS(config);

// Vercel 서버리스 함수 최대 실행 시간. 한동안 요청이 없다가 처음 들어오면 Payload 초기화 + DB(Neon) 깨어남으로 기본 제한을 넘겨 504 가 날 수 있다
export const maxDuration = 60;
