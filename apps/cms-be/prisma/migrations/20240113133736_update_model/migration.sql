/*
  Warnings:

  - You are about to alter the column `alpha` on the `Section` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Int`.
  - You are about to alter the column `strokeAlpha` on the `Section` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Int`.

*/
-- AlterTable
ALTER TABLE `Section` MODIFY `alpha` INTEGER NULL DEFAULT 30,
    MODIFY `strokeAlpha` INTEGER NULL DEFAULT 1;
