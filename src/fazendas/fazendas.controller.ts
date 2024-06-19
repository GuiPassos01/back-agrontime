import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { FazendasService } from './fazendas.service';
import { CreateFazendaDto } from './dto/create-fazenda.dto';
import { UpdateFazendaDto } from './dto/update-fazenda.dto';
import { ApiOperation, ApiProduces, ApiProperty, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Fazendas')
@Controller('fazendas')
export class FazendasController {
  constructor(private readonly fazendasService: FazendasService) {}

  @ApiOperation({summary: 'Rota para criar uma fazenda'})
  @Post('/')
  async create(@Body() createFazendaDto: CreateFazendaDto) {
    return this.fazendasService.create(createFazendaDto);
  }

  @ApiOperation({summary: 'Rota para achar uma fazenda'})
  @Post(':id')
  async findOne(@Param('id') id: number) {
    return this.fazendasService.findOne(+id);
  }

  @ApiOperation({summary: 'Rota para retornar todas as fazendas'})
  @Get('/')
  async findFazendas() {
    return await this.fazendasService.todasFazendas();
  }

  @ApiOperation({summary: 'Rota para alterar os dados da fazenda'})
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateFazendaDto: UpdateFazendaDto) {
    return this.fazendasService.update(+id, updateFazendaDto);
  }

  @ApiOperation({summary: 'Rota para deletar a fazenda'})
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.fazendasService.remove(+id);
  }
}
