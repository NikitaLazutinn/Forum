/*
  Warnings:

  - You are about to drop the column `PostId` on the `comment` table. All the data in the column will be lost.
  - You are about to drop the column `UserId` on the `comment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "comment" DROP COLUMN "PostId",
DROP COLUMN "UserId";
