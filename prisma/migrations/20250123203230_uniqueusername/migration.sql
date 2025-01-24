/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "photoUser" DROP NOT NULL,
ALTER COLUMN "localisation" DROP NOT NULL,
ALTER COLUMN "pieceIdf" DROP NOT NULL,
ALTER COLUMN "pieceIdb" DROP NOT NULL,
ALTER COLUMN "dateNaiss" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
