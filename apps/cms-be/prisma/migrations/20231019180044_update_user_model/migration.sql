/*
  Warnings:

  - You are about to drop the column `permisson_id` on the `User` table. All the data in the column will be lost.
  - Added the required column `permission_id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_permisson_id_fkey`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `permisson_id`,
    ADD COLUMN `permission_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_permission_id_fkey` FOREIGN KEY (`permission_id`) REFERENCES `Permission`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
