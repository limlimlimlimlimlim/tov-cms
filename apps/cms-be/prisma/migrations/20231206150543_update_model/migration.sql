-- AlterTable
ALTER TABLE `Event` MODIFY `description` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `Schedule` MODIFY `description` TEXT NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `description` TEXT NULL;
