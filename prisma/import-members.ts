/* ==========================================================================
   기존 사이트(helplus.kr 관리자) 회원 8명 이관 스크립트
   실행: npx tsx prisma/import-members.ts
   - 데이터 출처: 구 관리자 mbr_manager.php 화면 (2026-09-01 캡처)
   - 비밀번호는 구 DB 에서 가져올 수 없으므로 무작위 임시값으로 넣는다.
     각 회원은 로그인 화면의 [ID/PW 찾기]에서 이름+휴대폰 확인 후
     새 비밀번호를 직접 설정하면 된다.
   - 이메일은 캡처에 없어 임시값(아이디@kpsc.local)으로 넣는다.
   - 이미 같은 아이디가 있으면 건너뛴다(재실행 안전)
   ========================================================================== */

import "dotenv/config";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import type { MemberGrade } from "../lib/generated/prisma/enums";

const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL }),
});

/* 구 관리자 화면 표기 그대로 */
const MEMBERS: {
  name: string;
  loginId: string;
  phone: string;
  grade: MemberGrade;
  cash: number;
  points: number;
  joined: string; // yyyy-mm-dd
}[] = [
  { name: "동남이", loginId: "nurboory", phone: "010-4736-6462", grade: "VVIP", cash: 320000, points: 520000, joined: "2026-06-01" },
  { name: "KPSC운영관리단", loginId: "Master1", phone: "010-0402-2022", grade: "ADMIN", cash: 320000, points: 520000, joined: "2026-05-07" },
  { name: "KPSC", loginId: "ROOT", phone: "010-0402-1337", grade: "ADMIN", cash: 320000, points: 520000, joined: "2026-05-06" },
  { name: "박수아", loginId: "psa0516", phone: "010-5880-7432", grade: "ADMIN", cash: 320000, points: 520000, joined: "2026-05-06" },
  { name: "황지선", loginId: "adg0322", phone: "010-2619-7702", grade: "NORMAL", cash: 320000, points: 520000, joined: "2026-05-03" },
  { name: "보안팀", loginId: "manager2", phone: "010-0402-8883", grade: "NORMAL", cash: 320000, points: 520000, joined: "2026-05-03" },
  { name: "SNS운영팀", loginId: "manager1", phone: "010-0402-9999", grade: "NORMAL", cash: 320000, points: 520000, joined: "2026-05-03" },
  { name: "양채연", loginId: "partners", phone: "010-5701-4920", grade: "ADMIN", cash: 2320000, points: 520000, joined: "2026-05-03" },
];

async function main() {
  for (const m of MEMBERS) {
    const exists = await prisma.member.findUnique({
      where: { loginId: m.loginId },
      select: { id: true },
    });
    if (exists) {
      console.log(`- ${m.loginId}: 이미 존재, 건너뜀`);
      continue;
    }

    /* 아무도 모르는 임시 비밀번호 — ID/PW 찾기로 재설정해야 로그인 가능 */
    const tempPassword = crypto.randomBytes(24).toString("base64url");

    await prisma.member.create({
      data: {
        loginId: m.loginId,
        password: await bcrypt.hash(tempPassword, 10),
        name: m.name,
        email: `${m.loginId.toLowerCase()}@kpsc.local`, // 임시 — 실제 이메일 확인 후 교체
        phone: m.phone,
        grade: m.grade,
        cash: m.cash,
        points: m.points,
        createdAt: new Date(`${m.joined}T00:00:00Z`),
      },
    });
    console.log(`+ ${m.loginId} (${m.name}) 등록 — 등급 ${m.grade}`);
  }
  console.log("완료. 각 회원은 [ID/PW 찾기]에서 이름+휴대폰으로 비밀번호를 설정하면 됩니다.");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
