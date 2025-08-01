/*
  Warnings:

  - You are about to drop the column `replay_to_id` on the `Message` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Message" DROP CONSTRAINT "Message_replay_to_id_fkey";

-- AlterTable
ALTER TABLE "public"."Message" DROP COLUMN "replay_to_id",
ADD COLUMN     "reply_to_id" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_reply_to_id_fkey" FOREIGN KEY ("reply_to_id") REFERENCES "public"."Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;
