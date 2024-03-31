-- CreateTable
CREATE TABLE `Monitoring` (
    `id` VARCHAR(191) NOT NULL,
    `kioskName` VARCHAR(191) NOT NULL,
    `checkTime` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
