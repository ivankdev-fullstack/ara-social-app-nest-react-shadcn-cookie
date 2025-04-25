import { forwardRef, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FirebaseService } from 'firebase/firebase.service';
import { UserModule } from 'user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtService, FirebaseService],
  imports: [forwardRef(() => UserModule)],
  exports: [AuthService],
})
export class AuthModule {}
