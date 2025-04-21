import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'auth/auth.module';
import { UserController } from './controller/user.controller';
import { UserRepository } from './repository/user.repository';
import { UserService } from './service/user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository],
  imports: [forwardRef(() => AuthModule)],
})
export class UserModule {}
