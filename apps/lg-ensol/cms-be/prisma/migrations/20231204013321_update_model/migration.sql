/*
  Warnings:

  - You are about to drop the column `type` on the `Schedule` table. All the data in the column will be lost.
  - Added the required column `contentsType` to the `Schedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Schedule` DROP COLUMN `type`,
    ADD COLUMN `contentsType` VARCHAR(191) NOT NULL;
