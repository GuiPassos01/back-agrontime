-- CreateTable
CREATE TABLE "Usuarios" (
    "id_usuario" SERIAL NOT NULL,
    "nomeCompleto" VARCHAR(100) NOT NULL,
    "documento_fiscal" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "tipo" VARCHAR(100) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "celular" VARCHAR(100) NOT NULL,
    "genero" VARCHAR(100) NOT NULL,
    "data_nascimento" TIMESTAMP(3) NOT NULL,
    "senha" VARCHAR(100) NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuarios_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "EnderecoUsuario" (
    "id_endereco" SERIAL NOT NULL,
    "idUsuario" INTEGER NOT NULL,
    "cep" VARCHAR(20) NOT NULL,
    "rua" VARCHAR(100) NOT NULL,
    "numero" VARCHAR(20) NOT NULL,
    "complemento" VARCHAR(100),
    "bairro" VARCHAR(100) NOT NULL,
    "cidade" VARCHAR(100) NOT NULL,
    "estado" VARCHAR(100) NOT NULL,

    CONSTRAINT "EnderecoUsuario_pkey" PRIMARY KEY ("id_endereco")
);

-- CreateTable
CREATE TABLE "Fazenda" (
    "id_fazenda" SERIAL NOT NULL,
    "idUsuario" INTEGER NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "nirf" VARCHAR(100) NOT NULL,
    "area_propriedade" DOUBLE PRECISION NOT NULL,
    "qtd_funcionarios" INTEGER NOT NULL,

    CONSTRAINT "Fazenda_pkey" PRIMARY KEY ("id_fazenda")
);

-- CreateTable
CREATE TABLE "EnderecoFazenda" (
    "id_endereco" SERIAL NOT NULL,
    "idFazenda" INTEGER NOT NULL,
    "cep" VARCHAR(20) NOT NULL,
    "rua" VARCHAR(100) NOT NULL,
    "numero" VARCHAR(20) NOT NULL,
    "complemento" VARCHAR(100),
    "bairro" VARCHAR(100) NOT NULL,
    "cidade" VARCHAR(100) NOT NULL,
    "estado" VARCHAR(100) NOT NULL,

    CONSTRAINT "EnderecoFazenda_pkey" PRIMARY KEY ("id_endereco")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuarios_email_key" ON "Usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "EnderecoUsuario_idUsuario_key" ON "EnderecoUsuario"("idUsuario");

-- CreateIndex
CREATE UNIQUE INDEX "EnderecoFazenda_idFazenda_key" ON "EnderecoFazenda"("idFazenda");

-- AddForeignKey
ALTER TABLE "EnderecoUsuario" ADD CONSTRAINT "EnderecoUsuario_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fazenda" ADD CONSTRAINT "Fazenda_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnderecoFazenda" ADD CONSTRAINT "EnderecoFazenda_idFazenda_fkey" FOREIGN KEY ("idFazenda") REFERENCES "Fazenda"("id_fazenda") ON DELETE RESTRICT ON UPDATE CASCADE;
