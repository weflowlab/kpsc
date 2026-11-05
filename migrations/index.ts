/* Payload(블로그) 마이그레이션 묶음.
   운영(Postgres/Neon)에서 onInit 때 실행되고, dev-migrate 라우트에서도 쓰인다.
   blog 스키마용 마이그레이션은 Postgres 로 dev 를 띄운 뒤
   `npm run payload:migrate-create` 로 생성해 이 배열에 추가한다. (처음엔 비어 있음) */
export const migrations: { up: unknown; down: unknown; name: string }[] = [];
