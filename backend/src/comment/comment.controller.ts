import {
  CurrentUser,
  CurrentUserType,
} from '@common/decorators/current-user.decorator';
import { Public } from '@common/decorators/is-public.decorator';
import { TargetType } from '@common/interfaces/interfaces';
import {
  CommentCreateRequest,
  CommentGetAllByTargetPaginatedResponse,
  CommentUpdateByIdRequest,
} from '@contracts/comment';
import { IComment } from '@interfaces/comment/comment.interface';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentDeleteByIdGuard, CommentUpdateByIdGuard } from './guards';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Public()
  @Get('/by-target/:target_type/:target_id')
  public async getAllByTargetPaginated(
    @Param('target_type') target_type: TargetType,
    @Param('target_id') target_id: string,
    @Query('limit') limit?: string,
    @Query('cursor') cursor?: string,
  ): Promise<CommentGetAllByTargetPaginatedResponse> {
    const numericLimit = limit ? parseInt(limit, 10) : 10;
    return this.commentService.getAllByTargetPaginated({
      target_type,
      target_id,
      limit: numericLimit,
      cursor,
    });
  }

  @Post()
  public async create(
    @Body() body: CommentCreateRequest,
    @CurrentUser() user: CurrentUserType,
  ): Promise<IComment> {
    return this.commentService.create(user.id, body);
  }

  @Put('/:id')
  @UseGuards(CommentUpdateByIdGuard)
  public async updateById(
    @Param('id') id: string,
    @Body() body: CommentUpdateByIdRequest,
  ): Promise<IComment> {
    return this.commentService.updateById(id, body);
  }

  @Delete('/:id')
  @UseGuards(CommentDeleteByIdGuard)
  public async deleteById(@Param('id') id: string): Promise<boolean> {
    return this.commentService.deleteById(id);
  }
}
