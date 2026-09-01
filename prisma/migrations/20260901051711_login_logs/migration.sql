-- CreateTable
CREATE TABLE "login_logs" (
    "id" SERIAL NOT NULL,
    "member_id" INTEGER NOT NULL,
    "ip" TEXT NOT NULL,
    "user_agent" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "login_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "login_logs_member_id_idx" ON "login_logs"("member_id");

-- AddForeignKey
ALTER TABLE "login_logs" ADD CONSTRAINT "login_logs_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;
