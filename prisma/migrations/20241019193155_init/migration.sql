/*
  Warnings:

  - You are about to drop the `_CategoryToFood` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CategoryToVendor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_FoodToVendor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserToVendor` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[vendor_uuid,name]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[category_uuid,name]` on the table `Food` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_uuid,name]` on the table `Vendor` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "_CategoryToFood" DROP CONSTRAINT "_CategoryToFood_A_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryToFood" DROP CONSTRAINT "_CategoryToFood_B_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryToVendor" DROP CONSTRAINT "_CategoryToVendor_A_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryToVendor" DROP CONSTRAINT "_CategoryToVendor_B_fkey";

-- DropForeignKey
ALTER TABLE "_FoodToVendor" DROP CONSTRAINT "_FoodToVendor_A_fkey";

-- DropForeignKey
ALTER TABLE "_FoodToVendor" DROP CONSTRAINT "_FoodToVendor_B_fkey";

-- DropForeignKey
ALTER TABLE "_UserToVendor" DROP CONSTRAINT "_UserToVendor_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserToVendor" DROP CONSTRAINT "_UserToVendor_B_fkey";

-- DropTable
DROP TABLE "_CategoryToFood";

-- DropTable
DROP TABLE "_CategoryToVendor";

-- DropTable
DROP TABLE "_FoodToVendor";

-- DropTable
DROP TABLE "_UserToVendor";

-- CreateIndex
CREATE UNIQUE INDEX "Category_vendor_uuid_name_key" ON "Category"("vendor_uuid", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Food_category_uuid_name_key" ON "Food"("category_uuid", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_user_uuid_name_key" ON "Vendor"("user_uuid", "name");

-- AddForeignKey
ALTER TABLE "Vendor" ADD CONSTRAINT "Vendor_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_vendor_uuid_fkey" FOREIGN KEY ("vendor_uuid") REFERENCES "Vendor"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Food" ADD CONSTRAINT "Food_vendor_uuid_fkey" FOREIGN KEY ("vendor_uuid") REFERENCES "Vendor"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Food" ADD CONSTRAINT "Food_category_uuid_fkey" FOREIGN KEY ("category_uuid") REFERENCES "Category"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
