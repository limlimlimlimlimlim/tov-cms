/*
  Warnings:

  - You are about to drop the column `contents` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `floorId` on the `Post` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Post` DROP FOREIGN KEY `Post_floorId_fkey`;

-- AlterTable
ALTER TABLE `Post` DROP COLUMN `contents`,
    DROP COLUMN `floorId`,
    ADD COLUMN `imageContents` VARCHAR(191) NULL,
    ADD COLUMN `textContents` VARCHAR(191) NULL,
    ADD COLUMN `vidoeContents` VARCHAR(191) NULL;
