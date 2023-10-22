/*
  Warnings:

  - You are about to drop the column `deleteFloorMap` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `editFloorMap` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `readFloorMap` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `writeFloorMap` on the `Permission` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Permission` DROP COLUMN `deleteFloorMap`,
    DROP COLUMN `editFloorMap`,
    DROP COLUMN `readFloorMap`,
    DROP COLUMN `writeFloorMap`,
    ADD COLUMN `deleteMap` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `editMap` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `readMap` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `writeMap` BOOLEAN NOT NULL DEFAULT false;
