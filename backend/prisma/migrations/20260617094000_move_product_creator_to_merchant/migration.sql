-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT IF EXISTS "Product_creatorId_fkey";

-- Backfill merchant accounts for users that already own products.
INSERT INTO "Merchant" ("id", "userId", "createdAt", "updatedAt")
SELECT u."id", u."id", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "User" u
WHERE EXISTS (
    SELECT 1
    FROM "Product" p
    WHERE p."creatorId" = u."id"
)
AND NOT EXISTS (
    SELECT 1
    FROM "Merchant" m
    WHERE m."userId" = u."id"
);

-- Convert existing Product.creatorId values from User.id to Merchant.id.
UPDATE "Product" p
SET "creatorId" = m."id"
FROM "Merchant" m
WHERE p."creatorId" = m."userId";

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Merchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
