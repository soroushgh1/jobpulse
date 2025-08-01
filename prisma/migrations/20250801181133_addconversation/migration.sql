-- CreateTable
CREATE TABLE "public"."Conversation" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Massage" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "created_at" TEXT NOT NULL,
    "replay_to_id" INTEGER NOT NULL,
    "conversation_id" INTEGER NOT NULL,

    CONSTRAINT "Massage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Massage" ADD CONSTRAINT "Massage_replay_to_id_fkey" FOREIGN KEY ("replay_to_id") REFERENCES "public"."Massage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Massage" ADD CONSTRAINT "Massage_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "public"."Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
