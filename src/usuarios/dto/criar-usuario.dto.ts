import { ApiProperty } from '@nestjs/swagger';
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
    @ApiProperty({example: 'Deilton Pedro'})
    @IsNotEmpty()
    @IsString()
    readonly nomeCompleto: string;

    @ApiProperty({example: '000000000'})
    @IsString()
    @IsNotEmpty()
    documentoFiscal: string;

    @ApiProperty({example: 'teste@gmail.com'})
    @IsNotEmpty()
    @IsEmail({}, { message: 'Informe um email válido' })
    readonly email: string;

    @ApiProperty({example: 'Teste123!'})
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[a-z]).*$/, {
        message: 'Senha fraca',
    })
    readonly senha: string;

    @ApiProperty({example: 'Proprietario'})
    @IsString()
    @IsNotEmpty()
    tipo: string;
    
    @ApiProperty({example: '00000000000'})
    @IsString()
    @IsNotEmpty()
    celular: string;

    @ApiProperty({example: 'Masculino'})
    @IsString()
    @IsNotEmpty()
    genero: string;

    @ApiProperty({example: '02-04-2003'})
    @IsString()
    dataNascimento: string;
}