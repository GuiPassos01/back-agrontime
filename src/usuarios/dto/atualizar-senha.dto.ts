import { IsNotEmpty, IsNumber, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class AtualizarSenhaDto {

    @IsNotEmpty()
    @IsNumber()
    readonly id_usuario: number;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[a-z]).*$/, {
        message: 'password too weak',
    })
    readonly senha: string;

    @IsNotEmpty()
    @IsNumber()
    readonly versao: number;

}
