/*
  Warnings:

  - You are about to drop the column `fnbId` on the `Facility` table. All the data in the column will be lost.
  - You are about to drop the column `iconId` on the `Facility` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Facility` table. All the data in the column will be lost.
  - You are about to drop the column `operation` on the `Facility` table. All the data in the column will be lost.
  - You are about to drop the column `sectionId` on the `Facility` table. All the data in the column will be lost.
  - You are about to drop the column `facilityId` on the `Section` table. All the data in the column will be lost.
  - Added the required column `alwaysVisible` to the `Facility` table without a default value. This is not possible if the table is not empty.
  - Added the required column `floorId` to the `Facility` table without a default value. This is not possible if the table is not empty.
  - Added the required column `iconType` to the `Facility` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Facility` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time` to the `Facility` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Facility` DROP FOREIGN KEY `Facility_sectionId_fkey`;

-- AlterTable
ALTER TABLE `Facility` DROP COLUMN `fnbId`,
    DROP COLUMN `iconId`,
    DROP COLUMN `image`,
    DROP COLUMN `operation`,
    DROP COLUMN `sectionId`,
    ADD COLUMN `alwaysVisible` BOOLEAN NOT NULL,
    ADD COLUMN `floorId` INTEGER NOT NULL,
    ADD COLUMN `iconType` VARCHAR(191) NOT NULL,
    ADD COLUMN `status` VARCHAR(191) NOT NULL,
    ADD COLUMN `time` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Section` DROP COLUMN `facilityId`;

-- AlterTable
ALTER TABLE `Wing` ADD COLUMN `regionId` INTEGER NULL;

-- CreateTable
CREATE TABLE `Region` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `nameEn` VARCHAR(191) NULL,
    `disabled` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Region_name_key`(`name`),
    UNIQUE INDEX `Region_nameEn_key`(`nameEn`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Wing` ADD CONSTRAINT `Wing_regionId_fkey` FOREIGN KEY (`regionId`) REFERENCES `Region`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Facility` ADD CONSTRAINT `Facility_wingId_fkey` FOREIGN KEY (`wingId`) REFERENCES `Wing`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Facility` ADD CONSTRAINT `Facility_floorId_fkey` FOREIGN KEY (`floorId`) REFERENCES `Floor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
