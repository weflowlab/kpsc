// 글 조회수 +1 (components/blog/post/ViewCounter 가 호출). "가장 많이 본 글" 순위에 쓰인다.
import { incrementViews } from "@/lib/payload";

export async function POST(req: Request): Promise<Response> {
  let id: unknown;
  try {
    ({ id } = await req.json());
  } catch {
    return new Response(null, { status: 400 });
  }
  if (typeof id !== "number") return new Response(null, { status: 400 });
  try {
    await incrementViews(id);
  } catch {
    return new Response(null, { status: 404 });
  }
  return new Response(null, { status: 204 });
}

// Vercel 서버리스 함수 최대 실행 시간. 한동안 요청이 없다가 처음 들어오면 Payload 초기화 + DB(Neon) 깨어남으로 기본 제한을 넘겨 504 가 날 수 있다
export const maxDuration = 60;
