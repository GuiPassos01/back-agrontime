import {
    IsDate,
    IsEmail,
    IsNotEmpty,
    IsString,
    Matches,
    MaxLength,
    MinLength,
} from 'class-validator';

export class CriarUsuarioDto {
    @IsNotEmpty()
    @IsString()
    readonly nomeCompleto: string;

    @IsString()
    @IsNotEmpty()
    documentoFiscal: string;

    @IsNotEmpty()
    @IsEmail({}, { message: 'Informe um email válido' })
    readonly email: string;

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[a-z]).*$/, {
        message: 'Senha fraca',
    })
    readonly senha: string;

    @IsString()
    @IsNotEmpty()
    tipo: string;
    
    @IsString()
    @IsNotEmpty()
    celular: string;

    @IsString()
    @IsNotEmpty()
    genero: string;

    @IsString()
    dataNascimento: string;
}

/* 
model Usuarios {
  idUsuario      Int        @id @default(autoincrement()) @map("id_usuario")
  nomeCompleto    String    @db.VarChar(100) @map("nome_completo")
  documentoFiscal String    @map("documento_fiscal") @db.VarChar(100)
  email           String    @unique @db.VarChar(100)
  tipo            String    @db.VarChar(100)
  status          Boolean   @default(true)
  celular         String    @db.VarChar(100)
  genero          String    @db.VarChar(100)
  dataNascimento  DateTime  @map("data_nascimento")
  senha           String    @db.VarChar(100)
  criadoEm        DateTime   @default(now()) @map("criado_em")

  enderecoUsuario EnderecoUsuario?
  fazendas        Fazenda[]
  
  @@map("usuarios")
}
*/