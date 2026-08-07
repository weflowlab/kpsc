import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* --------------------------------------------------------------------------
     이미지 최적화 비활성화
     public/images 의 파일을 이미 WebP 로 변환해 두었으므로(10.8MB → 1.9MB)
     Vercel 의 이미지 최적화(유료 변환)를 거치지 않고 원본을 그대로 서빙한다.
     next/image 는 그대로 쓰되 /_next/image 변환 요청이 발생하지 않는다.
     -------------------------------------------------------------------------- */
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
