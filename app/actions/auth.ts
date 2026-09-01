/* ==========================================================================
   인증 서버 액션 — 회원가입 / 로그인 / 로그아웃 / 아이디 중복확인
   클라이언트 검증(원본 알럿 문구)은 페이지에 있지만, 서버 액션은 공개
   엔드포인트와 같으므로 여기서도 같은 규칙으로 다시 검증한다.
   ========================================================================== */

"use server";

import bcrypt from "bcryptjs";
import { headers } from "next/headers";
import { Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/db";
import { createSession, deleteSession } from "@/lib/session";

/* 접속로그 기록 — 로그인/가입 성공 시. 실패해도 로그인 흐름은 막지 않는다
   (원본 member.php?query=log 의 접속IP/Agent/접속시간) */
async function recordLoginLog(memberId: number) {
  try {
    const h = await headers();
    const ip =
      h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      h.get("x-real-ip") ||
      "unknown";
    const userAgent = h.get("user-agent") ?? "unknown";
    await prisma.loginLog.create({ data: { memberId, ip, userAgent } });
  } catch (e) {
    console.error("recordLoginLog failed:", e);
  }
}

/* 원본 규칙: 영문자로 시작하는 4~12자의 영문/숫자 조합 */
const LOGIN_ID_RE = /^[A-Za-z][A-Za-z0-9]{3,11}$/;

type ActionResult = { ok: true } | { ok: false; error: string };

/* --------------------------------------------------------------------------
   아이디 중복확인
   -------------------------------------------------------------------------- */
export async function checkLoginId(
  loginId: string
): Promise<{ available: boolean; message: string }> {
  if (!LOGIN_ID_RE.test(loginId)) {
    return {
      available: false,
      message:
        "ID/PW는 영문자로 시작하는 4~12자의 영문/숫자조합 공백없이 기입 해주세요.",
    };
  }

  const exists = await prisma.member.findUnique({
    where: { loginId },
    select: { id: true },
  });

  return exists
    ? { available: false, message: "이미 사용 중인 아이디입니다." }
    : { available: true, message: "사용 가능한 아이디입니다." };
}

/* --------------------------------------------------------------------------
   회원가입 — 성공 시 바로 세션을 발급한다(자동 로그인)
   -------------------------------------------------------------------------- */
export async function register(input: {
  name: string;
  loginId: string;
  password: string;
  email: string;
  phone1: string;
  phone2: string;
  phone3: string;
  remail: boolean;
}): Promise<ActionResult> {
  const name = input.name.trim();
  const email = input.email.trim();

  /* 서버측 재검증 — 클라이언트와 같은 규칙 */
  if (!name) return { ok: false, error: "이름이 입력되지 않았습니다." };
  if (!LOGIN_ID_RE.test(input.loginId))
    return {
      ok: false,
      error:
        "ID/PW는 영문자로 시작하는 4~12자의 영문/숫자조합 공백없이 기입 해주세요.",
    };
  if (input.password.length < 4 || input.password.length > 12)
    return { ok: false, error: "비밀번호는 4자 이상 12자 이하로 입력해 주세요." };
  if (email.length <= 6 || !email.includes("@") || !email.includes("."))
    return { ok: false, error: "이메일을 정확히 입력해 주세요." };
  if (
    !/^01[016789]$/.test(input.phone1) ||
    !/^\d{3,4}$/.test(input.phone2) ||
    !/^\d{4}$/.test(input.phone3)
  )
    return { ok: false, error: "휴대폰 번호를 정확히 입력해 주세요." };

  const hashed = await bcrypt.hash(input.password, 10);

  try {
    const member = await prisma.member.create({
      data: {
        loginId: input.loginId,
        password: hashed,
        name,
        email,
        phone: `${input.phone1}-${input.phone2}-${input.phone3}`,
        remail: input.remail,
      },
      select: { id: true, name: true },
    });

    await createSession({ memberId: member.id, name: member.name });
    await recordLoginLog(member.id);
    return { ok: true };
  } catch (e) {
    /* 중복확인과 가입 사이에 같은 아이디가 먼저 등록된 경우 (unique 충돌) */
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2002"
    )
      return { ok: false, error: "이미 사용 중인 아이디입니다." };

    console.error("register failed:", e);
    return { ok: false, error: "회원가입 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." };
  }
}

/* --------------------------------------------------------------------------
   로그인
   -------------------------------------------------------------------------- */
export async function login(input: {
  loginId: string;
  password: string;
}): Promise<ActionResult> {
  if (!input.loginId.trim())
    return { ok: false, error: "아이디를 입력해 주세요" };
  if (!input.password.trim())
    return { ok: false, error: "패스워드를 입력해 주세요" };

  try {
    const member = await prisma.member.findUnique({
      where: { loginId: input.loginId },
      select: { id: true, name: true, password: true, status: true },
    });

    /* 아이디 존재 여부를 구분해 알려주지 않는다 (계정 탐색 방지) */
    const valid =
      member && (await bcrypt.compare(input.password, member.password));
    if (!valid)
      return { ok: false, error: "아이디 또는 비밀번호가 일치하지 않습니다." };

    /* 승인 대기 계정은 로그인 차단 (관리자 회원 상세에서 승인 처리) */
    if (member.status !== "APPROVED")
      return { ok: false, error: "관리자 승인 대기 중인 계정입니다." };

    await createSession({ memberId: member.id, name: member.name });
    await recordLoginLog(member.id);
    return { ok: true };
  } catch (e) {
    console.error("login failed:", e);
    return { ok: false, error: "로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." };
  }
}

/* --------------------------------------------------------------------------
   아이디 찾기 — 이름 + 휴대폰(숫자만)이 일치하는 회원의 아이디를 돌려준다.
   같은 이름/번호로 가입한 계정이 여럿일 수 있어 배열로 반환한다.
   -------------------------------------------------------------------------- */
export async function findAccount(input: {
  name: string;
  phone: string; // 숫자만 (예: 01012345678)
}): Promise<{ ok: true; loginIds: string[] } | { ok: false; error: string }> {
  const name = input.name.trim();
  const phoneDigits = input.phone.replace(/\D/g, "");

  /* 원본 idpwsearch 모듈의 검증/알럿 문구를 그대로 사용 */
  if (name.length < 2) return { ok: false, error: "이름을 입력해 주세요." };
  if (!/^01[016789]\d{7,8}$/.test(phoneDigits))
    return {
      ok: false,
      error: "회원 가입시 등록 하셨던 이름 및 휴대폰 번호를 정확히 입력해 주세요.",
    };

  try {
    /* phone 은 "010-1234-5678" 형태로 저장되어 있어 숫자만 뽑아 비교한다 */
    const members = await prisma.member.findMany({
      where: { name },
      select: { loginId: true, phone: true },
    });
    const matched = members.filter(
      (m) => m.phone.replace(/\D/g, "") === phoneDigits
    );

    if (matched.length === 0)
      return { ok: false, error: "일치하는 데이터를 찾지 못했습니다." };

    return { ok: true, loginIds: matched.map((m) => m.loginId) };
  } catch (e) {
    console.error("findAccount failed:", e);
    return { ok: false, error: "조회 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." };
  }
}

/* --------------------------------------------------------------------------
   비밀번호 재설정 — 이름 + 휴대폰 + 아이디 세 가지가 모두 일치해야
   새 비밀번호로 교체한다 (메일 발송 없이 즉시 재설정하는 방식)
   -------------------------------------------------------------------------- */
export async function resetPassword(input: {
  name: string;
  phone: string; // 숫자만
  loginId: string;
  newPassword: string;
}): Promise<ActionResult> {
  const name = input.name.trim();
  const phoneDigits = input.phone.replace(/\D/g, "");

  if (input.newPassword.length < 4 || input.newPassword.length > 12)
    return { ok: false, error: "비밀번호는 4자 이상 12자 이하로 입력해 주세요." };

  try {
    const member = await prisma.member.findUnique({
      where: { loginId: input.loginId },
      select: { id: true, name: true, phone: true },
    });

    const valid =
      member &&
      member.name === name &&
      member.phone.replace(/\D/g, "") === phoneDigits;
    if (!valid)
      return { ok: false, error: "일치하는 데이터를 찾지 못했습니다." };

    const hashed = await bcrypt.hash(input.newPassword, 10);
    await prisma.member.update({
      where: { id: member.id },
      data: { password: hashed },
    });

    return { ok: true };
  } catch (e) {
    console.error("resetPassword failed:", e);
    return { ok: false, error: "재설정 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." };
  }
}

/* --------------------------------------------------------------------------
   로그아웃
   -------------------------------------------------------------------------- */
export async function logout(): Promise<{ ok: true }> {
  await deleteSession();
  return { ok: true };
}
