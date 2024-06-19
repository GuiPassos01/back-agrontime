import { Controller, Get, Post, Body, Patch, Delete, NotFoundException, ConflictException, UseInterceptors, UseGuards, Query } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CriarUsuarioDto } from './dto/criar-usuario.dto';
import { AtualizarUsuarioDto } from './dto/atualizar-usuario.dto';
import { FindByIdDto } from './dto/find-by-id.dto';
import { FindByEmailDto } from './dto/find-by-email.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserIdInterceptor } from '../utils/user-id.interceptor';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Usuário')
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly userService: UsuariosService) { }

  @ApiOperation({ summary: 'Rota para cadastrar usuários' })
  @Post('/')
  async create(@Body() criarUsuarioDto: CriarUsuarioDto): Promise<{ success: string }> {
    const findByEmailDto: FindByEmailDto = { email: criarUsuarioDto.email };

    const emailExists = await this.userService.findUser(findByEmailDto);

    if (emailExists) {
      throw new ConflictException('Email já está cadastrado.');
    }

    return this.userService.criarUsuario(criarUsuarioDto);

  }

  // @UseGuards(JwtAuthGuard)
  // @ApiOperation({
  //   summary: 'Rota para obter todos os usuários',
  //   description: 'Necessário cookie de autenticação'
  // })
  // @Get('getAll')
  // async findAll() {
  //   const usuarios = await this.userService.findAll();

  //   if (usuarios.length === 0) {
  //     throw new NotFoundException("Nenhum usuário encontrado");
  //   }

  //   return usuarios
  // }

  // @UseGuards(JwtAuthGuard)
  @UseInterceptors(UserIdInterceptor)
  @ApiOperation({
    summary: 'Rota para buscar usuário pelo email',
    description: 'Necessário cookie de autenticação'
  })
  @Post('findByEmail')
  async findUser(@Body() findUserDto: FindByEmailDto) {
    const user = await this.userService.findUser(findUserDto);

    if (!user) {
      throw new NotFoundException('Usuario não encontrado');
    }

    return user;
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(UserIdInterceptor)
  @ApiOperation({
    summary: 'Rota para buscar usuário pelo id',
    description: 'Necessário cookie de autenticação'
  })
  @Get('findById')
  async findById(@Query() findByIdDto: FindByIdDto) {
    const user = await this.userService.findUser(findByIdDto);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(UserIdInterceptor)
  @ApiOperation({
    summary: 'Rota para atualizar dados do usuário',
    description: 'Necessário cookie de autenticação'
  })
  @Patch('update')
  async update(@Body() atualizarUsuarioDto: AtualizarUsuarioDto) {
    const updatedUser = await this.userService.atualizarUsuario(atualizarUsuarioDto);
    return updatedUser;
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(UserIdInterceptor)
  @ApiOperation({
    summary: 'Rota para deletar usuário',
    description: 'Necessário cookie de autenticação'
  })
  @Delete()
  async delete(@Body() findByIdDto: FindByIdDto) {
    return this.userService.deletarUsuario(findByIdDto);
  }
}