-- CreateEnum
CREATE TYPE "BalanceKind" AS ENUM ('CASH', 'POINT');

-- AlterTable
ALTER TABLE "members" ADD COLUMN     "nickname" TEXT;

-- CreateTable
CREATE TABLE "balance_logs" (
    "id" SERIAL NOT NULL,
    "member_id" INTEGER NOT NULL,
    "kind" "BalanceKind" NOT NULL,
    "amount" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "balance_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "balance_logs_member_id_kind_idx" ON "balance_logs"("member_id", "kind");

-- AddForeignKey
ALTER TABLE "balance_logs" ADD CONSTRAINT "balance_logs_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;
