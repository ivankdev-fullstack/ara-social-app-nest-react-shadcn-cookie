import { AuthMeResponse, AuthRegisterRequest } from '@common/contracts/auth';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { FirebaseService } from 'firebase/firebase.service';
import { User } from 'user/entity/user.entity';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
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

  public async register(data: AuthRegisterRequest): Promise<string> {
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
      });

      const userEntity = new User({
        id: userRecord.uid,
        name: data.name,
        email: data.email,
      });

      await this.userRepository.create(userEntity);
      return auth.createCustomToken(userRecord.uid);
    } catch (err) {
      console.log(err);
      if (err.code === 'auth/email-already-exists') {
        throw new ConflictException(
          'User with this email is already registered',
        );
      }
      throw new InternalServerErrorException(
        'Something went wrong during user registration',
      );
    }
  }

  public async googleAuth(
    data: AuthRegisterRequest & { idToken: string },
  ): Promise<string> {
    const auth = this.firebaseService.getAuth();

    try {
      const decodedToken = await auth.verifyIdToken(data.idToken);
      const { uid, picture } = decodedToken;

      let user = await this.userRepository.getByEmail(data.email);

      if (!user) {
        const userEntity = new User({
          id: uid,
          email: data.email,
          name: data.name,
          avatar: picture,
        });
        await this.userRepository.create(userEntity);
      }

      return auth.createCustomToken(uid);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(
        'Something went wrong during user registration',
      );
    }
  }
}
