import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { Usuario } from '../entities/usuario.entity';

export class AtualizarUsuarioDto extends Usuario{

    @IsNotEmpty()
    @IsNumber()
    readonly id_usuario: number;

    @IsOptional()
    @IsString()
    readonly nome: string;

    @IsOptional()
    @IsEmail({}, { message: 'Enter correct email' })
    readonly email: string;

    @IsNotEmpty()
    @IsNumber()
    readonly versao: number;

}
