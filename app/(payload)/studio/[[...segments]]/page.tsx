/* Payload 관리자 화면. /admin 아래 모든 경로를 Payload 가 렌더한다. */
import type { Metadata } from "next";
import config from "@payload-config";
import { generatePageMetadata, RootPage } from "@payloadcms/next/views";
import { importMap } from "../importMap.js";

type Args = {
  params: Promise<{ segments: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] }>;
};

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams });

const Page = ({ params, searchParams }: Args) => RootPage({ config, importMap, params, searchParams });

export default Page;

// Vercel 서버리스 함수 최대 실행 시간. 한동안 요청이 없다가 처음 들어오면 Payload 초기화 + DB(Neon) 깨어남으로 기본 제한을 넘겨 504 가 날 수 있다
export const maxDuration = 60;
