-- AlterEnum
ALTER TYPE "DocumentOwnerType" ADD VALUE 'PRODUCT';

-- CreateEnum
CREATE TYPE "ProductCategory" AS ENUM ('JERSEY', 'TRACK_SUIT', 'BOOTS', 'SOCKS', 'OTHER');

-- CreateEnum
CREATE TYPE "MerchandiseOrderStatus" AS ENUM ('PENDING', 'APPROVED', 'READY_FOR_PICKUP', 'FULFILLED', 'REJECTED', 'CANCELLED');

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" "ProductCategory" NOT NULL,
    "basePrice" DECIMAL(10,2) NOT NULL,
    "imageDocumentId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_variants" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "sizeLabel" TEXT NOT NULL,
    "priceOverride" DECIMAL(10,2),
    "stockQuantity" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "merchandise_orders" (
    "id" TEXT NOT NULL,
    "guardianId" TEXT NOT NULL,
    "submittedByUserId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "status" "MerchandiseOrderStatus" NOT NULL DEFAULT 'PENDING',
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "invoiceId" TEXT,
    "staffNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "merchandise_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "merchandise_order_items" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productVariantId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPriceAtOrder" DECIMAL(10,2) NOT NULL,
    "lineTotal" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "merchandise_order_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "products_category_idx" ON "products"("category");

-- CreateIndex
CREATE INDEX "products_isActive_idx" ON "products"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "product_variants_productId_sizeLabel_key" ON "product_variants"("productId", "sizeLabel");

-- CreateIndex
CREATE INDEX "product_variants_productId_idx" ON "product_variants"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "merchandise_orders_invoiceId_key" ON "merchandise_orders"("invoiceId");

-- CreateIndex
CREATE INDEX "merchandise_orders_guardianId_idx" ON "merchandise_orders"("guardianId");

-- CreateIndex
CREATE INDEX "merchandise_orders_playerId_idx" ON "merchandise_orders"("playerId");

-- CreateIndex
CREATE INDEX "merchandise_orders_status_idx" ON "merchandise_orders"("status");

-- CreateIndex
CREATE INDEX "merchandise_order_items_orderId_idx" ON "merchandise_order_items"("orderId");

-- CreateIndex
CREATE INDEX "merchandise_order_items_productVariantId_idx" ON "merchandise_order_items"("productVariantId");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_imageDocumentId_fkey" FOREIGN KEY ("imageDocumentId") REFERENCES "documents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "merchandise_orders" ADD CONSTRAINT "merchandise_orders_guardianId_fkey" FOREIGN KEY ("guardianId") REFERENCES "guardians"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "merchandise_orders" ADD CONSTRAINT "merchandise_orders_submittedByUserId_fkey" FOREIGN KEY ("submittedByUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "merchandise_orders" ADD CONSTRAINT "merchandise_orders_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "merchandise_orders" ADD CONSTRAINT "merchandise_orders_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "merchandise_order_items" ADD CONSTRAINT "merchandise_order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "merchandise_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "merchandise_order_items" ADD CONSTRAINT "merchandise_order_items_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "product_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
