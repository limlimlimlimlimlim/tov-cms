/*
  Warnings:

  - You are about to drop the column `facilityId` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `wingId` on the `Post` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Post_facilityId_fkey` ON `Post`;

-- DropIndex
DROP INDEX `Post_wingId_fkey` ON `Post`;

-- AlterTable
ALTER TABLE `Post` DROP COLUMN `facilityId`,
    DROP COLUMN `wingId`;
