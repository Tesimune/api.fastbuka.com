-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_vendor_uuid_fkey";

-- DropForeignKey
ALTER TABLE "Food" DROP CONSTRAINT "Food_category_uuid_fkey";

-- DropForeignKey
ALTER TABLE "Food" DROP CONSTRAINT "Food_vendor_uuid_fkey";

-- DropForeignKey
ALTER TABLE "Vendor" DROP CONSTRAINT "Vendor_user_uuid_fkey";

-- CreateTable
CREATE TABLE "_UserToVendor" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_CategoryToVendor" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_CategoryToFood" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_FoodToVendor" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserToVendor_AB_unique" ON "_UserToVendor"("A", "B");

-- CreateIndex
CREATE INDEX "_UserToVendor_B_index" ON "_UserToVendor"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToVendor_AB_unique" ON "_CategoryToVendor"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToVendor_B_index" ON "_CategoryToVendor"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToFood_AB_unique" ON "_CategoryToFood"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToFood_B_index" ON "_CategoryToFood"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FoodToVendor_AB_unique" ON "_FoodToVendor"("A", "B");

-- CreateIndex
CREATE INDEX "_FoodToVendor_B_index" ON "_FoodToVendor"("B");

-- AddForeignKey
ALTER TABLE "_UserToVendor" ADD CONSTRAINT "_UserToVendor_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToVendor" ADD CONSTRAINT "_UserToVendor_B_fkey" FOREIGN KEY ("B") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToVendor" ADD CONSTRAINT "_CategoryToVendor_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToVendor" ADD CONSTRAINT "_CategoryToVendor_B_fkey" FOREIGN KEY ("B") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToFood" ADD CONSTRAINT "_CategoryToFood_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToFood" ADD CONSTRAINT "_CategoryToFood_B_fkey" FOREIGN KEY ("B") REFERENCES "Food"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FoodToVendor" ADD CONSTRAINT "_FoodToVendor_A_fkey" FOREIGN KEY ("A") REFERENCES "Food"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FoodToVendor" ADD CONSTRAINT "_FoodToVendor_B_fkey" FOREIGN KEY ("B") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
