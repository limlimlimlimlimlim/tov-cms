/*
  Warnings:

  - You are about to drop the column `wingCode` on the `Schedule` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Schedule` DROP COLUMN `wingCode`,
    ADD COLUMN `wingCodes` TEXT NULL;
