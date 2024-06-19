import { IsNotEmpty, IsNumber } from "class-validator";

export class FindByIdDto {
    @IsNotEmpty()
    @IsNumber()
    id_usuario: number
}