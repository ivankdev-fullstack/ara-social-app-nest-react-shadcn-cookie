import { ReactionCreateRequest } from '@common/contracts/reaction/reaction.create';
import {
  CurrentUser,
  CurrentUserType,
} from '@common/decorators/current-user.decorator';
import { Body, Controller, Post } from '@nestjs/common';
import { ReactionService } from './reaction.service';

@Controller('reactions')
export class ReactionController {
  constructor(private readonly reactionService: ReactionService) {}

  @Post('/toggle')
  public async toggle(
    @Body() body: ReactionCreateRequest,
    @CurrentUser() user: CurrentUserType,
  ): Promise<{ result: string }> {
    const result = await this.reactionService.toggle({
      ...body,
      user_id: user.id,
    });
    return { result };
  }
}
