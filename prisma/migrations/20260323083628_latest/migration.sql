-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "address" TEXT,
ADD COLUMN     "category" TEXT,
ADD COLUMN     "closeTime" TEXT,
ADD COLUMN     "maxQueueSize" INTEGER NOT NULL DEFAULT 50,
ADD COLUMN     "openTime" TEXT,
ADD COLUMN     "workingDays" TEXT[] DEFAULT ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']::TEXT[];
