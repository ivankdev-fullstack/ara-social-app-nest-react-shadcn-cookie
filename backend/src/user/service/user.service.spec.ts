import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../entity/user.entity';
import { UserRepository } from '../repository/user.repository';
import { UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;

  const mockUserRepository = {
    getById: jest.fn(),
    getByEmail: jest.fn(),
    updateById: jest.fn(),
    create: jest.fn(),
    deleteById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserRepository, useValue: mockUserRepository },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockUser: User = new User({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'hashedpassword',
  });

  describe('getById', () => {
    it('should return a user if found', async () => {
      mockUserRepository.getById.mockResolvedValue(mockUser);

      const res = await userService.getById(mockUser.id);

      expect(res).toEqual(mockUser);
      expect(userRepository.getById).toHaveBeenCalledWith(mockUser.id);
    });

    it('should throw 404 if user is not found', async () => {
      mockUserRepository.getById.mockResolvedValue(null);

      await expect(userService.getById(mockUser.id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getByEmail', () => {
    it('should return a user if found', async () => {
      mockUserRepository.getByEmail.mockResolvedValue(mockUser);

      const res = await userService.getByEmail(mockUser.email);

      expect(res).toEqual(mockUser);
      expect(userRepository.getByEmail).toHaveBeenCalledWith(mockUser.email);
    });

    it('should throw 404 if user is not found', async () => {
      mockUserRepository.getByEmail.mockResolvedValue(null);

      await expect(userService.getByEmail(mockUser.id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    const { name, email, password } = mockUser;
    const data = { name, email, password };

    it('should create user', async () => {
      mockUserRepository.create.mockResolvedValue(true);

      const res = await userService.create(data);
      const { id, password, createdAt, updatedAt } = res;

      expect(res).toEqual({ ...mockUser, id, password, createdAt, updatedAt });
      expect(userRepository.create).toHaveBeenCalledWith({ ...data, ...res });
    });

    it('should throw 500 if create fails', async () => {
      mockUserRepository.create.mockResolvedValue(false);

      await expect(userService.create(data)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('updateById', () => {
    const dataToUpdate = { name: 'Updated Name' };

    it('should update user if exists', async () => {
      mockUserRepository.getById.mockResolvedValue(mockUser);
      mockUserRepository.updateById.mockResolvedValue(true);

      const res = await userService.updateById(mockUser.id, dataToUpdate);

      expect(res).toEqual({ ...mockUser, ...dataToUpdate });
      expect(userRepository.updateById).toHaveBeenCalledWith(mockUser.id, {
        ...mockUser,
        ...dataToUpdate,
      });
    });

    it('should throw 404 if user is not found', async () => {
      mockUserRepository.getById.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      await expect(
        userService.updateById(mockUser.id, dataToUpdate),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw 500 if updateById fails', async () => {
      mockUserRepository.getById.mockResolvedValue(mockUser);
      mockUserRepository.updateById.mockResolvedValue(false);

      await expect(
        userService.updateById(mockUser.id, dataToUpdate),
      ).rejects.toThrow('Error while updating user');
    });
  });

  describe('deleteById', () => {
    const { name, email, password } = mockUser;
    const data = { name, email, password };

    it('should remove user by id', async () => {
      mockUserRepository.getById.mockResolvedValue(mockUser);
      mockUserRepository.deleteById.mockResolvedValue(true);

      const res = await userService.deleteById(mockUser.id);

      expect(res).toBe(true);
      expect(userRepository.deleteById).toHaveBeenCalledWith(mockUser.id);
    });

    it('should throw 404 if user not found', async () => {
      mockUserRepository.getById.mockResolvedValue(null);

      await expect(userService.getById(mockUser.id)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw 500 if deleteById fails', async () => {
      mockUserRepository.getById.mockResolvedValue(mockUser);
      mockUserRepository.deleteById.mockResolvedValue(false);

      await expect(userService.deleteById(mockUser.id)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
