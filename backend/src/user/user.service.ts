import { UserCreateRequest, UserUpdateByIdRequest } from '@contracts/user';
import { IUser } from '@interfaces/user/user.interface';
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'auth/auth.service';
import { User } from './entity/user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
  ) {}

  public async getById(id: string): Promise<IUser> {
    const user = await this.userRepository.getById(id);
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return user;
  }

  public async getByEmail(email: string): Promise<IUser> {
    const user = await this.userRepository.getByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return user;
  }

  public async create(data: UserCreateRequest): Promise<IUser> {
    const newUser = new User(data);
    const res = await this.userRepository.create(newUser);

    if (!res) {
      throw new InternalServerErrorException('Error while creating a user.');
    }
    return newUser;
  }

  public async updateById(
    id: string,
    data: UserUpdateByIdRequest,
  ): Promise<boolean> {
    const user = await this.getById(id);

    if (data?.email) {
      if (user.email === data.email) {
        throw new BadRequestException('This email is already registered');
      }

      const presentUserEmail = await this.userRepository.getByEmail(data.email);
      if (presentUserEmail) {
        throw new BadRequestException('This email is already registered');
      }
    }

    const res = await this.userRepository.updateById(id, { ...user, ...data });
    if (!res) {
      throw new InternalServerErrorException('Error while updating user');
    }

    return res;
  }
}
