import { UserUpdateByIdRequest } from '@common/contracts/user';
import { Public } from '@common/decorators/is-public.decorator';
import { IUser } from '@common/interfaces/user/user.interface';
import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Get('/:id')
  async getById(@Param('id') id: string): Promise<IUser> {
    return this.userService.getById(id);
  }

  @Put('/:id')
  async updateById(
    @Param('id') id: string,
    @Body() body: UserUpdateByIdRequest,
  ): Promise<boolean> {
    return this.userService.updateById(id, body);
  }
}
