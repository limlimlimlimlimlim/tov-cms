/*
  Warnings:

  - You are about to drop the column `floorId` on the `Wing` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Wing` DROP FOREIGN KEY `Wing_floorId_fkey`;

-- AlterTable
ALTER TABLE `Floor` ADD COLUMN `order` INTEGER NULL;

-- AlterTable
ALTER TABLE `Wing` DROP COLUMN `floorId`;

-- CreateTable
CREATE TABLE `WingOnFloor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `wingId` INTEGER NOT NULL,
    `floorId` INTEGER NOT NULL,
    `order` INTEGER NOT NULL,

    UNIQUE INDEX `WingOnFloor_wingId_floorId_key`(`wingId`, `floorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `WingOnFloor` ADD CONSTRAINT `WingOnFloor_wingId_fkey` FOREIGN KEY (`wingId`) REFERENCES `Wing`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WingOnFloor` ADD CONSTRAINT `WingOnFloor_floorId_fkey` FOREIGN KEY (`floorId`) REFERENCES `Floor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
