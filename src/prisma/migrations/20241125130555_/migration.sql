/*
  Warnings:

  - You are about to drop the column `followed` on the `Followers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Followers" DROP COLUMN "followed",
ADD COLUMN     "followedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
