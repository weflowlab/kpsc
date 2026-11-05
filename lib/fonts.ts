import { Nanum_Myeongjo, Noto_Sans_KR, Playfair_Display } from "next/font/google";

/**
 * 웹폰트는 next/font 로 빌드 때 받아 같은 도메인에서 내보낸다 (self-host).
 * 예전에는 globals.css 맨 위 @import 로 구글 폰트·webfontworld 를 불러왔는데, CSS → 외부 폰트 CSS → 폰트 파일 순으로
 * 기다려야 해서 첫 글자가 늦게 떴다. 이제 외부 왕복이 없고, 변수(--font-*)를 <html> 에 붙여 globals.css 의 --font-sans 등이 쓴다.
 * 적용: app/(site)/layout.tsx, app/global-not-found.tsx 의 <html className={fontVariables}>
 */

/** 본문 (가변 굵기 100~900, 한글 포함).
 *  한글은 유니코드 범위별 조각 124개로 나뉘어 페이지에 나온 글자가 든 조각만 받는다 (조각당 ~16KB, 글자가 많은 페이지는 1MB 넘게).
 *  굵기별 고정 글꼴로 요청해도 구글이 같은 가변 파일을 주므로(확인함) 줄어들지 않는다. 한 번 받으면 브라우저가 캐시한다. */
export const notoSansKr = Noto_Sans_KR({ subsets: ["latin"], variable: "--font-noto", display: "swap" });

/** 명조 (대제목 일부) */
export const nanumMyeongjo = Nanum_Myeongjo({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-myeongjo", display: "swap" });

/** 영문 라벨 정체 */
export const playfair = Playfair_Display({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-playfair-display", display: "swap" });

/**
 * Playfair Display 진짜 이탤릭 (--font-italic).
 * 정체만 불러온 곳에서 font-style: italic 을 쓰면 기울임 흉내가 되므로, 크게 쓰는 영문 이탤릭은 이걸 쓴다.
 * 쓰는 곳 상위 요소에 className={playfairItalic.variable}
 */
export const playfairItalic = Playfair_Display({ weight: "400", style: "italic", subsets: ["latin"], variable: "--font-italic", display: "swap" });

/** <html> 에 붙이는 폰트 변수 클래스 묶음 */
export const fontVariables = `${notoSansKr.variable} ${nanumMyeongjo.variable} ${playfair.variable}`;
