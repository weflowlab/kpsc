// 페이지 스크롤 잠금 (전체메뉴·드로어·모달이 열려 있는 동안).
// 스크롤바가 자리를 차지하는 환경(Windows 등)에서는 잠그는 순간 스크롤바가 사라져 페이지가 옆으로 튀므로,
// 그 폭만큼 --scrollbar-comp 변수에 넣어 body·고정 헤더가 오른쪽 여백으로 보정한다 (app/globals.css). Mac 의 겹침 스크롤바는 폭이 0 이라 영향 없음.
// 반환값을 호출하면 잠금이 풀린다. 여러 곳에서 겹쳐 잠가도 마지막 해제 때만 원래대로 돌아간다.
let locks = 0;

export function lockScroll(): () => void {
  const html = document.documentElement;
  if (locks === 0) {
    const comp = window.innerWidth - html.clientWidth; // 스크롤바 폭
    html.style.setProperty("--scrollbar-comp", `${comp}px`);
    html.style.overflow = "hidden";
  }
  locks++;
  let released = false;
  return () => {
    if (released) return;
    released = true;
    locks--;
    if (locks === 0) {
      html.style.overflow = "";
      html.style.removeProperty("--scrollbar-comp");
    }
  };
}
