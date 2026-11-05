/** 장비 설명 한 줄: 문자열 또는 { b } (굵게) 조각의 배열 */
export type Seg = string | { b: string };

/** 장비 페이지 필터 분류 */
export type EquipGroup = "exam" | "surgery" | "laser";
export const EQUIP_GROUPS: { key: EquipGroup; label: string }[] = [
  { key: "exam", label: "검사 장비" },
  { key: "surgery", label: "수술 장비" },
  { key: "laser", label: "레이저 장비" },
];

export type Equipment = {
  /** 모델명 (기존 홈페이지 표기 기준) */
  model: string;
  group: EquipGroup;
  /** 제조사 (국가) */
  maker: string;
  /** 장비 분류 (한글) */
  category: string;
  /** 기존 홈페이지 장비 사진 그대로 사용 (536×428, WebP 변환본) — 없으면 플레이스홀더 */
  image?: string;
  /** 특징 — 의료 내용이므로 병원 검토 필요 */
  points: Seg[][];
};

/** 첨단 의료장비 — 기존 홈페이지(첨단의료장비 메뉴) 순서·사진 그대로 */
export const EQUIPMENTS: Equipment[] = [
  {
    model: "VisuMax",
    group: "laser",
    maker: "ZEISS (독일)",
    category: "펨토초 레이저",
    image: "/images/equipment/visumax.webp",
    points: [[{ b: "스마일라식(SMILE)" }, " 시력교정에 사용하는 펨토초 레이저"], ["정밀한 각막 수술 지원"]],
  },
  {
    model: "Centurion",
    group: "surgery",
    maker: "Alcon (미국)",
    category: "백내장 수술 장비",
    image: "/images/equipment/centurion.webp",
    points: [["초음파로 혼탁해진 수정체를 제거하는 ", { b: "백내장 수술 장비" }], ["수술 중 안압을 실시간으로 조절"]],
  },
  {
    model: "Constellation",
    group: "surgery",
    maker: "Alcon (미국)",
    category: "유리체 절제술 장비",
    image: "/images/equipment/constellation.webp",
    points: [[{ b: "망막·유리체 수술" }, "을 위한 통합 수술 시스템"], ["고속 절삭 및 레이저 기능 내장"]],
  },
  {
    model: "Optos Daytona",
    group: "exam",
    maker: "Optos (영국)",
    category: "초광각 안저촬영기",
    image: "/images/equipment/optos-daytona.webp",
    points: [["망막의 ", { b: "넓은 범위를 한 번에" }, " 촬영"], ["주변부 망막 질환 확인"]],
  },
  {
    model: "Zeiss OCT HD5000 Angioflex",
    group: "exam",
    maker: "ZEISS (독일)",
    category: "빛간섭단층촬영 (OCT)",
    image: "/images/equipment/zeiss-oct-hd5000.webp",
    points: [["망막 단면을 고해상도로 촬영"], [{ b: "조영제 없이" }, " 망막 혈관 영상 확인"]],
  },
  {
    model: "Ellex Ultra Q Nd-YAG laser",
    group: "laser",
    maker: "Ellex (호주)",
    category: "YAG 레이저",
    image: "/images/equipment/ellex-ultra-q.webp",
    points: [[{ b: "후발성 백내장" }, " 레이저 치료"], ["레이저 홍채절개술 등에 활용"]],
  },
  {
    model: "Heidelberg Spectralis HRA",
    group: "exam",
    maker: "Heidelberg Engineering (독일)",
    category: "안저 혈관조영",
    image: "/images/equipment/heidelberg-spectralis.webp",
    points: [["형광·인도시아닌그린 ", { b: "혈관조영 촬영" }], ["황반변성 등 망막 혈관 질환 진단"]],
  },
  {
    model: "LUMERA700",
    group: "surgery",
    maker: "ZEISS (독일)",
    category: "안과 수술 현미경",
    image: "/images/equipment/lumera700.webp",
    points: [["백내장·망막 수술용 ", { b: "고배율 수술 현미경" }], ["선명하고 안정적인 수술 시야"]],
  },
  // ↓ 사이트 원고(시력교정·망막클리닉)에 나오는 장비 — 사진은 병원에서 받아 추가
  {
    model: "Allegretto EX500",
    group: "laser",
    maker: "Alcon (미국)",
    category: "엑시머 레이저",
    points: [[{ b: "라식·라섹" }, " 시력교정에 사용하는 엑시머 레이저"], ["각막 고유의 비구면 형태를 보존하는 교정"]],
  },
  {
    model: "Orbscan",
    group: "exam",
    maker: "Bausch & Lomb (미국)",
    category: "각막지형도 검사",
    points: [["각막 앞·뒷면의 ", { b: "모양과 두께" }, " 측정"], ["시력교정수술 전 각막 상태 확인"]],
  },
  {
    model: "VISUCAM FAG",
    group: "exam",
    maker: "ZEISS (독일)",
    category: "안저카메라 · 형광안저조영",
    points: [["45° 범위의 ", { b: "안저 촬영" }], ["당뇨망막병증·황반변성 등 진단"]],
  },
  {
    model: "Visulas 532s",
    group: "laser",
    maker: "ZEISS (독일)",
    category: "망막 레이저",
    points: [["532nm 파장의 ", { b: "망막 광응고술" }], ["망막열공·당뇨망막병증 치료"]],
  },
];

/** 사진이 있는 장비만 (메인 캐러셀 등 사진이 꼭 필요한 곳) */
export const EQUIPMENTS_WITH_PHOTO = EQUIPMENTS.filter((e): e is Equipment & { image: string } => !!e.image);
