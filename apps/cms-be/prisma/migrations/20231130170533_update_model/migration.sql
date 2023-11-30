/*
  Warnings:

  - You are about to drop the column `mapId` on the `SectionGroup` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `SectionGroup` DROP FOREIGN KEY `SectionGroup_mapId_fkey`;

-- AlterTable
ALTER TABLE `SectionGroup` DROP COLUMN `mapId`;
