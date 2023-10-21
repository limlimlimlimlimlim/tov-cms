/*
  Warnings:

  - You are about to drop the `FloorArea` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FloorMap` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `FloorArea`;

-- DropTable
DROP TABLE `FloorMap`;

-- CreateTable
CREATE TABLE `Map` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `floorId` INTEGER NOT NULL,
    `buildingId` INTEGER NOT NULL,
    `mapImage` VARCHAR(191) NOT NULL,
    `isUse` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MapArea` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mapId` INTEGER NOT NULL,
    `path` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
