-- DropForeignKey
ALTER TABLE `Schedule` DROP FOREIGN KEY `Schedule_wingId_fkey`;

-- AlterTable
ALTER TABLE `Schedule` MODIFY `wingId` INTEGER NULL,
    MODIFY `layout` VARCHAR(191) NULL DEFAULT 'landscape';

-- AddForeignKey
ALTER TABLE `Schedule` ADD CONSTRAINT `Schedule_wingId_fkey` FOREIGN KEY (`wingId`) REFERENCES `Wing`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
