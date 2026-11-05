// 글 하단 "[안내사항]" 상자 + 브랜드 정보 한 줄. 출처 섹션과 문의 블록 사이에 배치.
// 문구는 lib/clinicDefaults.ts 의 DISCLAIMER_TEXT. 비어 있으면(현재 기본) 상자를 그리지 않는다.
import { getClinic } from "@/lib/payload";
import { DISCLAIMER_TEXT as DEFAULT_TEXT } from "@/lib/clinicDefaults";

type Props = { className?: string };

export async function Disclaimer({ className = "" }: Props) {
  const clinic = await getClinic();
  const text = clinic.disclaimerText || DEFAULT_TEXT;
  if (!text) return null;
  return (
    <div className={`mt-[34px] rounded-[11px] border border-border bg-neutral-50 px-[18px] py-4 text-base leading-[1.7] text-neutral-600 ${className}`}>
      <strong>[안내사항]</strong>
      <br />
      <span className="whitespace-pre-line">{text}</span>
      <p className="m-0! mt-2! text-sm text-neutral-500">
        {clinic.name} · {clinic.address} · 대표전화 {clinic.phone}
      </p>
    </div>
  );
}
