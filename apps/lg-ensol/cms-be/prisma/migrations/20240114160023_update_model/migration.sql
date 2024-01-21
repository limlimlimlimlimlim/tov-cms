/*
  Warnings:

  - You are about to drop the column `facilityId` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Facility` MODIFY `iconColor` VARCHAR(191) NULL DEFAULT '#D91700';

-- AlterTable
ALTER TABLE `User` DROP COLUMN `facilityId`;
