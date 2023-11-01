/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Floor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nameEn]` on the table `Floor` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Floor_name_key` ON `Floor`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `Floor_nameEn_key` ON `Floor`(`nameEn`);
