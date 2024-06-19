import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { UserService } from '../../../src/user/user.service';
import { UserController } from '../../../src/user/user.controller';
import { CreateUserDto } from '../../../src/user/dto/create-user.dto';
import { Tipo } from '../../../src/user/dto/enums';
import { User } from '../../../src/user/entities/user.entity';

const createUserDto: CreateUserDto = {
  nome: 'Test User',
  email: 'existing@example.com',
  password: 'strongPassword',
  tipo: Tipo.INDIVIDUAL,
  cpf_cnpj: '12345678901',
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

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
            findUser: jest.fn(),
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a user and return a success message', async () => {
      jest.spyOn(service, 'findUser').mockResolvedValueOnce(null);
      jest.spyOn(service, 'create').mockResolvedValueOnce({ success: 'Cadastro realizado com sucesso' });
  
      const result = await controller.create(createUserDto);
  
      expect(result).toEqual({ success: 'Cadastro realizado com sucesso' });
      expect(service.findUser).toHaveBeenCalledWith({ email: createUserDto.email });
      expect(service.create).toHaveBeenCalledWith(createUserDto);
    });
  
    it('should throw a ConflictException if the email is already registered', async () => {
      jest.spyOn(service, 'findUser').mockResolvedValueOnce(new User()); // Simulando um usuário existente
  
      await expect(controller.create(createUserDto)).rejects.toThrow(ConflictException);
      expect(service.findUser).toHaveBeenCalledWith({ email: createUserDto.email });
    });

    it('should handle unexpected errors gracefully', async () => {
      jest.spyOn(service, 'findUser').mockImplementationOnce(() => {
        throw new Error('Unexpected error');
      });
  
      await expect(controller.create(createUserDto)).rejects.toThrow('Unexpected error');
    });

    it('should throw an error if the attachment service fails', async () => {
      jest.spyOn(service, 'findUser').mockResolvedValueOnce(null);
      jest.spyOn(service, 'create').mockImplementationOnce(() => {
        throw new Error('Attachment service failed');
      });
  
      await expect(controller.create(createUserDto)).rejects.toThrow('Attachment service failed');
    });
    
  });

  describe('findAll', () => {
    const mockUsers = [
      { id_usuario: 1, nome: 'Test User 1', email: 'test1@example.com', password: 'hashedPassword1', telefone: '1234567890', tipo: 1, cpf_cnpj: '12345678901', data_cadastro: new Date(), versao: 1 },
      { id_usuario: 2, nome: 'Test User 2', email: 'test2@example.com', password: 'hashedPassword2', telefone: '0987654321', tipo: 2, cpf_cnpj: '10987654321', data_cadastro: new Date(), versao: 1 },
    ];
  
    it('should return an array of all users', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValueOnce(mockUsers);
  
      const result = await controller.findAll();
  
      expect(result).toEqual(mockUsers);
      expect(service.findAll).toHaveBeenCalled();
    });
  
    it('should throw a NotFoundException when no users are found', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValueOnce([]);
  
      await expect(controller.findAll()).rejects.toThrow("Nenhum usuário encontrado");
    });
  
    it('should handle unexpected errors gracefully', async () => {
      jest.spyOn(service, 'findAll').mockImplementationOnce(() => {
        throw new Error('Unexpected error');
      });
  
      await expect(controller.findAll()).rejects.toThrow('Unexpected error');
    });
  });
  
})