/*
  Warnings:

  - Added the required column `documentUrl` to the `Publication` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Donation" ALTER COLUMN "nomDons" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Publication" ADD COLUMN     "documentUrl" TEXT NOT NULL;
