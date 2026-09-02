/* ==========================================================================
   관리자 서버 액션 — 회원관리 / 보드관리 / 팝업창 / 환경설정
   모든 액션은 checkAdmin() 으로 DB 등급을 재확인한다.
   ========================================================================== */

"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { checkAdmin } from "@/lib/admin";
import { getBoardMeta } from "@/lib/boards-meta";
import { uploadImage } from "@/lib/upload";
import type { MemberGrade } from "@/lib/generated/prisma/enums";

type ActionResult = { ok: true } | { ok: false; error: string };

const DENIED = { ok: false as const, error: "관리자 권한이 필요합니다." };
const GRADES: MemberGrade[] = ["NORMAL", "VIP", "VVIP", "ADMIN"];

/* ==========================================================================
   회원관리
   ========================================================================== */

export async function updateMemberGrade(input: {
  memberId: number;
  grade: string;
}): Promise<ActionResult> {
  const admin = await checkAdmin();
  if (!admin) return DENIED;
  if (!GRADES.includes(input.grade as MemberGrade))
    return { ok: false, error: "올바르지 않은 등급입니다." };
  /* 자기 자신을 강등해 관리자가 0명이 되는 사고 방지 */
  if (input.memberId === admin.id && input.grade !== "ADMIN")
    return { ok: false, error: "본인 계정의 관리자 등급은 해제할 수 없습니다." };

  try {
    await prisma.member.update({
      where: { id: input.memberId },
      data: { grade: input.grade as MemberGrade },
    });
    revalidatePath("/admin/members");
    return { ok: true };
  } catch (e) {
    console.error("updateMemberGrade failed:", e);
    return { ok: false, error: "등급 변경에 실패했습니다." };
  }
}

/** 포인트/캐쉬 지급 — 음수를 넣으면 차감(환급). 근거자료와 함께 내역에 남긴다
    (원본 캐쉬지급/포인트지급 버튼 + member.php 지급(환급) 폼) */
export async function giveMemberBalance(input: {
  memberIds: number[];
  field: "points" | "cash";
  amount: number;
  reason?: string;
}): Promise<ActionResult> {
  const admin = await checkAdmin();
  if (!admin) return DENIED;
  if (!Number.isInteger(input.amount) || input.amount === 0)
    return { ok: false, error: "지급할 금액을 정수로 입력해 주세요." };
  if (input.memberIds.length === 0)
    return { ok: false, error: "대상 회원을 선택해 주세요." };

  const kind = input.field === "cash" ? ("CASH" as const) : ("POINT" as const);
  const reason = input.reason?.trim() || "관리자 지급";

  try {
    await prisma.$transaction([
      prisma.member.updateMany({
        where: { id: { in: input.memberIds } },
        data: { [input.field]: { increment: input.amount } },
      }),
      prisma.balanceLog.createMany({
        data: input.memberIds.map((memberId) => ({
          memberId,
          kind,
          amount: input.amount,
          reason,
        })),
      }),
    ]);
    revalidatePath("/admin/members");
    return { ok: true };
  } catch (e) {
    console.error("giveMemberBalance failed:", e);
    return { ok: false, error: "지급에 실패했습니다." };
  }
}

/** 캐쉬/포인트 내역 삭제 — 삭제하는 만큼 잔액도 되돌린다 (원본 내역 [삭제]) */
export async function deleteBalanceLog(logId: number): Promise<ActionResult> {
  const admin = await checkAdmin();
  if (!admin) return DENIED;

  try {
    const log = await prisma.balanceLog.findUnique({ where: { id: logId } });
    if (!log) return { ok: false, error: "내역을 찾을 수 없습니다." };

    await prisma.$transaction([
      prisma.member.update({
        where: { id: log.memberId },
        data: {
          [log.kind === "CASH" ? "cash" : "points"]: { decrement: log.amount },
        },
      }),
      prisma.balanceLog.delete({ where: { id: logId } }),
    ]);
    revalidatePath(`/admin/members/${log.memberId}`);
    return { ok: true };
  } catch (e) {
    console.error("deleteBalanceLog failed:", e);
    return { ok: false, error: "삭제에 실패했습니다." };
  }
}

/** 회원 상세 — 개인정보 수정 (원본 member.php 개인정보에 대해서..) */
export async function updateMemberInfo(input: {
  memberId: number;
  name: string;
  nickname: string;
  email: string;
  phone: string;
  remail: boolean;
  memberType: string; // PERSONAL | BUSINESS (원본 회원구분)
  status: string; // APPROVED | PENDING (원본 승인상태 — 대기면 로그인 차단)
}): Promise<ActionResult> {
  const admin = await checkAdmin();
  if (!admin) return DENIED;

  const name = input.name.trim();
  const email = input.email.trim();
  const phone = input.phone.trim();
  if (!name) return { ok: false, error: "실명을 입력해 주세요." };
  if (!email.includes("@")) return { ok: false, error: "이메일을 정확히 입력해 주세요." };
  if (!/^01[016789]-\d{3,4}-\d{4}$/.test(phone))
    return { ok: false, error: "휴대폰은 010-1234-5678 형식으로 입력해 주세요." };
  if (!["PERSONAL", "BUSINESS"].includes(input.memberType))
    return { ok: false, error: "회원구분이 올바르지 않습니다." };
  if (!["APPROVED", "PENDING"].includes(input.status))
    return { ok: false, error: "승인상태가 올바르지 않습니다." };
  /* 본인 계정을 대기로 바꿔 스스로 잠그는 사고 방지 */
  if (input.memberId === admin.id && input.status !== "APPROVED")
    return { ok: false, error: "본인 계정의 승인상태는 변경할 수 없습니다." };

  try {
    await prisma.member.update({
      where: { id: input.memberId },
      data: {
        name,
        nickname: input.nickname.trim() || null,
        email,
        phone,
        remail: input.remail,
        memberType: input.memberType as "PERSONAL" | "BUSINESS",
        status: input.status as "APPROVED" | "PENDING",
      },
    });
    revalidatePath(`/admin/members/${input.memberId}`);
    revalidatePath("/admin/members");
    return { ok: true };
  } catch (e) {
    console.error("updateMemberInfo failed:", e);
    return { ok: false, error: "저장에 실패했습니다." };
  }
}

/** 회원 상세 — 관리자가 회원 비밀번호를 새로 지정 (원본 패스워드 필드) */
export async function adminResetMemberPassword(input: {
  memberId: number;
  newPassword: string;
}): Promise<ActionResult> {
  const admin = await checkAdmin();
  if (!admin) return DENIED;
  if (input.newPassword.length < 4 || input.newPassword.length > 12)
    return { ok: false, error: "비밀번호는 4자 이상 12자 이하로 입력해 주세요." };

  try {
    await prisma.member.update({
      where: { id: input.memberId },
      data: { password: await bcrypt.hash(input.newPassword, 10) },
    });
    return { ok: true };
  } catch (e) {
    console.error("adminResetMemberPassword failed:", e);
    return { ok: false, error: "변경에 실패했습니다." };
  }
}

/** 삭제(탈퇴) — 글/댓글은 남기고 작성자 연결만 끊긴다(onDelete: SetNull) */
export async function deleteMembers(memberIds: number[]): Promise<ActionResult> {
  const admin = await checkAdmin();
  if (!admin) return DENIED;
  if (memberIds.includes(admin.id))
    return { ok: false, error: "본인 계정은 삭제할 수 없습니다." };
  if (memberIds.length === 0)
    return { ok: false, error: "대상 회원을 선택해 주세요." };

  try {
    await prisma.member.deleteMany({ where: { id: { in: memberIds } } });
    revalidatePath("/admin/members");
    return { ok: true };
  } catch (e) {
    console.error("deleteMembers failed:", e);
    return { ok: false, error: "삭제에 실패했습니다." };
  }
}

/* ==========================================================================
   보드관리 — 글 등록/수정/삭제 (관리자는 공지 포함 모든 게시판)
   ========================================================================== */

function boardPaths(boardKey: string, id?: number): string[] {
  const base =
    boardKey === "gallery" ? "/organization/gallery" : `/news/${boardKey}`;
  return id ? [base, `${base}/${id}`] : [base];
}

export async function adminSavePost(formData: FormData): Promise<
  ActionResult | { ok: true }
> {
  const admin = await checkAdmin();
  if (!admin) return DENIED;

  const id = Number(formData.get("id")) || null;
  const boardKey = String(formData.get("board") ?? "");
  const meta = getBoardMeta(boardKey);
  if (!meta) return { ok: false, error: "올바르지 않은 게시판입니다." };

  const title = String(formData.get("subject") ?? "").trim();
  const category = String(formData.get("category") ?? "");
  const contentHtml = String(formData.get("content") ?? "").trim();
  const authorName = String(formData.get("author") ?? "").trim() || "KPSC";

  if (!title) return { ok: false, error: "제목을 입력해 주세요." };
  if (!meta.categories.includes(category))
    return { ok: false, error: "카테고리를 선택해 주세요." };

  /* 갤러리 이미지 — 새로 첨부한 경우만 교체 (앨범형 최대 5장) */
  const MAX_IMAGES = 5;
  const newFiles = formData
    .getAll("file")
    .filter((f): f is File => f instanceof File && f.size > 0);
  if (newFiles.length > MAX_IMAGES)
    return { ok: false, error: `이미지는 최대 ${MAX_IMAGES}장까지 첨부할 수 있습니다.` };
  const newUrls: string[] = [];
  for (const file of newFiles) {
    const uploaded = await uploadImage(file, "gallery");
    if (!uploaded.ok) return uploaded;
    newUrls.push(uploaded.url);
  }
  const hasNewImages = newUrls.length > 0;

  try {
    if (id) {
      /* 새 이미지를 올렸으면 기존 이미지 전부 교체, 아니면 유지 */
      await prisma.post.update({
        where: { id },
        data: {
          title,
          category,
          contentHtml,
          authorName,
          ...(hasNewImages
            ? {
                thumbUrl: newUrls[0],
                images: { deleteMany: {}, create: newUrls.map((url, i) => ({ url, sort: i })) },
              }
            : {}),
        },
      });
    } else {
      if (boardKey === "gallery" && !hasNewImages)
        return { ok: false, error: "갤러리 게시판은 이미지를 1장 이상 첨부해야 합니다." };
      await prisma.post.create({
        data: {
          boardKey,
          category,
          title,
          contentHtml,
          authorName,
          memberId: admin.id,
          thumbUrl: newUrls[0] ?? null,
          images: { create: newUrls.map((url, i) => ({ url, sort: i })) },
        },
      });
    }
    for (const p of boardPaths(boardKey, id ?? undefined)) revalidatePath(p);
    revalidatePath(`/admin/boards/${boardKey}`);
    return { ok: true };
  } catch (e) {
    console.error("adminSavePost failed:", e);
    return { ok: false, error: "저장에 실패했습니다." };
  }
}

export async function adminDeletePosts(input: {
  boardKey: string;
  ids: number[];
}): Promise<ActionResult> {
  const admin = await checkAdmin();
  if (!admin) return DENIED;
  if (input.ids.length === 0)
    return { ok: false, error: "삭제할 글을 선택해 주세요." };

  try {
    await prisma.post.deleteMany({
      where: { id: { in: input.ids }, boardKey: input.boardKey },
    });
    for (const p of boardPaths(input.boardKey)) revalidatePath(p);
    revalidatePath(`/admin/boards/${input.boardKey}`);
    return { ok: true };
  } catch (e) {
    console.error("adminDeletePosts failed:", e);
    return { ok: false, error: "삭제에 실패했습니다." };
  }
}

export async function adminDeleteComment(commentId: number): Promise<ActionResult> {
  const admin = await checkAdmin();
  if (!admin) return DENIED;
  try {
    await prisma.comment.delete({ where: { id: commentId } });
    return { ok: true };
  } catch (e) {
    console.error("adminDeleteComment failed:", e);
    return { ok: false, error: "삭제에 실패했습니다." };
  }
}

/* ==========================================================================
   팝업창 관리
   ========================================================================== */

export async function savePopup(formData: FormData): Promise<ActionResult> {
  const admin = await checkAdmin();
  if (!admin) return DENIED;

  const id = Number(formData.get("id")) || null;
  const title = String(formData.get("title") ?? "").trim();
  const start = String(formData.get("start") ?? ""); // yyyy-mm-dd
  const end = String(formData.get("end") ?? "");
  const linkUrl = String(formData.get("linkUrl") ?? "").trim() || null;
  const newWindow = formData.get("newWindow") === "on";
  const hideToday = formData.get("hideToday") === "on";

  if (!title) return { ok: false, error: "타이틀바 제목을 입력해 주세요." };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(start) || !/^\d{4}-\d{2}-\d{2}$/.test(end))
    return { ok: false, error: "시작일/종료일을 입력해 주세요." };
  if (start > end)
    return { ok: false, error: "종료일이 시작일보다 빠를 수 없습니다." };

  /* 이미지 업로드 */
  let pcImage: string | undefined;
  let mobImage: string | undefined;
  const pcFile = formData.get("pcImage");
  const mobFile = formData.get("mobImage");
  if (pcFile instanceof File && pcFile.size > 0) {
    const up = await uploadImage(pcFile, "popup");
    if (!up.ok) return up;
    pcImage = up.url;
  }
  if (mobFile instanceof File && mobFile.size > 0) {
    const up = await uploadImage(mobFile, "popup");
    if (!up.ok) return up;
    mobImage = up.url;
  }

  /* KST 자정 기준으로 저장 — 시작일 00:00(KST)부터 종료일 23:59(KST)까지 노출 */
  const dates = {
    startDate: new Date(`${start}T00:00:00+09:00`),
    endDate: new Date(`${end}T00:00:00+09:00`),
  };

  try {
    if (id) {
      await prisma.popup.update({
        where: { id },
        data: {
          title,
          ...dates,
          linkUrl,
          newWindow,
          hideToday,
          ...(pcImage ? { pcImage } : {}),
          ...(mobImage ? { mobImage } : {}),
        },
      });
    } else {
      if (!pcImage)
        return { ok: false, error: "PC 이미지를 첨부해 주세요." };
      await prisma.popup.create({
        data: {
          title,
          ...dates,
          linkUrl,
          newWindow,
          hideToday,
          pcImage,
          mobImage: mobImage ?? null,
        },
      });
    }
    revalidatePath("/admin/popups");
    return { ok: true };
  } catch (e) {
    console.error("savePopup failed:", e);
    return { ok: false, error: "저장에 실패했습니다." };
  }
}

export async function deletePopup(id: number): Promise<ActionResult> {
  const admin = await checkAdmin();
  if (!admin) return DENIED;
  try {
    await prisma.popup.delete({ where: { id } });
    revalidatePath("/admin/popups");
    return { ok: true };
  } catch (e) {
    console.error("deletePopup failed:", e);
    return { ok: false, error: "삭제에 실패했습니다." };
  }
}

/* ==========================================================================
   환경설정 — 약관/개인정보 텍스트, 관리자 비밀번호 변경
   ========================================================================== */

export async function saveSetting(input: {
  key: "terms" | "privacy";
  value: string;
}): Promise<ActionResult> {
  const admin = await checkAdmin();
  if (!admin) return DENIED;
  if (!["terms", "privacy"].includes(input.key))
    return { ok: false, error: "올바르지 않은 설정 항목입니다." };

  try {
    await prisma.siteSetting.upsert({
      where: { key: input.key },
      update: { value: input.value },
      create: { key: input.key, value: input.value },
    });
    revalidatePath("/register");
    revalidatePath("/admin/settings");
    return { ok: true };
  } catch (e) {
    console.error("saveSetting failed:", e);
    return { ok: false, error: "저장에 실패했습니다." };
  }
}

/** 관리자 본인 비밀번호 변경 (원본 cfg_root.php 의 루트 비밀번호변경) */
export async function changeAdminPassword(input: {
  current: string;
  next: string;
}): Promise<ActionResult> {
  const admin = await checkAdmin();
  if (!admin) return DENIED;
  if (input.next.length < 4 || input.next.length > 12)
    return { ok: false, error: "비밀번호는 4자 이상 12자 이하로 입력해 주세요." };

  try {
    const me = await prisma.member.findUnique({
      where: { id: admin.id },
      select: { password: true },
    });
    if (!me || !(await bcrypt.compare(input.current, me.password)))
      return { ok: false, error: "현재 비밀번호가 일치하지 않습니다." };

    await prisma.member.update({
      where: { id: admin.id },
      data: { password: await bcrypt.hash(input.next, 10) },
    });
    return { ok: true };
  } catch (e) {
    console.error("changeAdminPassword failed:", e);
    return { ok: false, error: "변경에 실패했습니다." };
  }
}
