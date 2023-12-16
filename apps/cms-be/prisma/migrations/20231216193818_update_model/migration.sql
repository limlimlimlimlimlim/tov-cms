-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `Permission`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
