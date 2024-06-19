import { IsEmail, IsNotEmpty } from "class-validator";

export class FindByEmailDto{
    @IsNotEmpty()
    @IsEmail({}, { message: 'Enter correct email' })
    email: string
}