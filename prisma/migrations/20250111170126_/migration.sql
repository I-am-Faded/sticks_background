-- DropForeignKey
ALTER TABLE "move" DROP CONSTRAINT "move_roomId_fkey";

-- DropForeignKey
ALTER TABLE "player" DROP CONSTRAINT "player_roomId_fkey";

-- AddForeignKey
ALTER TABLE "player" ADD CONSTRAINT "player_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "move" ADD CONSTRAINT "move_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
