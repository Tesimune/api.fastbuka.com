/*
  Warnings:

  - You are about to drop the column `business_doc` on the `VendorDocuments` table. All the data in the column will be lost.
  - You are about to drop the column `id_doc` on the `VendorDocuments` table. All the data in the column will be lost.
  - You are about to drop the column `reg_number` on the `VendorDocuments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "VendorDocuments" DROP COLUMN "business_doc",
DROP COLUMN "id_doc",
DROP COLUMN "reg_number",
ADD COLUMN     "business_number" TEXT,
ADD COLUMN     "business_upload" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "id_upload" TEXT;
