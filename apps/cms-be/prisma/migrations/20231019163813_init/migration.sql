-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `permisson_id` INTEGER NOT NULL,
    `facility_category_id` INTEGER NOT NULL,
    `facility_sub_category_id` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Permission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `read_account` BOOLEAN NOT NULL DEFAULT false,
    `write_account` BOOLEAN NOT NULL DEFAULT false,
    `edit_account` BOOLEAN NOT NULL DEFAULT false,
    `delete_account` BOOLEAN NOT NULL DEFAULT false,
    `read_permission` BOOLEAN NOT NULL DEFAULT false,
    `write_permission` BOOLEAN NOT NULL DEFAULT false,
    `edit_permission` BOOLEAN NOT NULL DEFAULT false,
    `delete_permission` BOOLEAN NOT NULL DEFAULT false,
    `read_schedule` BOOLEAN NOT NULL DEFAULT false,
    `write_schedule` BOOLEAN NOT NULL DEFAULT false,
    `edit_schedule` BOOLEAN NOT NULL DEFAULT false,
    `delete_schedule` BOOLEAN NOT NULL DEFAULT false,
    `read_post` BOOLEAN NOT NULL DEFAULT false,
    `write_post` BOOLEAN NOT NULL DEFAULT false,
    `edit_post` BOOLEAN NOT NULL DEFAULT false,
    `delete_post` BOOLEAN NOT NULL DEFAULT false,
    `read_floor_map` BOOLEAN NOT NULL DEFAULT false,
    `write_floor_map` BOOLEAN NOT NULL DEFAULT false,
    `edit_floor_map` BOOLEAN NOT NULL DEFAULT false,
    `delete_floor_map` BOOLEAN NOT NULL DEFAULT false,
    `read_map_info` BOOLEAN NOT NULL DEFAULT false,
    `write_map_info` BOOLEAN NOT NULL DEFAULT false,
    `edit_map_info` BOOLEAN NOT NULL DEFAULT false,
    `delete_map_info` BOOLEAN NOT NULL DEFAULT false,
    `read_facility` BOOLEAN NOT NULL DEFAULT false,
    `write_facility` BOOLEAN NOT NULL DEFAULT false,
    `edit_facility` BOOLEAN NOT NULL DEFAULT false,
    `delete_facility` BOOLEAN NOT NULL DEFAULT false,
    `read_kiosk` BOOLEAN NOT NULL DEFAULT false,
    `write_kiosk` BOOLEAN NOT NULL DEFAULT false,
    `edit_kiosk` BOOLEAN NOT NULL DEFAULT false,
    `delete_kiosk` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Floor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Building` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `floor_id` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FloorArea` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FacilityCategory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `category_id` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FacilitySubCategory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `parent_id` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `category_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Facility` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `floor_id` INTEGER NOT NULL,
    `building_id` INTEGER NOT NULL,
    `position` BOOLEAN NOT NULL,
    `initial` VARCHAR(191) NOT NULL,
    `fnb_id` INTEGER NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `operation` VARCHAR(191) NOT NULL,
    `img` VARCHAR(191) NOT NULL,
    `icon_id` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FacilityPosition` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `facility_id` INTEGER NOT NULL,
    `x` INTEGER NOT NULL,
    `y` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_permisson_id_fkey` FOREIGN KEY (`permisson_id`) REFERENCES `Permission`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_facility_category_id_fkey` FOREIGN KEY (`facility_category_id`) REFERENCES `FacilityCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_facility_sub_category_id_fkey` FOREIGN KEY (`facility_sub_category_id`) REFERENCES `FacilitySubCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FacilitySubCategory` ADD CONSTRAINT `FacilitySubCategory_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `FacilityCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
