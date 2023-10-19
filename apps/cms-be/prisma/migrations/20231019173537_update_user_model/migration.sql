-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_facility_category_id_fkey`;

-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_facility_sub_category_id_fkey`;

-- AlterTable
ALTER TABLE `User` MODIFY `phone` VARCHAR(191) NULL,
    MODIFY `description` VARCHAR(191) NULL,
    MODIFY `facility_category_id` INTEGER NULL,
    MODIFY `facility_sub_category_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_facility_category_id_fkey` FOREIGN KEY (`facility_category_id`) REFERENCES `FacilityCategory`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_facility_sub_category_id_fkey` FOREIGN KEY (`facility_sub_category_id`) REFERENCES `FacilitySubCategory`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
