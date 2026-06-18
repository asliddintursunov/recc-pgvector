/*
  Warnings:

  - You are about to drop the column `purchaseDate` on the `PurchaseHistory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PurchaseHistory" DROP COLUMN "purchaseDate",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
