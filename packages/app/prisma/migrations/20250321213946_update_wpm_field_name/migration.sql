/*
  Warnings:

  - You are about to drop the column `wpm` on the `results` table. All the data in the column will be lost.
  - You are about to drop the column `averageWpm` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "results" DROP COLUMN "wpm",
ADD COLUMN     "words_per_minute" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "averageWpm",
ADD COLUMN     "average_wpm" DECIMAL(6,2) NOT NULL DEFAULT 0;
