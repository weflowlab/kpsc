/** 시력교정 클리닉 공통 데이터 — 수술 전 진료 시스템 페이지·메인 공통 */

// 33가지 수술 전 검사 (분류별) — [검사명, 장비·영문명]
export const EXAM_GROUPS: { title: string; items: [string, string?][] }[] = [
  {
    title: "시력 · 굴절",
    items: [
      ["시력검사"],
      ["근거리 시력검사"],
      ["자동 굴절검사", "ARK"],
      ["현성굴절검사", "MR"],
      ["조절마비굴절검사", "CR"],
      ["타각식 굴절검사", "Retinoscope"],
      ["안경도수검사"],
      ["고위수차분석검사", "Zywave"],
    ],
  },
  {
    title: "각막",
    items: [
      ["초음파 각막두께검사", "Pachymeter"],
      ["각막지형도검사", "Orbscan"],
      ["각막특수검사", "Oculyzer"],
      ["전안부 CT 검사", "Scheimpflug"],
      ["각막내피세포검사", "SM"],
      ["눈물량검사", "Schirmer test"],
    ],
  },
  {
    title: "안구 구조 · 기능",
    items: [
      ["안압검사", "IOP"],
      ["전방깊이검사", "ACD"],
      ["야간 동공크기검사", "Pupilometer"],
      ["안축장 길이검사", "Scan"],
      ["세극등검사"],
      ["사시검사"],
      ["DNA 유전자검사"],
    ],
  },
  {
    title: "망막 · 시신경",
    items: [
      ["안저촬영검사", "Fundus"],
      ["광각안저촬영검사", "Optos"],
      ["망막초음파검사", "B-Scan"],
      ["녹내장 단층촬영", "Glaucoma OCT"],
      ["망막단층촬영", "Macular OCT"],
      ["정밀시야검사", "Humphrey"],
      ["시유발전위검사", "VEP"],
      ["망막전위도검사", "ERG"],
      ["90D 렌즈검사"],
      ["3-mirror 검사"],
      ["주변부 망막검사"],
      ["망막검영기 검사"],
    ],
  },
];

/** 수술 전 검사 총 개수 */
export const EXAM_TOTAL = EXAM_GROUPS.reduce((n, g) => n + g.items.length, 0);
