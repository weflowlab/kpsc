/* ==========================================================================
   세션 관리 — jose 서명 JWT 를 httpOnly 쿠키에 저장하는 stateless 방식
   (Next.js 16 공식 authentication 가이드 패턴)
   페이로드에는 헤더 표시에 필요한 최소 정보(회원 id, 이름)만 담는다.
   ========================================================================== */

import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const SESSION_COOKIE = "kpsc_session";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7일

export type SessionPayload = {
  memberId: number;
  name: string;
};

function getKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET 환경변수가 설정되지 않았습니다.");
  return new TextEncoder().encode(secret);
}

/* 로그인/가입 성공 시 세션 쿠키 발급 */
export async function createSession(payload: SessionPayload) {
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(getKey());

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

/* 로그아웃 시 세션 쿠키 삭제 */
export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

/* 현재 요청의 세션 조회 — 없거나 위조/만료면 null */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getKey(), {
      algorithms: ["HS256"],
    });
    return {
      memberId: payload.memberId as number,
      name: payload.name as string,
    };
  } catch {
    return null;
  }
}
