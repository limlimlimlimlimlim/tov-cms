/*
  Warnings:

  - You are about to drop the `FacilityPosition` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `Facility` ADD COLUMN `x` INTEGER NULL,
    ADD COLUMN `y` INTEGER NULL;

-- DropTable
DROP TABLE `FacilityPosition`;
