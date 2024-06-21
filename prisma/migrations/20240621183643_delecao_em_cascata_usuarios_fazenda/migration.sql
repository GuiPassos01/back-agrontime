-- DropForeignKey
ALTER TABLE "fazenda" DROP CONSTRAINT "fazenda_id_usuario_fkey";

-- AddForeignKey
ALTER TABLE "fazenda" ADD CONSTRAINT "fazenda_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;
