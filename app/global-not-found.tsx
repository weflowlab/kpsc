import type { Metadata } from "next";
import "./(main)/globals.css";
import NotFound from "./(main)/not-found";

/* 어느 라우트 그룹((main)·(payload)·(blog))에도 안 잡히는 주소의 404.
   루트 레이아웃이 여럿이라 Next 가 공통 404 를 못 만들어서, 여기서 전체 문서를
   직접 꾸민다. (실제 404 디자인은 (main)/not-found.tsx 를 재사용) */
export const metadata: Metadata = {
  title: "페이지를 찾을 수 없습니다 | KPSC",
  description: "주소가 바뀌었거나 삭제된 페이지입니다.",
};

export default function GlobalNotFound() {
  return (
    <html lang="ko">
      <body>
        <NotFound />
      </body>
    </html>
  );
}
