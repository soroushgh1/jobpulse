/*
  Warnings:

  - Added the required column `degree` to the `Position` table without a default value. This is not possible if the table is not empty.
  - Added the required column `salary` to the `Position` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Position" ADD COLUMN     "degree" TEXT NOT NULL,
ADD COLUMN     "salary" TEXT NOT NULL;
