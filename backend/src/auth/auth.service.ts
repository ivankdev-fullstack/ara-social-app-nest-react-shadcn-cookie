import { AuthMeResponse, AuthRegisterRequest } from '@common/contracts/auth';
import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { FirebaseService } from 'firebase/firebase.service';
import { User } from 'user/entity/user.entity';
import { UserRepository } from 'user/user.repository';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
    private readonly firebaseService: FirebaseService,
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

  public async register(data: AuthRegisterRequest) {
    const auth = this.firebaseService.getAuth();

    const isExist = await this.userRepository.getByEmail(data.email);
    if (isExist) {
      throw new ConflictException('User with this email is already registered');
    }

    try {
      const userRecord = await auth.createUser({
        email: data.email,
        password: data.password,
        displayName: data.name,
        phoneNumber: data.phone ?? undefined,
      });

      const userEntity = new User({
        id: userRecord.uid,
        name: data.name,
        email: data.email,
        phone: data.phone ?? null,
      });

      await this.userRepository.create(userEntity);
      return auth.createCustomToken(userRecord.uid);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(
        'Something went wrong during user registration',
      );
    }
  }
}
