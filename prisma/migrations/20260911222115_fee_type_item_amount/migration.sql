-- FeeItem no longer carries its own price; the amount is only decided once
-- an item is attached to a specific Fee (FeeTypeItem), which is what
-- actually charges players.
ALTER TABLE "fee_items" DROP COLUMN "defaultAmount";
ALTER TABLE "fee_type_items" ADD COLUMN "amount" DECIMAL(10,2) NOT NULL;
