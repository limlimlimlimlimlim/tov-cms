/*
  Warnings:

  - You are about to drop the column `floor_id` on the `Building` table. All the data in the column will be lost.
  - You are about to drop the column `building_id` on the `Facility` table. All the data in the column will be lost.
  - You are about to drop the column `floor_id` on the `Facility` table. All the data in the column will be lost.
  - You are about to drop the column `fnb_id` on the `Facility` table. All the data in the column will be lost.
  - You are about to drop the column `icon_id` on the `Facility` table. All the data in the column will be lost.
  - You are about to drop the column `category_id` on the `FacilityCategory` table. All the data in the column will be lost.
  - You are about to drop the column `facility_id` on the `FacilityPosition` table. All the data in the column will be lost.
  - You are about to drop the column `category_id` on the `FacilitySubCategory` table. All the data in the column will be lost.
  - You are about to drop the column `parent_id` on the `FacilitySubCategory` table. All the data in the column will be lost.
  - You are about to drop the column `delete_account` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `delete_facility` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `delete_floor_map` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `delete_kiosk` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `delete_map_info` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `delete_permission` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `delete_post` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `delete_schedule` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `edit_account` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `edit_facility` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `edit_floor_map` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `edit_kiosk` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `edit_map_info` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `edit_permission` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `edit_post` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `edit_schedule` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `read_account` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `read_facility` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `read_floor_map` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `read_kiosk` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `read_map_info` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `read_permission` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `read_post` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `read_schedule` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `write_account` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `write_facility` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `write_floor_map` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `write_kiosk` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `write_map_info` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `write_permission` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `write_post` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `write_schedule` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `facility_category_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `facility_sub_category_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `permission_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `floorId` to the `Building` table without a default value. This is not possible if the table is not empty.
  - Added the required column `buildingId` to the `Facility` table without a default value. This is not possible if the table is not empty.
  - Added the required column `floorId` to the `Facility` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fnbId` to the `Facility` table without a default value. This is not possible if the table is not empty.
  - Added the required column `iconId` to the `Facility` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `FacilityCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `facilityId` to the `FacilityPosition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `FacilitySubCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parentId` to the `FacilitySubCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `permissionId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `FacilitySubCategory` DROP FOREIGN KEY `FacilitySubCategory_category_id_fkey`;

-- DropIndex
DROP INDEX `User_facility_category_id_fkey` ON `User`;

-- DropIndex
DROP INDEX `User_facility_sub_category_id_fkey` ON `User`;

-- DropIndex
DROP INDEX `User_permission_id_fkey` ON `User`;

-- DropIndex
DROP INDEX `User_user_id_key` ON `User`;

-- AlterTable
ALTER TABLE `Building` DROP COLUMN `floor_id`,
    ADD COLUMN `floorId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Facility` DROP COLUMN `building_id`,
    DROP COLUMN `floor_id`,
    DROP COLUMN `fnb_id`,
    DROP COLUMN `icon_id`,
    ADD COLUMN `buildingId` INTEGER NOT NULL,
    ADD COLUMN `floorId` INTEGER NOT NULL,
    ADD COLUMN `fnbId` INTEGER NOT NULL,
    ADD COLUMN `iconId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `FacilityCategory` DROP COLUMN `category_id`,
    ADD COLUMN `categoryId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `FacilityPosition` DROP COLUMN `facility_id`,
    ADD COLUMN `facilityId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `FacilitySubCategory` DROP COLUMN `category_id`,
    DROP COLUMN `parent_id`,
    ADD COLUMN `categoryId` INTEGER NOT NULL,
    ADD COLUMN `parentId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Permission` DROP COLUMN `delete_account`,
    DROP COLUMN `delete_facility`,
    DROP COLUMN `delete_floor_map`,
    DROP COLUMN `delete_kiosk`,
    DROP COLUMN `delete_map_info`,
    DROP COLUMN `delete_permission`,
    DROP COLUMN `delete_post`,
    DROP COLUMN `delete_schedule`,
    DROP COLUMN `edit_account`,
    DROP COLUMN `edit_facility`,
    DROP COLUMN `edit_floor_map`,
    DROP COLUMN `edit_kiosk`,
    DROP COLUMN `edit_map_info`,
    DROP COLUMN `edit_permission`,
    DROP COLUMN `edit_post`,
    DROP COLUMN `edit_schedule`,
    DROP COLUMN `read_account`,
    DROP COLUMN `read_facility`,
    DROP COLUMN `read_floor_map`,
    DROP COLUMN `read_kiosk`,
    DROP COLUMN `read_map_info`,
    DROP COLUMN `read_permission`,
    DROP COLUMN `read_post`,
    DROP COLUMN `read_schedule`,
    DROP COLUMN `write_account`,
    DROP COLUMN `write_facility`,
    DROP COLUMN `write_floor_map`,
    DROP COLUMN `write_kiosk`,
    DROP COLUMN `write_map_info`,
    DROP COLUMN `write_permission`,
    DROP COLUMN `write_post`,
    DROP COLUMN `write_schedule`,
    ADD COLUMN `deleteAccount` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `deleteFacility` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `deleteFloorMap` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `deleteKiosk` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `deleteMapInfo` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `deletePermission` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `deletePost` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `deleteSchedule` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `editAccount` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `editFacility` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `editFloorMap` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `editKiosk` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `editMapInfo` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `editPermission` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `editPost` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `editSchedule` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `readAccount` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `readFacility` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `readFloorMap` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `readKiosk` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `readMapInfo` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `readPermission` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `readPost` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `readSchedule` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `writeAccount` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `writeFacility` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `writeFloorMap` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `writeKiosk` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `writeMapInfo` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `writePermission` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `writePost` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `writeSchedule` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `facility_category_id`,
    DROP COLUMN `facility_sub_category_id`,
    DROP COLUMN `permission_id`,
    DROP COLUMN `user_id`,
    ADD COLUMN `facilityCategoryId` INTEGER NULL,
    ADD COLUMN `facilitySubCategoryId` INTEGER NULL,
    ADD COLUMN `permissionId` INTEGER NOT NULL,
    ADD COLUMN `userId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_userId_key` ON `User`(`userId`);

-- AddForeignKey
ALTER TABLE `FacilitySubCategory` ADD CONSTRAINT `FacilitySubCategory_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `FacilityCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
