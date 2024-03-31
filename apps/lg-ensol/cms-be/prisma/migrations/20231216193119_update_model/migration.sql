/*
  Warnings:

  - You are about to drop the column `facilityCategoryId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `facilitySubCategoryId` on the `User` table. All the data in the column will be lost.
  - Added the required column `facilityId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `facilityCategoryId`,
    DROP COLUMN `facilitySubCategoryId`,
    ADD COLUMN `facilityId` INTEGER NOT NULL;
