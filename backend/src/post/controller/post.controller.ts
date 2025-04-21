import {
  CurrentUser,
  CurrentUserType,
} from '@common/decorators/current-user.decorator';
import {
  PostCreateRequest,
  PostGetAllPaginatedResponse,
  PostUpdateByIdRequest,
} from '@contracts/post';
import { IPost } from '@interfaces/post/post.interface';
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
import { PostDeleteByIdGuard, PostUpdateByIdGuard } from '../guards';
import { PostService } from '../service/post.service';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  public async getAllPaginated(
    @CurrentUser() user: CurrentUserType,
    @Query('limit') limit?: string,
    @Query('cursor') cursor?: string,
    @Query('user_id') author_id?: string,
  ): Promise<PostGetAllPaginatedResponse> {
    const numericLimit = limit ? parseInt(limit, 10) : 10;
    return this.postService.getAllPaginated(
      user.id,
      numericLimit,
      cursor,
      author_id,
    );
  }

  @Post()
  public async create(
    @Body() body: PostCreateRequest,
    @CurrentUser() user: CurrentUserType,
  ): Promise<IPost> {
    return this.postService.create(user.id, body);
  }

  @Put('/:id')
  @UseGuards(PostUpdateByIdGuard)
  public async updateById(
    @Param('id') id: string,
    @Body() body: PostUpdateByIdRequest,
  ): Promise<IPost> {
    return this.postService.updateById(id, body);
  }

  @Delete('/:id')
  @UseGuards(PostDeleteByIdGuard)
  public async deleteById(@Param('id') id: string): Promise<boolean> {
    return this.postService.deleteById(id);
  }
}
