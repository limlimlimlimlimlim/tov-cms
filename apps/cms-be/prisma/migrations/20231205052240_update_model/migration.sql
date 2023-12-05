/*
  Warnings:

  - You are about to alter the column `sectionBase64` on the `Map` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.

*/
-- AlterTable
ALTER TABLE `Map` MODIFY `sectionBase64` JSON NULL;
