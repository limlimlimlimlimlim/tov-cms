-- AlterTable
ALTER TABLE `Facility` ADD COLUMN `sectionId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Facility` ADD CONSTRAINT `Facility_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `Section`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
