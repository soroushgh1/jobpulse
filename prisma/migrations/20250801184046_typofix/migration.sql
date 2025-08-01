/*
  Warnings:

  - You are about to drop the `Massage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Massage" DROP CONSTRAINT "Massage_conversation_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Massage" DROP CONSTRAINT "Massage_replay_to_id_fkey";

-- DropTable
DROP TABLE "public"."Massage";

-- CreateTable
CREATE TABLE "public"."Message" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "created_at" TEXT NOT NULL,
    "replay_to_id" INTEGER NOT NULL,
    "conversation_id" INTEGER NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_replay_to_id_fkey" FOREIGN KEY ("replay_to_id") REFERENCES "public"."Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "public"."Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
