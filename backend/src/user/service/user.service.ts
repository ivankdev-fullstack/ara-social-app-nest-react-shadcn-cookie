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
import * as AWS from 'aws-sdk';
import { User } from '../entity/user.entity';
import { UserRepository } from '../repository/user.repository';

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

  public async uploadAvatar(id: string, file: any): Promise<{ url: string }> {
    const accessKey = this.configService.get<string>('S3_ACCESS_KEY')!;
    const secretKey = this.configService.get<string>('S3_SECRET_KEY')!;
    const bucketName = this.configService.get<string>('S3_BUCKET_NAME')!;

    const s3 = new AWS.S3({
      accessKeyId: accessKey,
      secretAccessKey: secretKey,
    });

    const user = await this.getById(id);
    const originalName = `${user.name}-${new Date().toISOString()}`;
    const params = {
      Bucket: bucketName,
      Key: String(originalName),
      Body: file.buffer,
      ContentType: file.mimetype,
      ContentDisposition: 'inline',
      CreateBucketConfiguration: {
        LocationConstraint: 'us-east-1',
      },
    };

    const response = await s3.upload(params).promise();

    await this.updateById(user.id, { avatar: response.Location });
    return { url: response.Location };
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
    if (data?.password) {
      const isTheSame = await this.authService.comparePassword(
        data.password,
        user.password,
      );

      if (isTheSame) {
        throw new BadRequestException('Cannot update password to current one');
      }
      data.password = await this.authService.hashPassword(data.password);
    }

    const res = await this.userRepository.updateById(id, { ...user, ...data });
    if (!res) {
      throw new InternalServerErrorException('Error while updating user');
    }

    return res;
  }

  public async deleteById(id: string): Promise<boolean> {
    const user = await this.getById(id);
    const res = await this.userRepository.deleteById(user.id);

    if (!res) {
      throw new InternalServerErrorException('Error while removing user');
    }
    return res;
  }
}
