/*
  Warnings:

  - You are about to drop the column `regionId` on the `Wing` table. All the data in the column will be lost.
  - You are about to drop the `Region` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Wing` DROP FOREIGN KEY `Wing_regionId_fkey`;

-- AlterTable
ALTER TABLE `Facility` ADD COLUMN `addressEn` VARCHAR(191) NULL,
    ADD COLUMN `descriptionEn` TEXT NULL,
    ADD COLUMN `nameEn` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Map` ADD COLUMN `nameEn` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Post` ADD COLUMN `eventPlaceCodes` VARCHAR(191) NULL,
    ADD COLUMN `eventPlaceText` TEXT NULL,
    ADD COLUMN `eventPlaceTextEn` TEXT NULL,
    ADD COLUMN `nameEn` VARCHAR(191) NULL,
    ADD COLUMN `textContentsEn` TEXT NULL;

-- AlterTable
ALTER TABLE `Wing` DROP COLUMN `regionId`;

-- DropTable
DROP TABLE `Region`;
