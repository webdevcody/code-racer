/*
  Warnings:

  - You are about to drop the column `words_per_minute` on the `results` table. All the data in the column will be lost.
  - You are about to drop the column `average_wpm` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "results" DROP COLUMN "words_per_minute",
ADD COLUMN     "wpm" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "average_wpm",
ADD COLUMN     "averageWpm" DECIMAL(6,2) NOT NULL DEFAULT 0;
