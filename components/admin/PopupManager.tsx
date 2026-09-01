"use client";

/* ==========================================================================
   관리자 > 팝업창 — 등록/수정 폼 + 등록된 팝업 목록
   원본 add_popup.php 의 항목: 타이틀바 제목 / 시작일·종료일 / URL(본창·새창)
   / 오늘창 닫기 / PC·모바일 이미지
   ========================================================================== */

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { savePopup, deletePopup } from "@/app/actions/admin";

export type PopupRow = {
  id: number;
  title: string;
  start: string;
  end: string;
  linkUrl: string | null;
  newWindow: boolean;
  hideToday: boolean;
  pcImage: string;
  mobImage: string | null;
};

const FIELD =
  "w-full rounded-md border border-ink-200 bg-white px-3 py-2 text-[13px] outline-none focus:border-brand-600";
const LABEL = "mb-1.5 block text-[13px] font-semibold text-ink-700";

export default function PopupManager({
  popups,
  today,
}: {
  popups: PopupRow[];
  today: string;
}) {
  const router = useRouter();
  /* 수정 중인 팝업 — null 이면 새 등록 */
  const [editing, setEditing] = useState<PopupRow | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  /* 폼 리셋용 key */
  const [formKey, setFormKey] = useState(0);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (pending) return;
    setPending(true);
    setError(null);
    try {
      const formData = new FormData(e.currentTarget);
      if (editing) formData.set("id", String(editing.id));
      const res = await savePopup(formData);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setEditing(null);
      setFormKey((k) => k + 1);
      router.refresh();
    } finally {
      setPending(false);
    }
  };

  const onDelete = async (popup: PopupRow) => {
    if (!confirm(`'${popup.title}' 팝업을 삭제하시겠습니까?`)) return;
    const res = await deletePopup(popup.id);
    if (!res.ok) return alert(res.error);
    if (editing?.id === popup.id) setEditing(null);
    router.refresh();
  };

  const startEdit = (popup: PopupRow) => {
    setEditing(popup);
    setFormKey((k) => k + 1);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isActive = (p: PopupRow) => p.start <= today && today <= p.end;

  return (
    <div className="space-y-6">
      {/* ================== 등록/수정 폼 ================== */}
      <form
        key={formKey}
        onSubmit={onSubmit}
        className="space-y-4 rounded-lg border border-ink-200 bg-white p-6"
      >
        <h2 className="text-[15px] font-bold">
          {editing ? `팝업 수정 — ${editing.title}` : "팝업 등록"}
          {editing && (
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setFormKey((k) => k + 1);
              }}
              className="ml-3 text-[12px] font-normal text-ink-400 underline"
            >
              새 등록으로 전환
            </button>
          )}
        </h2>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label htmlFor="popup-title" className={LABEL}>
              타이틀바 제목
            </label>
            <input
              id="popup-title"
              name="title"
              type="text"
              defaultValue={editing?.title ?? ""}
              className={FIELD}
            />
          </div>
          <div>
            <label htmlFor="popup-start" className={LABEL}>
              시작일
            </label>
            <input
              id="popup-start"
              name="start"
              type="date"
              defaultValue={editing?.start ?? today}
              className={FIELD}
            />
          </div>
          <div>
            <label htmlFor="popup-end" className={LABEL}>
              종료일
            </label>
            <input
              id="popup-end"
              name="end"
              type="date"
              defaultValue={editing?.end ?? ""}
              className={FIELD}
            />
          </div>
        </div>

        <div className="grid items-end gap-4 md:grid-cols-[1fr_auto_auto]">
          <div>
            <label htmlFor="popup-url" className={LABEL}>
              URL (팝업 클릭시 이동 주소 — 비워두면 이동 없음)
            </label>
            <input
              id="popup-url"
              name="linkUrl"
              type="text"
              placeholder="예) https://www.sitehouse.co.kr"
              defaultValue={editing?.linkUrl ?? ""}
              className={FIELD}
            />
          </div>
          <label className="flex items-center gap-2 pb-2 text-[13px]">
            <input
              type="checkbox"
              name="newWindow"
              defaultChecked={editing?.newWindow ?? false}
            />
            새 창으로 열기
          </label>
          <label className="flex items-center gap-2 pb-2 text-[13px]">
            <input
              type="checkbox"
              name="hideToday"
              defaultChecked={editing?.hideToday ?? true}
            />
            [1일 동안 이 창을 열지 않음] 표시
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <span className={LABEL}>
              PC 이미지 {editing ? "(새로 선택하면 교체)" : "(필수)"}
            </span>
            <input
              type="file"
              name="pcImage"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="block cursor-pointer text-[13px] text-ink-500 file:mr-3 file:cursor-pointer file:rounded-md file:border file:border-ink-300 file:bg-white file:px-4 file:py-2 file:text-[13px] file:text-ink-700 hover:file:border-brand-600 hover:file:text-brand-600"
            />
          </div>
          <div>
            <span className={LABEL}>모바일 이미지 (없으면 PC 이미지 사용)</span>
            <input
              type="file"
              name="mobImage"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="block cursor-pointer text-[13px] text-ink-500 file:mr-3 file:cursor-pointer file:rounded-md file:border file:border-ink-300 file:bg-white file:px-4 file:py-2 file:text-[13px] file:text-ink-700 hover:file:border-brand-600 hover:file:text-brand-600"
            />
          </div>
        </div>

        {error && (
          <p role="alert" className="text-[13px] text-board-tag">
            {error}
          </p>
        )}

        {/* 등록 버튼 — 우하단 배치 */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={pending}
            className="rounded-md bg-ink-900 px-6 py-2.5 text-[14px] font-semibold text-white hover:bg-brand-600 disabled:opacity-50"
          >
            {pending ? "저장 중..." : editing ? "수정 저장" : "[ 팝업이벤트 등록 ]"}
          </button>
        </div>
      </form>

      {/* ================== 등록된 팝업 목록 ================== */}
      <div className="overflow-hidden rounded-lg border border-ink-200 bg-white">
        <div className="border-b border-ink-200 bg-ink-50 p-3 text-[13px] font-semibold text-ink-700">
          등록된 팝업 ({popups.length})
        </div>
        <ul>
          {popups.map((p) => (
            <li
              key={p.id}
              className="flex flex-wrap items-center gap-4 border-b border-ink-100 p-4 last:border-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.pcImage}
                alt={p.title}
                className="h-16 w-28 rounded border border-ink-200 object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 text-[14px] font-semibold">
                  {p.title}
                  {isActive(p) ? (
                    <span className="rounded bg-green-100 px-1.5 py-0.5 text-[11px] text-green-700">
                      노출 중
                    </span>
                  ) : (
                    <span className="rounded bg-ink-100 px-1.5 py-0.5 text-[11px] text-ink-500">
                      {today < p.start ? "대기" : "종료"}
                    </span>
                  )}
                </p>
                <p className="mt-0.5 text-[12px] text-ink-400">
                  {p.start} ~ {p.end}
                  {p.linkUrl && ` · ${p.linkUrl}`}
                  {p.mobImage && " · 모바일 이미지 있음"}
                </p>
              </div>
              <div className="flex gap-2 text-[12px]">
                <button
                  type="button"
                  onClick={() => startEdit(p)}
                  className="rounded border border-ink-200 px-3 py-1.5 hover:border-brand-600 hover:text-brand-600"
                >
                  수정
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(p)}
                  className="rounded border border-board-tag px-3 py-1.5 text-board-tag hover:bg-board-tag hover:text-white"
                >
                  삭제
                </button>
              </div>
            </li>
          ))}
          {popups.length === 0 && (
            <li className="p-10 text-center text-[13px] text-ink-400">
              등록된 팝업이 없습니다.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
