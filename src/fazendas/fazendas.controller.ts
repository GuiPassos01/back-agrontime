import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FazendasService } from './fazendas.service';
import { CreateFazendaDto } from './dto/create-fazenda.dto';
import { UpdateFazendaDto } from './dto/update-fazenda.dto';

@Controller('fazendas')
export class FazendasController {
  constructor(private readonly fazendasService: FazendasService) {}

  @Post('/')
  async create(@Body() createFazendaDto: CreateFazendaDto) {
    return this.fazendasService.create(createFazendaDto);
  }

  @Get()
  async findAll() {
    return this.fazendasService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.fazendasService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateFazendaDto: UpdateFazendaDto) {
    return this.fazendasService.update(+id, updateFazendaDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.fazendasService.remove(+id);
  }
}
