import { IUser } from '@common/interfaces/user/user.interface';
import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/:id')
  async getById(@Param('id') id: string): Promise<IUser> {
    return this.userService.getById(id);
  }

  // @Post('/:id/upload-avatar')
  // @UseInterceptors(FileInterceptor('file'))
  // async uploadAvatar(
  //   @Param('id') id: string,
  //   @UploadedFile() file: any,
  // ): Promise<{ url: string }> {
  //   return this.userService.uploadAvatar(id, file);
  // }

  // @Put('/:id')
  // async updateById(
  //   @Param('id') id: string,
  //   @Body() body: UserUpdateByIdRequest,
  // ): Promise<boolean> {
  //   return this.userService.updateById(id, body);
  // }

  // @Delete('/:id')
  // async deleteById(
  //   @Param('id') id: string,
  //   @Res({ passthrough: true }) response: Response,
  // ): Promise<boolean> {
  //   const res = await this.userService.deleteById(id);
  //   if (res) {
  //     clearAuthCookie(response);
  //   }
  //   return res;
  // }
}
