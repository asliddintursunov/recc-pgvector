-- CreateEnum
CREATE TYPE "USER_ROLE" AS ENUM ('admin', 'merchant', 'customer');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "USER_ROLE" NOT NULL DEFAULT 'customer';
