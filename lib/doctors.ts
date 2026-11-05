/** 의료진 데이터 (기존 홈페이지 의료진소개 기준) — 메인·의료진·망막클리닉 페이지 공통 */

export type Clinic = "outpatient" | "retina";

/** 진료시간표 한 칸: 기존 표기 그대로 (진료 / 수술 / 휴진 "-" / 빈칸 "") + 칸 안 안내 문구 */
export type ScheduleCell = "진료" | "수술" | "진료·라섹" | "-" | "" | { note: string };

/** 진료시간표 한 행: 월~토 6칸 */
export type ScheduleRow = {
  period: "오전" | "오후";
  time: string;
  slots: [ScheduleCell, ScheduleCell, ScheduleCell, ScheduleCell, ScheduleCell, ScheduleCell];
};

export const WEEKDAYS = ["월", "화", "수", "목", "금", "토"] as const;

// 09:00~09:30 첫 행: 기존 홈페이지에서 평일은 빈칸, 토요일 진료 의사는 "08:30부터" 안내
const NONE: ScheduleRow["slots"] = ["", "", "", "", "", ""];
const SAT_EARLY: ScheduleRow["slots"] = ["", "", "", "", "", { note: "토요일 진료 08:30부터" }];

export type Doctor = {
  slug: string;
  name: string;
  nameEn: string;
  title: string;
  clinic: Clinic;
  /** 진료 분야 (기존 표기 그대로) */
  specialties: string[];
  /** 진료 철학 한마디 */
  motto: string;
  /** 약력: 약력(학력·수련) / 현 / 전 */
  careers: { label: string; items: string[] }[];
  /** 요일별(월~토) 진료시간표 — 오전/오후 행 */
  schedule: ScheduleRow[];
  /** 진료시간표 아래 안내 (토요일 휴진 주차 등) */
  scheduleNotes?: string[];
  /** 예약 진료만 가능 */
  reservationOnly?: boolean;
};

export const CLINIC_LABEL: Record<Clinic, string> = {
  outpatient: "외래클리닉",
  retina: "망막클리닉 보임",
};

export const DOCTORS: Doctor[] = [
  {
    slug: "yoo-tae-young",
    name: "유태영",
    nameEn: "Yoo, Tae Young",
    title: "원장",
    clinic: "outpatient",
    specialties: ["안성형", "소아안과", "백내장", "녹내장", "시력교정수술"],
    motto: "최고의 진료는 환자와의 약속",
    careers: [
      { label: "약력", items: ["전북대학교 의과대학 졸업", "전주예수병원 안과 전문의"] },
      { label: "현", items: ["한국 외안부학회 정회원", "한국 백내장 굴절수술학회 정회원", "한국 콘택트렌즈학회 정회원", "한국 사시 소아안과학회 정회원", "안성형 연구회 정회원", "미국 백내장 굴절수술학회(ASCRS) 정회원", "전북대학교 의과대학 외래교수", "MBC 라디오 특진 “건강속으로” 출연"] },
      { label: "전", items: ["중앙안과 원장", "유태영안과 원장", "First International Oculoplasty Workshop 수료", "심미안 국제안검성형 Workshop 수료", "행정자치부장관상 수상 (지역발전 기여)"] },
    ],
    schedule: [
      { period: "오전", time: "09:00~09:30", slots: NONE },
      { period: "오전", time: "09:30~11:00", slots: ["진료", "수술", "-", "진료", "진료", "-"] },
      { period: "오전", time: "11:00~12:30", slots: ["진료", "수술", "-", "진료", "진료", "-"] },
      { period: "오후", time: "02:00~04:00", slots: ["수술", "진료", "-", "수술", "수술", "-"] },
      { period: "오후", time: "04:00~06:00", slots: ["수술", "진료", "-", "수술", "수술", "-"] },
    ],
  },
  {
    slug: "kim-han-gyu",
    name: "김한규",
    nameEn: "Kim, Han Gyu",
    title: "원장",
    clinic: "retina",
    specialties: ["망막", "포도막", "백내장", "녹내장", "시력교정수술"],
    motto: "항상 큰 수술에 임하듯 세심한 마음으로",
    careers: [
      { label: "약력", items: ["전북대학교 의과대학 박사", "미국 의사면허(USMLE) 보유"] },
      { label: "현", items: ["한국 망막학회 정회원", "미국 백내장 굴절수술학회(ASCRS) 정회원", "한국 백내장 굴절수술학회 정회원", "한국 외안부학회 정회원", "주한미군 자문의사", "미국 Lions 안은행 자문의사", "전북대학교 의과대학 외래교수", "MBC 라디오 특진 “건강속으로” 출연"] },
      { label: "전", items: ["국군진해병원 안과과장", "마산 예일안과 원장", "미 해군 의무사령관 표창 (미 해군 의료진과의 협진 공로)", "Captain, Medical Corps, United States Navy, Commanding Officer", "독일 프랑크푸르트 Municipal Hospital 연수", "행정자치부장관상 수상 (지역발전 기여)"] },
    ],
    schedule: [
      { period: "오전", time: "09:00~09:30", slots: NONE },
      { period: "오전", time: "09:30~11:00", slots: ["진료", "수술", "진료", "수술", "-", "-"] },
      { period: "오전", time: "11:00~12:30", slots: ["진료", "수술", "진료", "수술", "-", "-"] },
      { period: "오후", time: "02:00~04:00", slots: ["진료", "진료", "수술", "진료", "-", "-"] },
      { period: "오후", time: "04:00~06:00", slots: ["진료", "진료", "수술", "진료", "-", "-"] },
    ],
    reservationOnly: true,
  },
  {
    slug: "yoon-sang-won",
    name: "윤상원",
    nameEn: "Yoon, Sang Won",
    title: "원장",
    clinic: "outpatient",
    specialties: ["사시", "백내장", "녹내장", "시력교정수술"],
    motto: "행복, 나와 너 우리 모두가",
    careers: [
      { label: "약력", items: ["전북대학교 의과대학 졸업", "전북대학교병원 안과 전문의"] },
      { label: "현", items: ["한국 외안부학회 정회원", "미국 백내장 굴절수술학회(ASCRS) 정회원", "한국 백내장 굴절수술학회 정회원", "한국 콘택트렌즈학회 정회원", "사시 소아안과학회 정회원", "자폐인사랑협회 전북지부장", "사단법인 담장너머 이사장", "MBC 라디오 특진 “건강속으로” 출연"] },
      { label: "전", items: ["서울 영등포 김안과병원 소아안과 전임의", "익산 우리들안과 원장", "전주예수병원 안과과장"] },
    ],
    schedule: [
      { period: "오전", time: "09:00~09:30", slots: SAT_EARLY },
      { period: "오전", time: "09:30~11:00", slots: ["진료", "진료", "수술", "-", "진료", "진료"] },
      { period: "오전", time: "11:00~12:30", slots: ["수술", "진료", "진료", "-", "진료", "진료"] },
      { period: "오후", time: "02:00~04:00", slots: ["진료", "수술", "진료", "-", "수술", "-"] },
      { period: "오후", time: "04:00~06:00", slots: ["진료", "수술", "수술", "-", "수술", "-"] },
    ],
    scheduleNotes: ["매월 1·3·5주 토요일 휴진"],
  },
  {
    slug: "cha-dong-min",
    name: "차동민",
    nameEn: "Cha, Dong Min",
    title: "원장",
    clinic: "retina",
    specialties: ["망막", "포도막", "백내장", "녹내장", "시력교정수술"],
    motto: "더 맑은 내일을 위해 끊임없이 노력하겠습니다.",
    careers: [
      { label: "약력", items: ["서울대학교 의과대학 졸업", "서울대학교병원 안과 전문의", "서울대학교 대학원 의학과 석사"] },
      { label: "현", items: ["대한안과학회 정회원", "한국망막학회 정회원", "한국포도막학회 정회원", "MBC 라디오 특진 “건강속으로” 출연"] },
      { label: "전", items: ["서울대학교병원 망막 임상강사", "국립제주대학교 조교수"] },
    ],
    schedule: [
      { period: "오전", time: "09:00~09:30", slots: SAT_EARLY },
      { period: "오전", time: "09:30~11:00", slots: ["수술", "진료", "-", "진료", "수술", "진료"] },
      { period: "오전", time: "11:00~12:30", slots: ["수술", "진료", "-", "진료", "수술", "진료"] },
      { period: "오후", time: "02:00~04:00", slots: ["진료", "수술", "-", "진료", "진료", "-"] },
      { period: "오후", time: "04:00~06:00", slots: ["진료", "수술", "-", "수술", "진료", "-"] },
    ],
    scheduleNotes: ["매월 4주 토요일 휴진"],
    reservationOnly: true,
  },
  {
    slug: "kang-haeng-ku",
    name: "강행구",
    nameEn: "Kang, Haeng Ku",
    title: "원장",
    clinic: "outpatient",
    specialties: ["각막", "콘택트렌즈", "백내장", "녹내장", "시력교정수술"],
    motto: "모든 분을 가족을 대하는 마음으로 뵙겠습니다.",
    careers: [
      { label: "약력", items: ["인하대학교 의과대학 졸업", "인하대학교병원 안과 전문의"] },
      { label: "현", items: ["대한안과학회 정회원", "한국 백내장 굴절수술학회 정회원", "한국 콘택트렌즈학회 정회원", "한국 외안부학회 정회원", "한국 항공우주의학회 정회원", "푸른안과 원장"] },
      { label: "전", items: ["17전투비행단 항공의무실장"] },
    ],
    schedule: [
      { period: "오전", time: "09:00~09:30", slots: SAT_EARLY },
      { period: "오전", time: "09:30~11:00", slots: ["진료", "-", "진료", "수술", "수술", "진료"] },
      { period: "오전", time: "11:00~12:30", slots: ["진료", "-", "수술", "수술", "수술", "진료"] },
      { period: "오후", time: "02:00~04:00", slots: ["진료", "-", "진료", "진료", "진료", "-"] },
      { period: "오후", time: "04:00~06:00", slots: ["수술", "-", "진료", "진료", "진료", "-"] },
    ],
    scheduleNotes: ["매월 2주 토요일 휴진"],
  },
  {
    slug: "park-young-myoung",
    name: "박영명",
    nameEn: "Park, Young Myoung",
    title: "원장",
    clinic: "retina",
    specialties: ["망막", "포도막", "백내장", "녹내장"],
    motto: "겸손한 마음과 손길로 신뢰를 쌓아가겠습니다.",
    careers: [
      { label: "약력", items: ["전북대학교 자연대학 수석 졸업", "전북대학교 학군단(ROTC) 42기", "전북대학교 수의학 석사", "전북대학교 의학전문대학원 수석 졸업", "전북대학교 의학 석사", "전북대학교병원 안과 전임의"] },
      { label: "현", items: ["대한안과학회 정회원", "푸른안과 원장"] },
      { label: "전", items: ["전북대학교병원 망막 진료교수"] },
    ],
    schedule: [
      { period: "오전", time: "09:00~09:30", slots: SAT_EARLY },
      { period: "오전", time: "09:30~11:00", slots: ["진료", "진료", "진료", "진료", "진료", "진료"] },
      { period: "오전", time: "11:00~12:30", slots: ["진료", "진료", "진료", "수술", "진료", "진료"] },
      { period: "오후", time: "02:00~04:00", slots: ["수술", "진료", "수술", "진료", "-", "-"] },
      { period: "오후", time: "04:00~06:00", slots: ["수술", "진료", "진료", "진료", "-", "-"] },
    ],
  },
  {
    slug: "eun-jun-soo",
    name: "은준수",
    nameEn: "Eun, Jun Soo",
    title: "원장",
    clinic: "retina",
    specialties: ["망막", "포도막", "백내장", "녹내장"],
    motto: "정성을 다해 세심히 진료하겠습니다.",
    careers: [
      { label: "약력", items: ["조선대학교 의학전문대학원 졸업", "단국대학교병원 안과 전문의", "삼성서울병원 망막 전임의"] },
      { label: "현", items: ["대한안과학회 정회원", "미국안과학회 정회원", "한국망막학회 정회원", "대한검안학회 정회원", "한국 콘택트렌즈학회 정회원", "한국 백내장 굴절수술학회 정회원", "푸른안과 원장"] },
      { label: "전", items: ["천안서울안과 원장", "가천대 길병원 망막 임상강사"] },
    ],
    schedule: [
      { period: "오전", time: "09:00~09:30", slots: SAT_EARLY },
      { period: "오전", time: "09:30~11:00", slots: ["진료", "-", "진료", "진료", "진료", "진료"] },
      { period: "오전", time: "11:00~12:30", slots: ["진료", "-", "수술", "진료", "수술", "진료"] },
      { period: "오후", time: "02:00~04:00", slots: ["진료", "진료", "진료", "수술", "진료", "-"] },
      { period: "오후", time: "04:00~06:00", slots: ["진료", "진료", "진료", "수술", "진료", "-"] },
    ],
  },
  {
    slug: "jeong-hyun-jin",
    name: "정현진",
    nameEn: "Jeong, Hyun Jin",
    title: "원장",
    clinic: "outpatient",
    specialties: ["각막", "콘택트렌즈", "백내장", "녹내장", "시력교정수술"],
    motto: "소중한 눈을 위해 최선을 다하겠습니다.",
    careers: [
      { label: "약력", items: ["동아대학교 의과대학 졸업", "가톨릭중앙의료원 안과 전문의", "서울성모병원 녹내장 전임의"] },
      { label: "현", items: ["대한안과학회 정회원", "한국녹내장학회 정회원", "한국포도막학회 정회원", "한국 외안부학회 정회원", "대한검안학회 정회원", "한국 콘택트렌즈학회 정회원", "한국 백내장 굴절수술학회 정회원", "유럽 백내장 굴절수술학회 정회원"] },
      { label: "전", items: ["가톨릭대학교 안과학교실 외래교수", "소중한빛안과 원장"] },
    ],
    schedule: [
      { period: "오전", time: "09:00~09:30", slots: SAT_EARLY },
      { period: "오전", time: "09:30~11:00", slots: ["-", "진료", "진료", "진료", "진료", "진료"] },
      { period: "오전", time: "11:00~12:30", slots: ["-", "진료", "진료", "진료", "진료", "진료"] },
      { period: "오후", time: "02:00~04:00", slots: ["진료", "진료", "진료", "진료", "진료", "-"] },
      { period: "오후", time: "04:00~06:00", slots: ["진료", "진료", "진료·라섹", "진료", "진료·라섹", "-"] },
    ],
  },
];
