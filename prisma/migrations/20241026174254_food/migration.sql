-- DropForeignKey
ALTER TABLE "Food" DROP CONSTRAINT "Food_category_uuid_fkey";

-- AlterTable
ALTER TABLE "Food" ALTER COLUMN "category_uuid" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Food" ADD CONSTRAINT "Food_category_uuid_fkey" FOREIGN KEY ("category_uuid") REFERENCES "Category"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;
