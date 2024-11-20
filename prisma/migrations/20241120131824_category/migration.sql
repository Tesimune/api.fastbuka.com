/*
  Warnings:

  - You are about to drop the column `vendor_uuid` on the `Category` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_vendor_uuid_fkey";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "vendor_uuid";
