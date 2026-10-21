-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Vehicle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ownerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "dailyRate" INTEGER NOT NULL,
    "transmission" TEXT NOT NULL,
    "fuel" TEXT NOT NULL,
    "seats" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "features" TEXT NOT NULL,
    "purposes" TEXT NOT NULL DEFAULT '[]',
    "image" TEXT NOT NULL,
    "photos" TEXT NOT NULL DEFAULT '[]',
    "driveType" TEXT NOT NULL DEFAULT 'Self-drive',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "demo" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Vehicle_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Vehicle" ("active", "brand", "category", "city", "createdAt", "dailyRate", "demo", "description", "driveType", "features", "fuel", "id", "image", "model", "ownerId", "photos", "seats", "title", "transmission", "updatedAt", "year") SELECT "active", "brand", "category", "city", "createdAt", "dailyRate", "demo", "description", "driveType", "features", "fuel", "id", "image", "model", "ownerId", "photos", "seats", "title", "transmission", "updatedAt", "year" FROM "Vehicle";
DROP TABLE "Vehicle";
ALTER TABLE "new_Vehicle" RENAME TO "Vehicle";
CREATE INDEX "Vehicle_active_city_category_idx" ON "Vehicle"("active", "city", "category");
CREATE INDEX "Vehicle_ownerId_idx" ON "Vehicle"("ownerId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
