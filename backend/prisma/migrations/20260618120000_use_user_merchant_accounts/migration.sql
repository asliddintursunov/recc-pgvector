-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT IF EXISTS "Product_creatorId_fkey";

-- Convert Product ownership from Merchant.id back to the merchant User.id.
UPDATE "Product" p
SET "creatorId" = m."userId"
FROM "Merchant" m
WHERE p."creatorId" = m."id";

-- Rename ownership column to match the current Prisma schema.
ALTER TABLE "Product" RENAME COLUMN "creatorId" TO "merchantId";

-- DropForeignKey
ALTER TABLE "Merchant" DROP CONSTRAINT IF EXISTS "Merchant_userId_fkey";

-- DropTable
DROP TABLE "Merchant";

-- CreateIndex
CREATE INDEX "Product_merchantId_idx" ON "Product"("merchantId");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
