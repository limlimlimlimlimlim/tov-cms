/*
  Warnings:

  - Added the required column `order` to the `Building` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `Floor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Building` ADD COLUMN `order` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Floor` ADD COLUMN `order` INTEGER NOT NULL;
