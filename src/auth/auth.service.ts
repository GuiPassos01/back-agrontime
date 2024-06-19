import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Payload } from './models/Payload';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { FindByEmailDto } from '../usuarios/dto/find-by-email.dto';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { UsuariosService } from '../usuarios/usuarios.service';
import { FindByIdDto } from '../usuarios/dto/find-by-id.dto';

@Injectable()
export class AuthService {
    constructor(private readonly usuariosService: UsuariosService, 
                private readonly jwtService: JwtService,
                private readonly prismaService: PrismaService,
                private readonly configService: ConfigService
                ){}

    async login(loginDto: LoginDto): Promise <{ access_token: string }>
    {
      const findByEmailDto: FindByEmailDto = { email: loginDto.email };

      const usuario: Usuario = await this.usuariosService.findUser(findByEmailDto);

      if (!usuario) { 
        throw new UnauthorizedException('Usuário não encontrado!');
      }
      
      const tokenData = await this.validateAndGenerateToken(usuario, loginDto.senha);

      return { access_token: tokenData.access_token };
    }
    
    private async validateAndGenerateToken(usuario: Usuario, password: string): Promise<{access_token: string}> {
        
      if (await bcrypt.compare(password, usuario.senha)) {
            const payload: Payload = {
                sub: usuario.id_usuario,
                email: usuario.email,
                nomeCompleto: usuario.nomeCompleto,
                documentoFiscal: usuario.documentoFiscal,
                senha: usuario.senha,
                tipo: usuario.tipo,
                celular: usuario.celular,
                genero: usuario.genero,
                dataNascimento: usuario.dataNascimento
            };
            const expiresIn =  '1d';

            const access_token = this.jwtService.sign(payload, { expiresIn });

            return { access_token };
      }

      throw new UnauthorizedException('Email ou senha incorretos');
    }

    async ValidarUsuario(payload: Payload){

      const findByEmailDto: FindByEmailDto = { email: payload.email }
        
        const entity = await this.usuariosService.findUser(findByEmailDto)

        if (entity) {
          return {
            id: payload.sub,
            email: payload.email,
            nome: payload.nomeCompleto,

          };
        }

        return null;
    }

  async generatePasswordResetToken(email: string): Promise<string> {
    const findByEmailDto: FindByEmailDto = {
      email
    }

    const usuario = await this.usuariosService.findUser(findByEmailDto);

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado!');
    }

    const payload: Payload = {
      sub: usuario.id_usuario,
      email: usuario.email,
      nomeCompleto: usuario.nomeCompleto,
      documentoFiscal: usuario.documentoFiscal,
      senha: usuario.senha,
      tipo: usuario.tipo,
      celular: usuario.celular,
      genero: usuario.genero,
      dataNascimento: usuario.dataNascimento,
      reset: true
    };
    const expiresIn = '1h';

    const resetToken = this.jwtService.sign(payload, {
      expiresIn,
      secret: process.env.JWT_RESET_SECRET,
    });

    return resetToken;
  }
    
    async validateResetToken(token: string): Promise<Usuario> {
      try {
        const payload: Payload = this.jwtService.verify(token, {
          secret: process.env.JWT_RESET_SECRET,
        });
    
        if (!payload || !payload.reset) {
          throw new UnauthorizedException('Token inválido');
        }

        const id_usuario = payload.sub

        const findByIdDto: FindByIdDto = {
          id_usuario
        }
    
        const usuario = await this.usuariosService.findUser(findByIdDto);
    
        if (!usuario) {
          throw new NotFoundException('Usuário não encontrado!');
        }
    
        return usuario;

      } catch (error) {
        throw new UnauthorizedException('Token inválido ou expirado');
      }
    }

    async resetPassword(resetToken: string, novaSenha: string) {
      try{
        const usuario = await this.validateResetToken(resetToken);
    
        const hashedPassword = await bcrypt.hash(novaSenha, 10);
      
        await this.prismaService.updateEntity({
          id_entidade: usuario.id_usuario,
          data: {
            senha: hashedPassword
          },
          entidadeTipo: "usuarios"
        });
      } catch(err){
        console.error(err)
        throw err;
      }

    }

  }
