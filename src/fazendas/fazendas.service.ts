import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateFazendaDto } from './dto/create-fazenda.dto';
import { UpdateFazendaDto } from './dto/update-fazenda.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FazendasService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createFazendaDto: CreateFazendaDto) {
    const { endereco, ...fazendaData } = createFazendaDto;

    const fazenda = await this.prisma.fazenda.create({
      data: {
        ...fazendaData,
        EnderecoFazenda: {
          create: endereco,
        },
      },
      include: {
        EnderecoFazenda: true,
      },
    });

    return fazenda;
  }

  async findOne(id: number) {
    const fazenda = await this.prisma.fazenda.findUnique({
      where: { idFazenda: id },
      include: {
        EnderecoFazenda: true,
      },
    });

    if (!fazenda) {
      throw new NotFoundException(`Fazenda with ID ${id} not found`);
    }

    return fazenda;
  }

  async todasFazendas() {
    const fazendas = await this.prisma.fazenda.findMany()

    return fazendas;
  }

  async update(id: number, updateFazendaDto: UpdateFazendaDto) {
    const { endereco, ...fazendaData } = updateFazendaDto;

    const fazenda = await this.prisma.fazenda.update({
      where: { idFazenda: id },
      data: {
        ...fazendaData,
        EnderecoFazenda: endereco ? {
          update: endereco,
        } : undefined,
      },
      include: {
        EnderecoFazenda: true,
      },
    });

    return fazenda;
  }

  async remove(id: number) {
    try {
      const fazenda = await this.findOne(id);
      await this.prisma.fazenda.delete({ where: { idFazenda: id } });
      return {message: 'Fazenda excluida com sucesso.'};
    } catch (error) {
      throw new BadRequestException('Fazenda não encontrada')
    }
  }
}