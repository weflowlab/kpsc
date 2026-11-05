/* 관리자 첫 화면 — 회원관리로 이동 */
import { redirect } from "next/navigation";

export default function AdminIndexPage() {
  redirect("/admin/members");
}
