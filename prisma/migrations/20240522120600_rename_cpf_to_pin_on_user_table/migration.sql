/*
  Warnings:

  - You are about to drop the column `cpf` on the `users` table. All the data in the column will be lost.
  - Added the required column `pin` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "cpf",
ADD COLUMN     "pin" TEXT NOT NULL;
