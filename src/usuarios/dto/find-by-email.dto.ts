import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class FindByEmailDto{
    @ApiProperty({example: 'teste@gmail.com'})
    @IsNotEmpty()
    @IsEmail({}, { message: 'Enter correct email' })
    email: string
}