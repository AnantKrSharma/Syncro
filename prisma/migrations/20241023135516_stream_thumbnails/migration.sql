/*
  Warnings:

  - Added the required column `largeThumbnail` to the `Stream` table without a default value. This is not possible if the table is not empty.
  - Added the required column `smallThumbnail` to the `Stream` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Stream` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Stream" ADD COLUMN     "largeThumbnail" TEXT NOT NULL,
ADD COLUMN     "smallThumbnail" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;
