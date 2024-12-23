/*
  Warnings:

  - You are about to drop the column `followedAt` on the `Followers` table. All the data in the column will be lost.
  - You are about to drop the column `viewedAt` on the `Views` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Followers" DROP COLUMN "followedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Views" DROP COLUMN "viewedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
