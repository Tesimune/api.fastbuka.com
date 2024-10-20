/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Vendor` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Vendor_name_key";

-- AlterTable
ALTER TABLE "Food" ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "image" DROP NOT NULL,
ALTER COLUMN "price" SET DEFAULT 0,
ALTER COLUMN "discount" SET DEFAULT 0,
ALTER COLUMN "processing_time" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Vendor" ADD COLUMN     "slug" TEXT,
ALTER COLUMN "name" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_slug_key" ON "Vendor"("slug");
