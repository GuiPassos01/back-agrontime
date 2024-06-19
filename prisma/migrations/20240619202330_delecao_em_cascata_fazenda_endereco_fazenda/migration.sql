-- DropForeignKey
ALTER TABLE "endereco_fazenda" DROP CONSTRAINT "endereco_fazenda_id_fazenda_fkey";

-- AddForeignKey
ALTER TABLE "endereco_fazenda" ADD CONSTRAINT "endereco_fazenda_id_fazenda_fkey" FOREIGN KEY ("id_fazenda") REFERENCES "fazenda"("id_fazenda") ON DELETE CASCADE ON UPDATE CASCADE;
