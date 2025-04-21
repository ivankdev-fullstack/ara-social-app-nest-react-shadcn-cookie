import {
  AuthLoginRequest,
  AuthMeResponse,
  AuthRegisterRequest,
} from '@common/contracts/auth';
import { JWTPayload } from '@common/interfaces/auth/auth.interface';
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../user/repository/user.repository';
import { UserService } from '../user/service/user.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
  ) {}

  public async me(user_id: string): Promise<AuthMeResponse> {
    try {
      const user = await this.userRepository.getById(user_id);
      if (!user) {
        throw new NotFoundException('User with this id in token is not found');
      }

      return user;
    } catch (err) {
      console.log(err);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  public async login(data: AuthLoginRequest): Promise<string> {
    const user = await this.userRepository.getByEmail(data.email);
    if (!user) {
      throw new NotFoundException('User with this email not found');
    }

    const isValidPassword = await this.comparePassword(
      data.password,
      user.password,
    );
    if (!isValidPassword) {
      throw new BadRequestException('Invalid email or password');
    }

    return this.generateToken({ user_id: user.id });
  }

  public async register(data: AuthRegisterRequest): Promise<string> {
    const user = await this.userRepository.getByEmail(data.email);
    if (user) {
      throw new BadRequestException(
        'User with this email is already registered',
      );
    }

    const hashedPassword = await this.hashPassword(data.password);
    const newUser = await this.userService.create({
      ...data,
      password: hashedPassword,
    });

    return this.generateToken({ user_id: newUser.id });
  }

  public async comparePassword(
    inputPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(inputPassword, hashedPassword);
  }

  public async hashPassword(plainPassword: string): Promise<string> {
    return bcrypt.hash(plainPassword, 10);
  }

  private async generateToken(payload: JWTPayload): Promise<string> {
    const secret = this.configService.get<string>('JWT_SECRET');
    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN');

    return this.jwtService.signAsync(payload, {
      secret,
      expiresIn,
    });
  }
}
