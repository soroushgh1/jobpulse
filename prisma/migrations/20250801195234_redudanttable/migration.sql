/*
  Warnings:

  - You are about to drop the column `conversation_id` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the `Conversation` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `ticket_id` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Message" DROP CONSTRAINT "Message_conversation_id_fkey";

-- AlterTable
ALTER TABLE "public"."Message" DROP COLUMN "conversation_id",
ADD COLUMN     "ticket_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "public"."Conversation";

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "public"."Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;
