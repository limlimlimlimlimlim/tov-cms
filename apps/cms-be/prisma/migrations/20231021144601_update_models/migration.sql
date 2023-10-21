/*
  Warnings:

  - Added the required column `mapId` to the `FloorArea` table without a default value. This is not possible if the table is not empty.
  - Added the required column `path` to the `FloorArea` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `FloorArea` ADD COLUMN `mapId` INTEGER NOT NULL,
    ADD COLUMN `path` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `FloorMap` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `floorId` INTEGER NOT NULL,
    `buildingId` INTEGER NOT NULL,
    `mapImage` VARCHAR(191) NOT NULL,
    `isUse` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
