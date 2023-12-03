/*
  Warnings:

  - You are about to drop the column `initial` on the `Facility` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Facility` DROP FOREIGN KEY `Facility_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `Facility` DROP FOREIGN KEY `Facility_floorId_fkey`;

-- DropForeignKey
ALTER TABLE `Facility` DROP FOREIGN KEY `Facility_subCategoryId_fkey`;

-- DropForeignKey
ALTER TABLE `Facility` DROP FOREIGN KEY `Facility_wingId_fkey`;

-- AlterTable
ALTER TABLE `Facility` DROP COLUMN `initial`,
    MODIFY `name` VARCHAR(191) NULL,
    MODIFY `wingId` INTEGER NULL,
    MODIFY `phone` VARCHAR(191) NULL,
    MODIFY `address` VARCHAR(191) NULL,
    MODIFY `categoryId` INTEGER NULL,
    MODIFY `subCategoryId` INTEGER NULL,
    MODIFY `alwaysVisible` BOOLEAN NULL,
    MODIFY `floorId` INTEGER NULL,
    MODIFY `iconType` VARCHAR(191) NULL,
    MODIFY `status` VARCHAR(191) NULL,
    MODIFY `time` VARCHAR(191) NULL,
    MODIFY `x` INTEGER NULL,
    MODIFY `y` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Facility` ADD CONSTRAINT `Facility_wingId_fkey` FOREIGN KEY (`wingId`) REFERENCES `Wing`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Facility` ADD CONSTRAINT `Facility_floorId_fkey` FOREIGN KEY (`floorId`) REFERENCES `Floor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Facility` ADD CONSTRAINT `Facility_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `FacilityCategory`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Facility` ADD CONSTRAINT `Facility_subCategoryId_fkey` FOREIGN KEY (`subCategoryId`) REFERENCES `FacilitySubCategory`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
