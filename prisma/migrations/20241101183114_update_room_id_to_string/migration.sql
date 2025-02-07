/*
  Warnings:

  - A unique constraint covering the columns `[sessionId]` on the table `Player` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sessionId` to the `Player` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "sessionId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Player_sessionId_key" ON "Player"("sessionId");
