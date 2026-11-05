// 관리자 "유입 관리" 화면 (/admin/traffic). payload.config admin.components.views.traffic 에 등록.
// 방문 기록(page-views) 최근 90일을 읽어 lib/trafficStats 로 집계하고, Payload 관리자 틀(DefaultTemplate) 안에 그린다.
// 문구·카드 구성은 weflow 관리자 "유입 관리" 탭을 따른다. 스타일은 app/(payload)/custom.scss 의 .traffic* 클래스.
import type { AdminViewServerProps } from "payload";
import { DefaultTemplate } from "@payloadcms/next/templates";
import { Gutter } from "@payloadcms/ui";
import { redirect } from "next/navigation";
import { computeTrafficStats, PERIODS, type PageViewRow, type PeriodKey } from "@/lib/trafficStats";
import { DEVICE_LABEL, SOURCE_LABEL } from "@/lib/tracking";
import { MENU, pageHref } from "@/lib/site";
import { TrafficStepNav } from "./TrafficStepNav";
import {
  IconUsers,
  IconEye,
  IconDoorExit,
  IconClock,
  IconCalendarWeek,
  IconMapPin,
  IconDeviceMobile,
  IconArticle,
  IconSearch,
  IconLogout,
  IconFileSearch,
  IconTrendingUp,
  type Icon as TablerIcon,
} from "@tabler/icons-react";

const DAYS = 90;

// 홈페이지 / 블로그 탭: 방문 기록을 경로(/blog 로 시작하는지)로 나눠 본다
type ScopeKey = "all" | "site" | "blog";
const SCOPES: { key: ScopeKey; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "site", label: "홈페이지" },
  { key: "blog", label: "웹블로그" },
];
const isBlogPath = (path: string) => path === "/blog" || path.startsWith("/blog/");

function sourceLabel(key: string): string {
  if (key.endsWith("-ad")) return `${SOURCE_LABEL[key.slice(0, -3)] ?? key.slice(0, -3)} 광고`;
  return SOURCE_LABEL[key] ?? key;
}

function fmtDuration(sec: number): string {
  if (sec < 60) return `${sec}초`;
  return `${Math.floor(sec / 60)}분 ${sec % 60}초`;
}

// 카드: 제목 + 한 줄 설명 + 내용
function Card({
  title,
  desc,
  icon: Icon,
  children,
  className = "",
}: {
  title: string;
  desc?: string;
  icon?: TablerIcon;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`traffic__card ${className}`}>
      <div className="traffic__card-head">
        {Icon && (
          <i className="traffic__card-icon">
            <Icon size={22} stroke={1.8} />
          </i>
        )}
        <div>
          <h2>{title}</h2>
          {desc && <p className="traffic__desc">{desc}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

// 가로 막대 목록 (라벨 · 수 · 비율). limit 을 넘는 항목은 막대 대신 아래 "전체 보기" 펼침에 전부 나온다
function Bars({
  rows,
  labelOf,
  unit = "회",
  limit,
}: {
  rows: [string, number][];
  labelOf?: (k: string) => string;
  unit?: string;
  limit?: number;
}) {
  if (rows.length === 0) return <p className="traffic__empty">데이터 없음</p>;
  const total = Math.max(1, rows.reduce((a, r) => a + r[1], 0)); // 막대는 전체 대비 비율만큼만 찬다 (괄호 안 퍼센트와 같은 길이)
  const name = (k: string) => (labelOf ? labelOf(k) : k);
  const pct = (n: number) => Math.round((n / total) * 100);
  const shown = limit ? rows.slice(0, limit) : rows;
  return (
    <>
      <ul className="traffic__bars">
        {shown.map(([k, n]) => (
          <li key={k}>
            <span className="traffic__bar-label" title={k}>
              {name(k)}
            </span>
            <span className="traffic__bar-track">
              <span className="traffic__bar-fill" style={{ width: `${(n / total) * 100}%` }} />
            </span>
            <span className="traffic__bar-value">
              {n.toLocaleString()}
              {unit} <small>({pct(n)}%)</small>
            </span>
          </li>
        ))}
      </ul>
      {limit && rows.length > limit && (
        <details className="traffic__all">
          <summary>전체 보기 ({rows.length}개)</summary>
          <ol>
            {rows.map(([k, n]) => (
              <li key={k}>
                <span>{name(k)}</span>
                <strong>
                  {n.toLocaleString()}
                  {unit} ({pct(n)}%)
                </strong>
              </li>
            ))}
          </ol>
        </details>
      )}
    </>
  );
}

export async function TrafficView({ initPageResult, params, searchParams }: AdminViewServerProps) {
  const { req, permissions, visibleEntities, locale } = initPageResult;
  const { payload } = req;
  if (!req.user) redirect(`${payload.config.routes.admin}/login?redirect=${encodeURIComponent("/admin/traffic")}`);

  const periodParam = String(searchParams?.period ?? "today");
  const period: PeriodKey = (PERIODS.find((p) => p.key === periodParam)?.key ?? "today") as PeriodKey;
  const scopeParam = String(searchParams?.scope ?? "all");
  const scope: ScopeKey = (SCOPES.find((s) => s.key === scopeParam)?.key ?? "all") as ScopeKey;
  const href = (p: PeriodKey, s: ScopeKey) => `/admin/traffic?period=${p}&scope=${s}`;

  // 서버 컴포넌트라 요청마다 새로 실행된다. 렌더 중 현재 시각을 읽는 것이 의도 (react-hooks/purity 는 클라이언트 기준 규칙)
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();
  const since = new Date(now - DAYS * 86400000).toISOString();
  const [views, posts, categories] = await Promise.all([
    // 같은 초에 들어온 기록은 id 순으로 — 방문 안에서 첫 페이지·마지막 페이지 판정이 흔들리지 않게
    payload.find({ collection: "page-views", where: { createdAt: { greater_than_equal: since } }, pagination: false, depth: 0, sort: ["createdAt", "id"] }),
    // 발행된 글만 (초안·임시 글은 목록에 안 올린다)
    payload.find({
      collection: "posts",
      where: { _status: { equals: "published" } },
      pagination: false,
      depth: 1,
      select: { title: true, slug: true, category: true },
    }),
    payload.find({ collection: "categories", pagination: false, depth: 0 }),
  ]);

  // 경로 → 사람이 읽는 이름 (글 제목, 카테고리 이름)
  const pathName = new Map<string, string>([
    ["/", "홈페이지 메인"],
    ["/privacy", "개인정보처리방침"],
    ["/blog", "블로그 메인"],
    ["/blog/posts", "블로그 전체 글 목록"],
    ["/blog/search", "블로그 검색 페이지"],
  ]);
  // 홈페이지 메뉴 페이지 이름 (예: "망막클리닉 보임 · 비문증")
  for (const g of MENU) for (const p of g.pages) if (!p.external) pathName.set(pageHref(g, p), `${g.label} · ${p.label}`);
  const postPaths = new Set<string>();
  for (const c of categories.docs) pathName.set(`/blog/${c.slug}`, `${c.name} 글 목록`);
  for (const p of posts.docs) {
    const cat = typeof p.category === "object" && p.category ? p.category.slug : null;
    if (cat && p.slug) {
      pathName.set(`/blog/${cat}/${p.slug}`, p.title);
      postPaths.add(`/blog/${cat}/${p.slug}`);
    }
  }
  // 공지사항·후기 상세 등 메뉴에 없는 홈페이지 경로는 앞부분 메뉴 이름으로
  const siteFallbackName = (path: string) => {
    const [, g, p] = path.split("/");
    const base = g && p ? pathName.get(`/${g}/${p}`) : undefined;
    return base ? `${base} 상세` : path;
  };
  const decode = (path: string) => {
    try {
      return decodeURIComponent(path);
    } catch {
      return path;
    }
  };
  const nameOf = (path: string) => pathName.get(path) ?? (isBlogPath(path) ? path : siteFallbackName(path));
  // 한글 URL 은 기록에 인코딩된 채(%EB…) 들어오므로 집계 전에 전부 풀어서 글 목록 경로와 같은 모양으로 맞춘다
  const allRows = (views.docs as PageViewRow[]).map((r) => ({ ...r, path: decode(r.path) }));
  // 탭에 따라 홈페이지 / 블로그 기록만 남긴다
  const rows = scope === "all" ? allRows : allRows.filter((r) => (scope === "blog" ? isBlogPath(r.path) : !isBlogPath(r.path)));
  // "많이 본 페이지" 대상: 블로그 탭은 글만, 홈페이지 탭은 모든 페이지, 전체는 글 + 홈페이지 페이지
  const isCountedPage = (path: string) => (scope === "blog" ? postPaths.has(path) : scope === "site" ? true : postPaths.has(path) || !isBlogPath(path));
  const stats = computeTrafficStats(rows, period, now, isCountedPage);
  const maxHourly = Math.max(1, ...stats.hourly);
  const maxDaily = Math.max(1, ...stats.daily.map((d) => d.sessions));
  const topSource = stats.sources[0];

  return (
    <DefaultTemplate
      i18n={req.i18n}
      locale={locale}
      params={params}
      payload={payload}
      permissions={permissions}
      searchParams={searchParams}
      user={req.user}
      visibleEntities={visibleEntities}
      viewType="dashboard"
    >
      <TrafficStepNav />
      {/* 글 편집 화면의 상단 바처럼, 스크롤해도 제목·기간 선택이 반투명 띠로 따라온다 */}
      <div className="traffic__sticky">
        <Gutter className="traffic__head">
          <h1>유입 관리</h1>
          <div className="traffic__tabs">
            {/* 홈페이지 / 웹블로그 구분 */}
            <nav className="traffic__periods traffic__scopes" aria-label="구분">
              {SCOPES.map((s) => (
                <a key={s.key} href={href(period, s.key)} className={s.key === scope ? "is-on" : ""}>
                  {s.label}
                </a>
              ))}
            </nav>
            <nav className="traffic__periods" aria-label="기간">
              {PERIODS.map((p) => (
                <a key={p.key} href={href(p.key, scope)} className={p.key === period ? "is-on" : ""}>
                  {p.label}
                </a>
              ))}
            </nav>
          </div>
        </Gutter>
      </div>
      <Gutter className="traffic">
        {rows.length === 0 && (
          <div className="traffic__card traffic__empty-card">
            아직 수집된 방문 데이터가 없습니다.
            <br />
            방문이 기록되면 여기에 유입·이탈 통계가 표시됩니다.
          </div>
        )}

        {/* 요약 */}
        <div className="traffic__stats">
          {(
            [
              [IconUsers, "#0ea5e9", "방문자 수", `${stats.sessions.toLocaleString()}명`, "선택 기간 방문 고객"],
              [IconEye, "#6366f1", "본 페이지 수", `${stats.pageViews.toLocaleString()}회`, "고객들이 열어본 페이지"],
              [
                IconDoorExit,
                "#f59e0b",
                "즉시 이탈률",
                `${stats.bounceRate}%`,
                // 모바일에서만 줄바꿈 (PC 는 한 줄)
                <>
                  한 페이지만 보고 이탈 <br className="traffic__br-mobile" />({stats.bounced.toLocaleString()}명)
                </>,
              ],
              [IconClock, "#22c55e", "평균 머문 시간", fmtDuration(stats.avgDurationSec), "한 명이 머문 평균 시간"],
            ] as [TablerIcon, string, string, string, React.ReactNode][]
          ).map(([Icon, tint, label, value, sub]) => (
            <div key={label} className="traffic__stat" style={{ borderTopColor: tint }}>
              <span>
                <i className="traffic__stat-icon" style={{ background: `${tint}1f`, color: tint }}>
                  <Icon size={20} stroke={2} />
                </i>
                {label}
              </span>
              <strong>{value}</strong>
              <em>{sub}</em>
            </div>
          ))}
        </div>

        {topSource && stats.sessions > 0 && (
          <p className="traffic__lead">
            <i className="traffic__lead-icon">
              <IconTrendingUp size={22} stroke={2.2} />
            </i>
            {/* 문장은 한 덩어리로 묶는다 (모바일에서 flex 로 아이콘 옆에 세울 때 조각나지 않게) */}
            <span className="traffic__lead-text">
              고객이 가장 많이 들어온 곳은 <strong>{sourceLabel(topSource[0])}</strong>이에요 — 전체 방문자의{" "}
              <strong>{Math.round((topSource[1] / stats.sessions) * 100)}%</strong>
            </span>
          </p>
        )}

        <div className="traffic__grid">
          <Card icon={IconMapPin} title="어디서 들어왔나요?" desc="고객들이 우리 사이트를 찾은 경로">
            <Bars rows={stats.sources} labelOf={sourceLabel} unit="명" />
          </Card>
          <Card icon={IconDeviceMobile} title="무엇으로 봤나요?" desc="휴대폰·컴퓨터 등 접속 기기">
            <Bars rows={stats.devices} labelOf={(k) => DEVICE_LABEL[k] ?? k} unit="명" />
          </Card>
        </div>

        <Card icon={IconCalendarWeek} title="날짜별 방문자" desc="최근 14일 동안 하루에 몇 명이 왔는지">
          {/* 좁은 화면에서는 가로로 밀어 본다 (최근 날짜가 먼저 보이도록 오른쪽 끝에서 시작) */}
          <div className="traffic__daily-scroll">
          <div className="traffic__daily">
            {stats.daily.map((d) => (
              <div key={d.day} className="traffic__day" title={`${d.day} · ${d.sessions}명`}>
                <span className="traffic__day-bar" style={{ height: `${Math.max(2, (d.sessions / maxDaily) * 100)}%` }} />
                <span className="traffic__day-value">{d.sessions || ""}</span>
                <span className="traffic__day-label">{d.label}</span>
              </div>
            ))}
          </div>
          </div>
        </Card>

        <div className="traffic__grid">
          {scope !== "site" && (
          <Card icon={IconArticle} title="많이 본 글" desc="고객들이 가장 많이 읽은 글 (상위 10편)">
            <Bars rows={stats.topPaths} labelOf={nameOf} />
            {/* 전체 글: 0회인 글까지 조회수 순으로 */}
            <details className="traffic__all">
              <summary>전체 글 보기 ({postPaths.size}편)</summary>
              <ol>
                {[...postPaths]
                  .map((p) => [p, stats.pathCounts[p] ?? 0] as [string, number])
                  .sort((a, b) => b[1] - a[1] || nameOf(a[0]).localeCompare(nameOf(b[0]), "ko"))
                  .map(([p, n]) => (
                    <li key={p}>
                      <span>{nameOf(p)}</span>
                      <strong>{n.toLocaleString()}회</strong>
                    </li>
                  ))}
              </ol>
            </details>
          </Card>
          )}
          {scope !== "blog" && (
            <Card icon={IconClock} title="언제 많이 오나요?" desc="하루 중 방문이 몰리는 시간대 (0~23시)">
              <div className="traffic__hourly">
                {stats.hourly.map((n, h) => (
                  <div key={h} className="traffic__hour" title={`${h}시 · ${n}명`}>
                    <span className="traffic__hour-bar" style={{ height: `${Math.max(2, (n / maxHourly) * 100)}%` }} />
                    {h % 6 === 0 && <span className="traffic__hour-label">{h}시</span>}
                  </div>
                ))}
              </div>
            </Card>
          )}
          {scope !== "site" && (
            <Card icon={IconFileSearch} title="방문자가 첫 번째로 연 글" desc="네이버·구글 검색으로 들어온 고객이 처음 연 글">
              {stats.landingBySearch.length === 0 && <p className="traffic__empty">데이터 없음</p>}
              {stats.landingBySearch.map(({ source, rows }) => (
                <div key={source} className="traffic__sub">
                  <h3>{SOURCE_LABEL[source] ?? source}</h3>
                  <Bars rows={rows} labelOf={nameOf} unit="명" limit={10} />
                </div>
              ))}
            </Card>
          )}
          {scope !== "site" && (
            <Card icon={IconSearch} title="무엇을 검색했나요?" desc="방문자가 웹블로그 검색창에 친 단어입니다">
              <Bars rows={stats.queries} limit={10} />
            </Card>
          )}
          <Card icon={IconLogout} title="어느 페이지에서 나갔나요?" desc="고객이 마지막으로 보고 떠난 페이지">
            <Bars rows={stats.exitPages} labelOf={nameOf} unit="명" limit={10} />
          </Card>
        </div>
      </Gutter>
    </DefaultTemplate>
  );
}
