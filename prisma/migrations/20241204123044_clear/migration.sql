-- AlterTable
ALTER TABLE "Food" ADD COLUMN     "stock" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "rider_uuid" TEXT;

-- AlterTable
ALTER TABLE "Vendor" ADD COLUMN     "balance" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Address" (
    "id" SERIAL NOT NULL,
    "user_uuid" TEXT NOT NULL,
    "location" TEXT,
    "longitude" TEXT,
    "latitude" TEXT,
    "address" TEXT,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rider" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "user_uuid" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "country" TEXT,
    "state" TEXT,
    "city" TEXT,
    "location" TEXT,
    "longitude" TEXT,
    "latitude" TEXT,
    "address" TEXT,
    "ratings" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "featured" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "is_online" BOOLEAN NOT NULL DEFAULT true,
    "opening_time" TEXT,
    "closing_time" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiderDocuments" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "country" TEXT,
    "id_number" TEXT,
    "id_upload" TEXT,
    "vehicle_number" TEXT,
    "document_upload" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RiderDocuments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Rider_uuid_key" ON "Rider"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Rider_user_uuid_key" ON "Rider"("user_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "RiderDocuments_uuid_key" ON "RiderDocuments"("uuid");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_rider_uuid_fkey" FOREIGN KEY ("rider_uuid") REFERENCES "Rider"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rider" ADD CONSTRAINT "Rider_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiderDocuments" ADD CONSTRAINT "RiderDocuments_uuid_fkey" FOREIGN KEY ("uuid") REFERENCES "Rider"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
