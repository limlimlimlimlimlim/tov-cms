/*
  Warnings:

  - You are about to drop the column `buildingId` on the `Facility` table. All the data in the column will be lost.
  - You are about to drop the column `floorId` on the `Facility` table. All the data in the column will be lost.
  - You are about to drop the column `parentId` on the `FacilitySubCategory` table. All the data in the column will be lost.
  - You are about to drop the column `buildingId` on the `Kiosk` table. All the data in the column will be lost.
  - You are about to drop the column `buildingId` on the `Map` table. All the data in the column will be lost.
  - You are about to drop the `Building` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MapArea` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MapAreaGroup` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[sectionId]` on the table `Facility` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `Kiosk` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `categoryId` to the `Facility` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sectionId` to the `Facility` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subCategoryId` to the `Facility` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wingId` to the `Facility` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `FacilitySubCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wingId` to the `Kiosk` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wingId` to the `Map` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Map` DROP FOREIGN KEY `Map_buildingId_fkey`;

-- DropForeignKey
ALTER TABLE `Map` DROP FOREIGN KEY `Map_floorId_fkey`;

-- AlterTable
ALTER TABLE `Facility` DROP COLUMN `buildingId`,
    DROP COLUMN `floorId`,
    ADD COLUMN `categoryId` INTEGER NOT NULL,
    ADD COLUMN `sectionId` INTEGER NOT NULL,
    ADD COLUMN `subCategoryId` INTEGER NOT NULL,
    ADD COLUMN `wingId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `FacilitySubCategory` DROP COLUMN `parentId`,
    ADD COLUMN `categoryId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Kiosk` DROP COLUMN `buildingId`,
    ADD COLUMN `wingId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Map` DROP COLUMN `buildingId`,
    ADD COLUMN `wingId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `Building`;

-- DropTable
DROP TABLE `MapArea`;

-- DropTable
DROP TABLE `MapAreaGroup`;

-- CreateTable
CREATE TABLE `Wing` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `nameEn` VARCHAR(191) NULL,
    `floorId` INTEGER NOT NULL,
    `order` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Section` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mapId` INTEGER NOT NULL,
    `groupId` INTEGER NULL,
    `facilityId` INTEGER NOT NULL,
    `path` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SectionGroup` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mapId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Facility_sectionId_key` ON `Facility`(`sectionId`);

-- CreateIndex
CREATE UNIQUE INDEX `Kiosk_code_key` ON `Kiosk`(`code`);

-- AddForeignKey
ALTER TABLE `Wing` ADD CONSTRAINT `Wing_floorId_fkey` FOREIGN KEY (`floorId`) REFERENCES `Floor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FacilitySubCategory` ADD CONSTRAINT `FacilitySubCategory_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `FacilityCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Facility` ADD CONSTRAINT `Facility_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `Section`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Facility` ADD CONSTRAINT `Facility_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `FacilityCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Facility` ADD CONSTRAINT `Facility_subCategoryId_fkey` FOREIGN KEY (`subCategoryId`) REFERENCES `FacilitySubCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Map` ADD CONSTRAINT `Map_wingId_fkey` FOREIGN KEY (`wingId`) REFERENCES `Wing`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Section` ADD CONSTRAINT `Section_mapId_fkey` FOREIGN KEY (`mapId`) REFERENCES `Map`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Section` ADD CONSTRAINT `Section_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `SectionGroup`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SectionGroup` ADD CONSTRAINT `SectionGroup_mapId_fkey` FOREIGN KEY (`mapId`) REFERENCES `Map`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Kiosk` ADD CONSTRAINT `Kiosk_floorId_fkey` FOREIGN KEY (`floorId`) REFERENCES `Floor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Kiosk` ADD CONSTRAINT `Kiosk_wingId_fkey` FOREIGN KEY (`wingId`) REFERENCES `Wing`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
