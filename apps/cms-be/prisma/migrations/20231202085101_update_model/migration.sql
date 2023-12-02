/*
  Warnings:

  - Added the required column `contentsType` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Post` ADD COLUMN `contentsType` VARCHAR(191) NOT NULL;
