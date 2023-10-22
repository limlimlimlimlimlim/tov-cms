-- AddForeignKey
ALTER TABLE `Map` ADD CONSTRAINT `Map_buildingId_fkey` FOREIGN KEY (`buildingId`) REFERENCES `Building`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
