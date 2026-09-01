/* ==========================================================================
   이미지 업로드 헬퍼
   - 업로드 시 서버에서 자동 최적화: 가로 최대 1600px 리사이즈 + WebP 변환
     (폰 사진 4~5MB → 수백 KB 수준. 애니메이션 GIF 는 원본 유지)
   - 배포(Vercel): BLOB_READ_WRITE_TOKEN 이 있으면 Vercel Blob 에 저장
   - 로컬 개발: 토큰이 없으면 public/uploads/ 에 저장해 바로 확인 가능
     (Vercel 서버리스는 파일이 유지되지 않으므로 배포에서는 Blob 필수)
   ========================================================================== */

import "server-only";
import { put } from "@vercel/blob";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";
import sharp from "sharp";

const MAX_SIZE = 8 * 1024 * 1024; // 8MB (최적화 전 원본 기준)
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_WIDTH = 1600; // 웹 표시용 최대 가로 폭
const WEBP_QUALITY = 82;

export type UploadResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

export async function uploadImage(
  file: File,
  folder: "gallery" | "popup"
): Promise<UploadResult> {
  if (!ALLOWED.includes(file.type))
    return { ok: false, error: "jpg / png / webp / gif 이미지만 업로드할 수 있습니다." };
  if (file.size > MAX_SIZE)
    return { ok: false, error: "이미지는 8MB 이하만 업로드할 수 있습니다." };

  try {
    let buf = Buffer.from(await file.arrayBuffer());
    let ext = file.type === "image/jpeg" ? "jpg" : file.type.split("/")[1];
    let contentType = file.type;

    /* GIF(애니메이션 가능)는 원본 유지, 나머지는 리사이즈 + WebP 변환 */
    if (file.type !== "image/gif") {
      buf = Buffer.from(
        await sharp(buf)
          .rotate() // EXIF 회전 정보 반영 (폰 사진 옆으로 눕는 문제 방지)
          .resize({ width: MAX_WIDTH, withoutEnlargement: true })
          .webp({ quality: WEBP_QUALITY })
          .toBuffer()
      );
      ext = "webp";
      contentType = "image/webp";
    }

    const name = `${folder}/${Date.now()}-${crypto.randomBytes(4).toString("hex")}.${ext}`;

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(name, buf, { access: "public", contentType });
      return { ok: true, url: blob.url };
    }

    /* 로컬 개발 폴백 — public/uploads/ 에 저장 */
    const dir = path.join(process.cwd(), "public", "uploads", folder);
    await mkdir(dir, { recursive: true });
    const filename = path.basename(name);
    await writeFile(path.join(dir, filename), buf);
    return { ok: true, url: `/uploads/${folder}/${filename}` };
  } catch (e) {
    console.error("uploadImage failed:", e);
    return { ok: false, error: "이미지 업로드에 실패했습니다. 잠시 후 다시 시도해 주세요." };
  }
}
