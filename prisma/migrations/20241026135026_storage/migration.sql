/*
  Warnings:

  - A unique constraint covering the columns `[user_uuid,name]` on the table `Storage` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Storage" ADD COLUMN     "type" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Storage_user_uuid_name_key" ON "Storage"("user_uuid", "name");
