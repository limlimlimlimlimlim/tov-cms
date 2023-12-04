/*
  Warnings:

  - You are about to drop the `WingOnFloor` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `WingOnFloor` DROP FOREIGN KEY `WingOnFloor_floorId_fkey`;

-- DropForeignKey
ALTER TABLE `WingOnFloor` DROP FOREIGN KEY `WingOnFloor_wingId_fkey`;

-- AlterTable
ALTER TABLE `Floor` ADD COLUMN `wingId` INTEGER NULL;

-- DropTable
DROP TABLE `WingOnFloor`;

-- AddForeignKey
ALTER TABLE `Floor` ADD CONSTRAINT `Floor_wingId_fkey` FOREIGN KEY (`wingId`) REFERENCES `Wing`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
