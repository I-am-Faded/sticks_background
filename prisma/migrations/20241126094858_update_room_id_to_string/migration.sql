/*
  Warnings:

  - Added the required column `typeBoard` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "typeBoard" TEXT NOT NULL;
