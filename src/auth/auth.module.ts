import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [UsuariosModule, PrismaModule, JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: {expiresIn: '1d'}
  })],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, ],
  exports: [AuthService]
})
export class AuthModule {}
