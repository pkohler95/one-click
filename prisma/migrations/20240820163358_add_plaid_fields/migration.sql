/*
  Warnings:

  - A unique constraint covering the columns `[plaidItemId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "plaidAccessToken" TEXT,
ADD COLUMN     "plaidInstitutionId" TEXT,
ADD COLUMN     "plaidItemId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_plaidItemId_key" ON "User"("plaidItemId");
