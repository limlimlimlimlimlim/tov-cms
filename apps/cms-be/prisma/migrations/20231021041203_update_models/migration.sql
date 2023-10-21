/*
  Warnings:

  - You are about to drop the column `categoryId` on the `FacilityCategory` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `FacilitySubCategory` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `FacilitySubCategory` DROP FOREIGN KEY `FacilitySubCategory_categoryId_fkey`;

-- AlterTable
ALTER TABLE `FacilityCategory` DROP COLUMN `categoryId`;

-- AlterTable
ALTER TABLE `FacilitySubCategory` DROP COLUMN `categoryId`;
