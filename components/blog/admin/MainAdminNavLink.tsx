// 블로그 관리자(/studio) 왼쪽 메뉴 맨 아래, 로그아웃 바로 위에 붙는 "홈페이지 관리자" 버튼 (payload.config admin.components.afterNavLinks).
// KPSC 홈페이지 관리자(/admin)는 Payload 와 다른 루트 레이아웃이라 일반 링크(<a>)로 이동한다. 스타일은 app/(payload)/custom.scss.
export function MainAdminNavLink() {
  return (
    <div className="kpsc-main-admin">
      <a href="/admin" className="kpsc-main-admin__link">
        홈페이지 관리자
        <span aria-hidden="true">→</span>
      </a>
    </div>
  );
}
