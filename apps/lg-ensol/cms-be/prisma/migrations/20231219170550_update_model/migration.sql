/*
  Warnings:

  - You are about to drop the column `time` on the `Facility` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Facility` DROP COLUMN `time`,
    ADD COLUMN `description` TEXT NULL;
