-- CreateEnum
CREATE TYPE "MemberType" AS ENUM ('PERSONAL', 'BUSINESS');

-- CreateEnum
CREATE TYPE "MemberStatus" AS ENUM ('APPROVED', 'PENDING');

-- AlterTable
ALTER TABLE "members" ADD COLUMN     "member_type" "MemberType" NOT NULL DEFAULT 'PERSONAL',
ADD COLUMN     "status" "MemberStatus" NOT NULL DEFAULT 'APPROVED';
