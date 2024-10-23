/*
  Warnings:

  - You are about to drop the column `cac_number` on the `Vendor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Food" ADD COLUMN     "on_menu" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "ratings" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "balance" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Vendor" DROP COLUMN "cac_number",
ADD COLUMN     "cover" TEXT,
ADD COLUMN     "featured" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "is_online" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "latitude" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "longitude" TEXT,
ADD COLUMN     "profile" TEXT,
ADD COLUMN     "ratings" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN     "vendor_tags" TEXT;

-- CreateTable
CREATE TABLE "VendorDocuments" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "id_number" TEXT,
    "id_doc" TEXT,
    "reg_number" TEXT,
    "business_doc" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VendorDocuments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VendorDocuments_uuid_key" ON "VendorDocuments"("uuid");

-- AddForeignKey
ALTER TABLE "VendorDocuments" ADD CONSTRAINT "VendorDocuments_uuid_fkey" FOREIGN KEY ("uuid") REFERENCES "Vendor"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
