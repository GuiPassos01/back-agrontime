import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../../src/user/user.service';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { User } from '../../../src/user/entities/user.entity';
import { MailService } from '../../../src/mail/mail.service';
import { DeleteUserDto } from '../../../src/user/dto/delete-user.dto';
import { FileService } from '../../../src/file/file.service';
import { CreateUserDto } from '../../../src/user/dto/create-user.dto';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { BadRequestException, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from '../../../src/user/dto/update-user.dto';
import { Tipo } from '../../../src/user/dto/enums';

const mockPrismaService = {
  usuarios: {
    create: jest.fn().mockResolvedValue({}),
    endereco_usuarios: jest.fn().mockResolvedValue({}),
    findMany: jest.fn(), // Adiciona a definição mock para findMany aqui, sem resolver ainda
    $transaction: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn()
  },
  endereco_usuarios: {
    create: jest.fn().mockResolvedValue({}),
    update: jest.fn()
  },
  $transaction: jest.fn().mockImplementation((cb) => cb({
    usuarios: mockPrismaService.usuarios,
    endereco_usuarios: mockPrismaService.endereco_usuarios
  })),};

const mockFileService = {
  handleAnexo: jest.fn().mockResolvedValue('path/to/anexo.jpg'),
  createAnexoRecord: jest.fn().mockResolvedValue({}),
  updateAnexo: jest.fn().mockResolvedValue('path/to/updated_anexo.jpg'),
};

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
}));

const mockUser = {
  id_usuario: 1,
  nome: 'Existing User',
  email: 'existing@example.com',
  password: 'hashedPassword',
  telefone: '1234567890',
  tipo: Tipo.INDIVIDUAL,
  cpf_cnpj: '12345678901',
  data_cadastro: new Date(),
  versao: 1,
};

describe('UserService', () => {

  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: FileService, useValue: mockFileService },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    mockPrismaService.$transaction.mockImplementation(async (cb) => await cb(mockPrismaService));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      nome: 'Test User',
      email: 'test@example.com',
      password: 'securePassword',
      cpf_cnpj: '12345678901',
      tipo: 1,
      telefone: '1234567890',
      endereco: {
        cep: '12345678',
        rua: 'Test Street',
        numero: '123',
        complemento: 'Apartment 1',
        bairro: 'Test District',
        cidade: 'Test City',
        estado: 'Test State',
      },
      anexo: 'path/to/anexo.jpg',
    };

    it('should successfully create a user and return a success message', async () => {
  
      mockPrismaService.usuarios.create.mockResolvedValue(createUserDto);
      mockFileService.handleAnexo.mockResolvedValue('path/to/anexo.jpg');
      mockFileService.createAnexoRecord.mockResolvedValue(undefined);

      const result = await userService.create(createUserDto);
  
      expect(result).toEqual({ success: 'Cadastro realizado com sucesso' });
      expect(mockPrismaService.usuarios.create).toHaveBeenCalled();
      expect(mockFileService.handleAnexo).toHaveBeenCalledWith(createUserDto.anexo, 'anexo.jpg');
      expect(mockFileService.createAnexoRecord).toHaveBeenCalled();
    });

    it('should throw an error if the file service fails to handle the anexo', async () => {
      mockFileService.handleAnexo.mockRejectedValueOnce(new Error('File service error'));

      // A expectativa deve refletir que o erro específico é lançado
      await expect(userService.create(createUserDto)).rejects.toThrowError('File service error');

      expect(mockFileService.handleAnexo).toHaveBeenCalledWith(createUserDto.anexo, 'anexo.jpg');
    });
    
    it('should successfully create a user without an anexo and return a success message', async () => {
      // Clone the createUserDto and remove the anexo property
      const createUserDtoWithoutAnexo = { ...createUserDto };
      delete createUserDtoWithoutAnexo.anexo;
    
      // Act
      const result = await userService.create(createUserDtoWithoutAnexo);
    
      // Assert
      expect(result).toEqual({ success: 'Cadastro realizado com sucesso' });
      // Verifique que o serviço de arquivo não é chamado quando não há anexo
      expect(mockFileService.handleAnexo).not.toHaveBeenCalled();
    });

    it('should throw an error if the address creation fails', async () => {
      mockPrismaService.endereco_usuarios.create.mockRejectedValueOnce(new Error('Endereco creation error'));

      // Espera-se que o serviço lance um erro, que seria capturado e tratado pelo PrismaExceptionFilter na aplicação real
      await expect(userService.create(createUserDto)).rejects.toThrowError('Endereco creation error');
    });
    
    it('should hash the password before creating a user', async () => {
      // A função hash do bcrypt foi mockada para retornar 'hashedPassword' sempre
      // Act
      await userService.create(createUserDto);
    
      // Assert
      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, expect.any(Number));
      // Você pode verificar se a senha no objeto passado para prisma.usuarios.create não é mais a senha original
    });
  
    it('should rollback the transaction if any part of the user creation fails', async () => {
      mockPrismaService.$transaction.mockRejectedValueOnce(new Error('Transaction failed'));
    
      // Reflete a expectativa de que um erro de transação resulte em um lançamento de erro específico
      await expect(userService.create(createUserDto)).rejects.toThrowError('Transaction failed');
    
      expect(mockPrismaService.$transaction).toHaveBeenCalled();
    });
    
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      // Dados de usuários simulados que o PrismaService deveria retornar
      const mockUsers = [
        { id_usuario: 1, nome: 'Test User 1', email: 'test1@example.com', password: 'hashedPassword1', telefone: '1234567890', tipo: 1, cpf_cnpj: '12345678901', data_cadastro: new Date(), versao: 1 },
        { id_usuario: 2, nome: 'Test User 2', email: 'test2@example.com', password: 'hashedPassword2', telefone: '0987654321', tipo: 2, cpf_cnpj: '10987654321', data_cadastro: new Date(), versao: 1 },
      ];
  
      // Simular o PrismaService.findMany para retornar os usuários simulados
      mockPrismaService.usuarios.findMany.mockResolvedValue(mockUsers);
  
      // Chamar o método findAll do UserService
      const users = await userService.findAll();
  
      // Verificar se o resultado contém os dados esperados
      expect(users).toEqual(mockUsers);
      // Verificar se o PrismaService.findMany foi chamado corretamente
      expect(mockPrismaService.usuarios.findMany).toHaveBeenCalled();
    });
  
    it('should handle empty user list gracefully', async () => {
      // Simular o PrismaService.findMany para retornar uma lista vazia
      mockPrismaService.usuarios.findMany.mockResolvedValue([]);
  
      // Chamar o método findAll do UserService
      const users = await userService.findAll();
  
      // Verificar se o resultado é uma lista vazia
      expect(users).toEqual([]);
      // Verificar se o PrismaService.findMany foi chamado
      expect(mockPrismaService.usuarios.findMany).toHaveBeenCalled();
    });

    // 2. Teste para falha genérica no Prisma
    it('should handle generic Prisma errors gracefully', async () => {
      // Simula um erro genérico do Prisma
      mockPrismaService.usuarios.findMany.mockRejectedValue(new Error('Generic Prisma error'));
    
      // Espera que o serviço lance uma InternalServerErrorException para erros genéricos
      await expect(userService.findAll()).rejects.toThrow('Generic Prisma error');
    
      expect(mockPrismaService.usuarios.findMany).toHaveBeenCalled();
    });
  });

  describe('findUser', () => {
    const findUserByEmailDto = { email: 'test@example.com' };
    const findUserByIdDto = { id_usuario: 1 };
    const mockUser = {
      id_usuario: 1,
      nome: 'Test User',
      email: 'test@example.com',
      password: 'hashedPassword',
      telefone: '1234567890',
      tipo: 1,
      cpf_cnpj: '12345678901',
      data_cadastro: new Date(),
      versao: 1,
    };
  
    it('should find a user by email and return user data', async () => {
      mockPrismaService.usuarios.findUnique.mockResolvedValue(mockUser);
  
      const result = await userService.findUser(findUserByEmailDto);
  
      expect(result).toEqual(mockUser);
      expect(mockPrismaService.usuarios.findUnique).toHaveBeenCalledWith({
        where: { email: findUserByEmailDto.email },
        select: expect.any(Object),
      });
    });
  
    it('should find a user by ID and return user data', async () => {
      mockPrismaService.usuarios.findUnique.mockResolvedValue(mockUser);
  
      const result = await userService.findUser(findUserByIdDto);
  
      expect(result).toEqual(mockUser);
      expect(mockPrismaService.usuarios.findUnique).toHaveBeenCalledWith({
        where: { id_usuario: findUserByIdDto.id_usuario },
        select: expect.any(Object),
      });
    });
  
    it('should throw a BadRequestException if email or ID is not provided', async () => {
      await expect(userService.findUser({} as any)).rejects.toThrow(BadRequestException);
    });
  
    it('should return null if user is not found', async () => {
      mockPrismaService.usuarios.findUnique.mockResolvedValue(null);
  
      const result = await userService.findUser(findUserByEmailDto);
  
      expect(result).toBeNull();
      expect(mockPrismaService.usuarios.findUnique).toHaveBeenCalledWith({
        where: { email: findUserByEmailDto.email },
        select: expect.any(Object),
      });
    });

  });

  describe('update', () => {
    const mockUpdateUserDto: UpdateUserDto = {
      id_usuario: 1,
      nome: 'Updated User',
      email: 'updated@example.com',
      password: 'updatedPassword',
      tipo: Tipo.INDIVIDUAL,
      cpf_cnpj: '98765432100',
      telefone: '0987654321',
      endereco: {
        cep: '87654321',
        rua: 'Updated Street',
        numero: '321',
        complemento: 'Apartment 2',
        bairro: 'Updated District',
        cidade: 'Updated City',
        estado: 'Updated State',
      },
      anexo: 'path/to/updated_anexo.jpg',
      versao: 1,
      data_cadastro: new Date(),
    };

    const mockUser = {
      id_usuario: 1,
      nome: 'Test User',
      email: 'test@example.com',
      telefone: '1234567890',
      tipo: Tipo.INDIVIDUAL,
      cpf_cnpj: '12345678901',
      data_cadastro: new Date(),
      versao: 1,
    };

    beforeEach(() => {
    mockPrismaService.usuarios.findUnique.mockResolvedValue(mockUser);
    mockPrismaService.usuarios.update.mockResolvedValue(mockUpdateUserDto);
    mockPrismaService.endereco_usuarios.update.mockResolvedValue({});
    mockFileService.updateAnexo.mockResolvedValue('path/to/updated_anexo.jpg');
    });

    it('should update a user successfully', async () => {
    const result = await userService.update(mockUpdateUserDto);
  
    expect(result).toEqual("Usuário atualizado com sucesso!");
    expect(mockPrismaService.usuarios.update).toHaveBeenCalled();
    expect(mockPrismaService.endereco_usuarios.update).toHaveBeenCalled();
    expect(mockFileService.updateAnexo).toHaveBeenCalledWith(mockUpdateUserDto.id_usuario, mockUpdateUserDto.anexo, 'anexo.jpg');
    });

    it('should throw NotFoundException if user does not exist', async () => {
    mockPrismaService.usuarios.findUnique.mockResolvedValue(null);
  
    await expect(userService.update(mockUpdateUserDto)).rejects.toThrow(NotFoundException);
    });

    it('should handle errors during address update gracefully', async () => {
    mockPrismaService.endereco_usuarios.update.mockRejectedValue(new Error('Failed to update address'));
  
    await expect(userService.update(mockUpdateUserDto)).rejects.toThrow('Failed to update address');
    });

    it('should handle errors during anexo update gracefully', async () => {
      mockPrismaService.usuarios.findUnique.mockResolvedValueOnce(mockUser);
      mockPrismaService.usuarios.update.mockResolvedValueOnce(mockUpdateUserDto);
      mockPrismaService.endereco_usuarios.update.mockResolvedValueOnce({});
      mockFileService.updateAnexo.mockRejectedValueOnce(new Error('Failed to update anexo'));
    
      await expect(userService.update(mockUpdateUserDto)).rejects.toThrow('Failed to update anexo');
    
      expect(mockFileService.updateAnexo).toHaveBeenCalledWith(
        mockUpdateUserDto.id_usuario, 
        mockUpdateUserDto.anexo, 
        'anexo.jpg'
      );
    });
    
    it('should allow partial updates to user data', async () => {
      const partialUpdateDto = {
        id_usuario: 1,
        telefone: '9876543210',
      };
    
      const updatedUser = {
        ...mockUser,
        ...partialUpdateDto,
      };
    
      mockPrismaService.usuarios.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.usuarios.update.mockResolvedValue(updatedUser);
    
      const result = await userService.update(partialUpdateDto as UpdateUserDto);
    
      expect(result).toEqual("Usuário atualizado com sucesso!");
      expect(mockPrismaService.usuarios.update).toHaveBeenCalledWith({
        where: { id_usuario: partialUpdateDto.id_usuario },
        data: partialUpdateDto,
      });
    });

    it('should throw a ConflictException if trying to update to an already used email', async () => {
      const conflictingEmailUpdateDto = { ...mockUpdateUserDto, email: 'existing@example.com' };
    
      mockPrismaService.usuarios.findUnique.mockResolvedValueOnce(mockUser); // Simula a existência do usuário
      mockPrismaService.usuarios.update.mockRejectedValueOnce(
        new Error('A unique constraint would be violated on User. Details: Field name = email')
      );
    
      await expect(userService.update(conflictingEmailUpdateDto)).rejects.toThrow('A unique constraint would be violated on User. Details: Field name = email');
    });

    /*it('should update a user successfully without endereco and anexo', async () => {
      const result = await userService.update(mockUpdateUserDto);
      expect(result.usuario).toEqual(updatedUserResult.usuario);
      expect(mockPrismaService.usuarios.update).toHaveBeenCalled();
      expect(mockPrismaService.endereco_usuarios.update).not.toHaveBeenCalled();
      expect(mockFileService.updateAnexo).not.toHaveBeenCalled();
    });*/

  });

  /*describe('delete', () => {
    it('should delete a user by id', async () => {
      const deleteUserDto: DeleteUserDto = {id:1};

      (prismaService.user.delete as jest.Mock).mockResolvedValue(deleteUserDto)

      const deletedUser = await userService.delete(deleteUserDto);

      expect(deletedUser).toHaveProperty('id', 1);
      expect(prismaService.user.delete).toHaveBeenCalledWith({ where: { id: deleteUserDto.id } });

    })
  })*/
});