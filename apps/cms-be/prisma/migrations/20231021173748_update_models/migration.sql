/*
  Warnings:

  - You are about to drop the column `img` on the `Facility` table. All the data in the column will be lost.
  - You are about to drop the column `position` on the `Facility` table. All the data in the column will be lost.
  - Added the required column `image` to the `Facility` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Facility` DROP COLUMN `img`,
    DROP COLUMN `position`,
    ADD COLUMN `image` VARCHAR(191) NOT NULL;
