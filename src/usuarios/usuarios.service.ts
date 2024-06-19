import { BadRequestException, Injectable } from '@nestjs/common';
import { CriarUsuarioDto } from './dto/criar-usuario.dto';
import { AtualizarUsuarioDto } from './dto/atualizar-usuario.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { FindByIdDto } from './dto/find-by-id.dto';
import { AtualizarSenhaDto } from './dto/atualizar-senha.dto';
import { FindByEmailDto } from './dto/find-by-email.dto';
import { Usuarios } from '@prisma/client';



@Injectable()
export class UsuariosService {
  constructor(private readonly prismaService: PrismaService){}

  async criarUsuario(criarUsuarioDto: CriarUsuarioDto): Promise<any> {
    const userData = {
      ...criarUsuarioDto,
      senha: await this.hashPassword(criarUsuarioDto.senha),
    }

    const usuario = await this.prismaService.createEntity({
      data: userData,
      entidadeTipo: "usuarios"
    })

    return usuario;
  }

  async findAll(): Promise<Usuarios[]> {
    return this.prismaService.findMany('usuarios', {
      select: {
        idUsuario: true,
        nomeCompleto: true,
        email: true,
        senha: true,
        status: true,
        documentoFiscal: true,
        tipo: true,
        celular: true,
        genero: true,
        dataNascimento: true
      }
    });
  }

  async findUser(findUserDto: FindByEmailDto | FindByIdDto): Promise<any>  {
    let whereCondition;

    if ('email' in findUserDto) {
        whereCondition = { email: findUserDto.email };
    } else if ('id_usuario' in findUserDto) {
        whereCondition = { id_usuario: (findUserDto as FindByIdDto).id_usuario };
    } else {
        throw new BadRequestException('Email or ID is required');
    }

    return this.prismaService.findUnique('usuarios', {
      where: whereCondition
    });
  }
  
  async atualizarUsuario(atualizarUsuarioDto: AtualizarUsuarioDto) {
    const data = {
      ...atualizarUsuarioDto,
    }

    const usuario = await this.prismaService.updateEntity({
      id_entidade: atualizarUsuarioDto.id_usuario,
      data,
      entidadeTipo: "usuarios"
    })

    return usuario;
  }

  async atualizarSenha(atualizarSenhaDto: AtualizarSenhaDto){
    const {id_usuario, senha} = atualizarSenhaDto;

    const hashedPassword = await this.hashPassword(senha);

    await this.prismaService.updateEntity({
      id_entidade: id_usuario,
      data: {
        password: hashedPassword
      },
      entidadeTipo: "usuarios"
    })

    return null;
  }

  async deletarUsuario(findByIdDto: FindByIdDto) {
    const usuario = await this.prismaService.deleteEntity('usuarios', {
      where: {idUsuario: findByIdDto.id_usuario}
    })

    return null;
  }

  private async hashPassword(password: string): Promise<string>{
    return await bcrypt.hash(password, 10)
  }

}