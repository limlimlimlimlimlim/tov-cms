/*
  Warnings:

  - You are about to drop the column `description` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Post` table. All the data in the column will be lost.
  - Added the required column `contents` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `noPeriod` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `useIntro` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Post` DROP COLUMN `description`,
    DROP COLUMN `image`,
    ADD COLUMN `contents` VARCHAR(191) NOT NULL,
    ADD COLUMN `endDate` DATETIME(3) NULL,
    ADD COLUMN `noPeriod` BOOLEAN NOT NULL,
    ADD COLUMN `startDate` DATETIME(3) NULL,
    ADD COLUMN `type` VARCHAR(191) NOT NULL,
    ADD COLUMN `useIntro` BOOLEAN NOT NULL;
