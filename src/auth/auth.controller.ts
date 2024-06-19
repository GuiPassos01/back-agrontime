import { BadRequestException, Body, Controller, HttpCode, HttpStatus, Post, Res, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResetPasswordRequestDto } from './dto/reset-password.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @HttpCode(200)
    @Post('login')
    @ApiOperation({
      summary: 'Rota para realizar login do usuário'
    })
    async login(@Body() loginDto: LoginDto, @Res({passthrough: true}) res: Response): 
    Promise<{ success: string }>
    {
      const { access_token } = await this.authService.login(loginDto);
      
      res.cookie('jwt', access_token, 
        {httpOnly: true, secure: true, sameSite: 'none',}
        );

      return null;
    }

    @HttpCode(200)
    @Post('reset-password')
    @ApiOperation({
      summary: 'Rota para atualizar senha do usuário',
    })
    async resetPassword(@Body() changePasswordDto: ChangePasswordDto): Promise<{ message: string }> {
      await this.authService.resetPassword(changePasswordDto.token, changePasswordDto.senha);
      return { message: 'Sua senha foi redefinida com sucesso.' };
    }

    @HttpCode(200)
    @Post('request-password-reset')
    @ApiOperation({
      summary: 'Rota para solicitar redefinição de senha do usuário',
    })
    async requestPasswordReset(@Body() resetPasswordRequestDto: ResetPasswordRequestDto): Promise<{ message: string }> {
      await this.authService.sendPasswordResetEmail(resetPasswordRequestDto.email);
      return { message: 'Se um usuário com esse e-mail for encontrado, um e-mail de redefinição de senha será enviado.' };
    }

}