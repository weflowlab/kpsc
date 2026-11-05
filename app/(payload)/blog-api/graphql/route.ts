/* Payload GraphQL 엔드포인트 */
import config from "@payload-config";
import { GRAPHQL_POST, REST_OPTIONS } from "@payloadcms/next/routes";

export const POST = GRAPHQL_POST(config);
export const OPTIONS = REST_OPTIONS(config);

// Vercel 서버리스 함수 최대 실행 시간. 한동안 요청이 없다가 처음 들어오면 Payload 초기화 + DB(Neon) 깨어남으로 기본 제한을 넘겨 504 가 날 수 있다
export const maxDuration = 60;
