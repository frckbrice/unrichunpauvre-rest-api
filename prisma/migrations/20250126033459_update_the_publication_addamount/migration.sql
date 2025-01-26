/*
  Warnings:

  - Added the required column `montantEstime` to the `Publication` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Publication" ADD COLUMN     "montantEstime" DOUBLE PRECISION NOT NULL;
