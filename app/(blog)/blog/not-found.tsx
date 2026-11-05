import Link from "next/link";

export default function BlogNotFound() {
  return (
    <section className="mx-auto flex min-h-[50vh] w-full max-w-site-4xl flex-col items-center justify-center px-5 py-24 text-center">
      <p className="font-mont text-6xl font-extrabold text-primary">404</p>
      <h1 className="mt-6 text-xl font-bold text-foreground md:text-2xl">글을 찾을 수 없습니다</h1>
      <p className="mt-3 text-neutral-500">주소가 바뀌었거나 삭제된 글입니다.</p>
      <Link
        href="/blog"
        className="mt-8 inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-secondary"
      >
        블로그 홈으로
      </Link>
    </section>
  );
}
