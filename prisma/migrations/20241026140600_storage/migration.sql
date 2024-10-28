/*
  Warnings:

  - You are about to drop the column `name` on the `Storage` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_uuid,use]` on the table `Storage` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Storage_user_uuid_name_key";

-- AlterTable
ALTER TABLE "Storage" DROP COLUMN "name",
ADD COLUMN     "use" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Storage_user_uuid_use_key" ON "Storage"("user_uuid", "use");
