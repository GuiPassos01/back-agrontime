import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {

  async onModuleInit() {
    await this.$connect();
  }
  
  async createEntity({ data, entidadeTipo }: { data: any; entidadeTipo: string }): Promise<any> {
    return this.$transaction(async (prisma) => {
      const createdEntity = await prisma[entidadeTipo].create({
        data,
      });

      return createdEntity;
    });
  }

  async findMany(model: keyof PrismaClient, queryOptions: Prisma.UsuariosFindManyArgs): Promise<any> {
    return await this.$transaction(async (prisma) => {
      return prisma[model].findMany(queryOptions);
    })
  }

  async findUnique(model: keyof PrismaClient, queryOptions: Prisma.UsuariosFindManyArgs) {
    return await this.$transaction(async (prisma) => {
      return prisma[model].findUnique(queryOptions);
    })
  }

  async updateEntity({ id_entidade, data, entidadeTipo }: { id_entidade: number, data: any; entidadeTipo: string }){
    return this.$transaction(async (prisma) => {
      let updatedEntity;

      if(entidadeTipo === "usuarios"){
        updatedEntity = await prisma[entidadeTipo].update({
          where: {idUsuario: id_entidade},
          data,
        });
      }

      return updatedEntity;
    });
  }

  async deleteEntity (model: keyof PrismaClient, queryOptions: Prisma.UsuariosDeleteManyArgs){
    return await this.$transaction(async (prisma) => {
      return prisma[model].delete(queryOptions);
    })
  }
}
