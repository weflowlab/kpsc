/* ==========================================================================
   게시판 서버 액션 — 글쓰기(고객의 소리 / 갤러리) · 댓글
   글쓰기와 댓글은 로그인 회원만 가능하다.
   (원본은 비회원+비밀번호 방식도 있었지만 스팸 방지를 위해 회원 전용으로)
   ========================================================================== */

"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { getBoardMeta } from "@/lib/boards-meta";
import { uploadImage } from "@/lib/upload";

type ActionResult = { ok: true; uid?: number } | { ok: false; error: string };

/* --------------------------------------------------------------------------
   글 등록 — activities / gallery (일반 회원 글쓰기 허용 게시판)
   -------------------------------------------------------------------------- */
export async function createPost(formData: FormData): Promise<ActionResult> {
  const session = await getSession();
  if (!session)
    return { ok: false, error: "회원으로 로그인해야 이용하실 수 있습니다." };

  const boardKey = String(formData.get("board") ?? "");
  const meta = getBoardMeta(boardKey);
  if (!meta || !meta.writable)
    return { ok: false, error: "글쓰기가 허용되지 않은 게시판입니다." };

  const title = String(formData.get("subject") ?? "").trim();
  const category = String(formData.get("category") ?? "");
  const content = String(formData.get("content") ?? "").trim();
  /* 비밀글 — 고객의 소리에서만 허용 (작성자+관리자만 열람) */
  const secret = boardKey === "activities" && formData.get("secret") === "on";

  if (!title) return { ok: false, error: "제목을 입력해 주세요." };
  if (!meta.categories.includes(category))
    return { ok: false, error: "카테고리를 선택해 주세요." };
  if (!content) return { ok: false, error: "본문 내용을 입력해 주세요." };

  /* 수정 모드 — editUid 가 있으면 기존 글 수정 (작성자 본인만) */
  const editUid = Number(formData.get("editUid")) || null;
  const listPath =
    boardKey === "gallery" ? "/organization/gallery" : `/news/${boardKey}`;

  /* 갤러리는 이미지 필수 — 최대 5장 (앨범형).
     수정 모드에서는 새 이미지를 안 올리면 기존 이미지 유지 */
  const MAX_IMAGES = 5;
  const files = formData
    .getAll("file")
    .filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length > MAX_IMAGES)
    return { ok: false, error: `이미지는 최대 ${MAX_IMAGES}장까지 첨부할 수 있습니다.` };
  if (boardKey === "gallery" && !editUid && files.length === 0)
    return { ok: false, error: "갤러리 게시판은 이미지를 1장 이상 첨부해야 합니다." };

  /* 순서대로 업로드 (하나라도 실패하면 중단) */
  const urls: string[] = [];
  for (const file of files) {
    const uploaded = await uploadImage(file, "gallery");
    if (!uploaded.ok) return uploaded;
    urls.push(uploaded.url);
  }
  const hasNewImages = urls.length > 0;

  try {
    /* -------- 수정 -------- */
    if (editUid) {
      const existing = await prisma.post.findUnique({
        where: { id: editUid },
        select: { memberId: true, boardKey: true },
      });
      if (!existing || existing.boardKey !== boardKey)
        return { ok: false, error: "글을 찾을 수 없습니다." };
      if (existing.memberId !== session.memberId)
        return { ok: false, error: "본인 글만 수정할 수 있습니다." };

      await prisma.post.update({
        where: { id: editUid },
        data: {
          category,
          title,
          contentHtml: content,
          secret,
          ...(hasNewImages
            ? {
                thumbUrl: urls[0],
                images: { deleteMany: {}, create: urls.map((url, i) => ({ url, sort: i })) },
              }
            : {}),
        },
      });
      revalidatePath(listPath);
      revalidatePath(`${listPath}/${editUid}`);
      return { ok: true, uid: editUid };
    }

    /* -------- 신규 -------- */
    const post = await prisma.post.create({
      data: {
        boardKey,
        category,
        title,
        contentHtml: content,
        authorName: session.name,
        memberId: session.memberId,
        thumbUrl: urls[0] ?? null, // 목록 대표 썸네일
        secret,
        images: {
          create: urls.map((url, i) => ({ url, sort: i })),
        },
      },
      select: { id: true },
    });

    revalidatePath(listPath);
    return { ok: true, uid: post.id };
  } catch (e) {
    console.error("createPost failed:", e);
    return { ok: false, error: "등록 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." };
  }
}

/* --------------------------------------------------------------------------
   게시글 삭제 — 작성자 본인 또는 관리자
   -------------------------------------------------------------------------- */
export async function deletePost(postId: number): Promise<ActionResult> {
  const session = await getSession();
  if (!session)
    return { ok: false, error: "회원으로 로그인해야 이용하실 수 있습니다." };

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { memberId: true, boardKey: true },
    });
    if (!post) return { ok: false, error: "글을 찾을 수 없습니다." };

    const me = await prisma.member.findUnique({
      where: { id: session.memberId },
      select: { grade: true },
    });
    const isAdmin = me?.grade === "ADMIN";
    if (post.memberId !== session.memberId && !isAdmin)
      return { ok: false, error: "본인 글만 삭제할 수 있습니다." };

    await prisma.post.delete({ where: { id: postId } });
    const listPath =
      post.boardKey === "gallery" ? "/organization/gallery" : `/news/${post.boardKey}`;
    revalidatePath(listPath);
    return { ok: true };
  } catch (e) {
    console.error("deletePost failed:", e);
    return { ok: false, error: "삭제 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." };
  }
}

/* --------------------------------------------------------------------------
   댓글 등록 — activities 전용
   -------------------------------------------------------------------------- */
export async function createComment(input: {
  postId: number;
  content: string;
}): Promise<ActionResult> {
  const session = await getSession();
  if (!session)
    return { ok: false, error: "회원으로 로그인해야 이용하실 수 있습니다." };

  const content = input.content.trim();
  if (!content) return { ok: false, error: "의견을 입력해 주세요." };
  if (content.length > 1000)
    return { ok: false, error: "댓글은 1,000자 이내로 입력해 주세요." };

  try {
    const post = await prisma.post.findUnique({
      where: { id: input.postId },
      select: { boardKey: true },
    });
    if (!post || !getBoardMeta(post.boardKey)?.comments)
      return { ok: false, error: "댓글을 쓸 수 없는 게시물입니다." };

    await prisma.comment.create({
      data: {
        postId: input.postId,
        content,
        authorName: session.name,
        memberId: session.memberId,
      },
    });

    revalidatePath(`/news/${post.boardKey}/${input.postId}`);
    return { ok: true };
  } catch (e) {
    console.error("createComment failed:", e);
    return { ok: false, error: "등록 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." };
  }
}

/* --------------------------------------------------------------------------
   댓글 삭제 — 본인 댓글만
   -------------------------------------------------------------------------- */
export async function deleteComment(commentId: number): Promise<ActionResult> {
  const session = await getSession();
  if (!session)
    return { ok: false, error: "회원으로 로그인해야 이용하실 수 있습니다." };

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { memberId: true, post: { select: { boardKey: true, id: true } } },
    });
    if (!comment) return { ok: false, error: "댓글을 찾을 수 없습니다." };
    if (comment.memberId !== session.memberId)
      return { ok: false, error: "본인 댓글만 삭제할 수 있습니다." };

    await prisma.comment.delete({ where: { id: commentId } });
    revalidatePath(`/news/${comment.post.boardKey}/${comment.post.id}`);
    return { ok: true };
  } catch (e) {
    console.error("deleteComment failed:", e);
    return { ok: false, error: "삭제 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." };
  }
}
