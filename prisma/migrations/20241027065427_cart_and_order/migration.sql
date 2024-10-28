/*
  Warnings:

  - You are about to drop the column `delivery_status` on the `Order` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_uuid,vendor_uuid]` on the table `Cart` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cart_uuid,food_uuid]` on the table `CartItem` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Cart_user_uuid_key";

-- AlterTable
ALTER TABLE "CartItem" ADD COLUMN     "price" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "delivery_status",
ADD COLUMN     "delivery_charges" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "delivery_contact" TEXT,
ADD COLUMN     "delivery_email" TEXT,
ADD COLUMN     "delivery_name" TEXT,
ADD COLUMN     "order_status" TEXT NOT NULL DEFAULT 'pending',
ALTER COLUMN "order_number" DROP NOT NULL,
ALTER COLUMN "total_amount" SET DEFAULT 0,
ALTER COLUMN "discount_amount" SET DEFAULT 0,
ALTER COLUMN "paid_amount" SET DEFAULT 0,
ALTER COLUMN "delivery_address" DROP NOT NULL,
ALTER COLUMN "payment_method" DROP NOT NULL,
ALTER COLUMN "payment_status" SET DEFAULT 'pending';

-- CreateIndex
CREATE UNIQUE INDEX "Cart_user_uuid_vendor_uuid_key" ON "Cart"("user_uuid", "vendor_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_cart_uuid_food_uuid_key" ON "CartItem"("cart_uuid", "food_uuid");
