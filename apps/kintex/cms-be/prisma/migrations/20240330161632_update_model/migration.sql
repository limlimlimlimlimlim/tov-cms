/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Monitoring` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Monitoring_code_key` ON `Monitoring`(`code`);
