-- CreateTable
CREATE TABLE "usuarios" (
    "id_usuario" SERIAL NOT NULL,
    "nome_completo" VARCHAR(100) NOT NULL,
    "documento_fiscal" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "tipo" VARCHAR(100) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "celular" VARCHAR(100) NOT NULL,
    "genero" VARCHAR(100) NOT NULL,
    "data_nascimento" TIMESTAMP(3) NOT NULL,
    "senha" VARCHAR(100) NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "endereco_usuario" (
    "id_endereco" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "cep" VARCHAR(20) NOT NULL,
    "rua" VARCHAR(100) NOT NULL,
    "numero" VARCHAR(20) NOT NULL,
    "complemento" VARCHAR(100),
    "bairro" VARCHAR(100) NOT NULL,
    "cidade" VARCHAR(100) NOT NULL,
    "estado" VARCHAR(100) NOT NULL,

    CONSTRAINT "endereco_usuario_pkey" PRIMARY KEY ("id_endereco")
);

-- CreateTable
CREATE TABLE "fazenda" (
    "id_fazenda" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "nirf" VARCHAR(100) NOT NULL,
    "area_propriedade" DOUBLE PRECISION NOT NULL,
    "qtd_funcionarios" INTEGER NOT NULL,

    CONSTRAINT "fazenda_pkey" PRIMARY KEY ("id_fazenda")
);

-- CreateTable
CREATE TABLE "endereco_fazenda" (
    "id_endereco" SERIAL NOT NULL,
    "id_fazenda" INTEGER NOT NULL,
    "cep" VARCHAR(20) NOT NULL,
    "rua" VARCHAR(100) NOT NULL,
    "numero" VARCHAR(20) NOT NULL,
    "complemento" VARCHAR(100),
    "bairro" VARCHAR(100) NOT NULL,
    "cidade" VARCHAR(100) NOT NULL,
    "estado" VARCHAR(100) NOT NULL,

    CONSTRAINT "endereco_fazenda_pkey" PRIMARY KEY ("id_endereco")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "endereco_usuario_id_usuario_key" ON "endereco_usuario"("id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "endereco_fazenda_id_fazenda_key" ON "endereco_fazenda"("id_fazenda");

-- AddForeignKey
ALTER TABLE "endereco_usuario" ADD CONSTRAINT "endereco_usuario_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fazenda" ADD CONSTRAINT "fazenda_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "endereco_fazenda" ADD CONSTRAINT "endereco_fazenda_id_fazenda_fkey" FOREIGN KEY ("id_fazenda") REFERENCES "fazenda"("id_fazenda") ON DELETE RESTRICT ON UPDATE CASCADE;
