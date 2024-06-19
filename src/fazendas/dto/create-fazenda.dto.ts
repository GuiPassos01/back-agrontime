import { IsInt, IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

class CreateEnderecoFazendaDto {
  @IsNotEmpty()
  @IsString()
  cep: string;

  @IsNotEmpty()
  @IsString()
  rua: string;

  @IsNotEmpty()
  @IsString()
  numero: string;

  @IsOptional()
  @IsString()
  complemento?: string;

  @IsNotEmpty()
  @IsString()
  bairro: string;

  @IsNotEmpty()
  @IsString()
  cidade: string;

  @IsNotEmpty()
  @IsString()
  estado: string;
}

export class CreateFazendaDto {
  @IsNotEmpty()
  @IsInt()
  idUsuario: number;

  @IsNotEmpty()
  @IsString()
  nome: string;

  @IsNotEmpty()
  @IsString()
  nirf: string;

  @IsNotEmpty()
  @IsNumber()
  areaPropriedade: number;

  @IsNotEmpty()
  @IsInt()
  qtdFuncionarios: number;

  @IsNotEmpty()
  endereco: CreateEnderecoFazendaDto;
}