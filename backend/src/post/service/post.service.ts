import {
  PostCreateRequest,
  PostGetAllPaginatedResponse,
  PostUpdateByIdRequest,
} from '@contracts/post';
import { IPost } from '@interfaces/post/post.interface';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from 'user/service/user.service';
import { Post } from '../entity/post.entity';
import { PostRepository } from '../repostory/post.repository';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly userService: UserService,
  ) {}

  public async getAllPaginated(
    cur_user_id: string,
    limit = 10,
    cursor?: string,
    author_id?: string,
  ): Promise<PostGetAllPaginatedResponse> {
    return this.postRepository.getAllPaginated(
      cur_user_id,
      limit,
      cursor,
      author_id,
    );
  }

  public async getById(id: string): Promise<IPost> {
    const post = await this.postRepository.getById(id);
    if (!post) {
      throw new NotFoundException('Post not found.');
    }
    return post;
  }

  public async create(
    user_id: string,
    data: PostCreateRequest,
  ): Promise<IPost> {
    const { id, name, avatar } = await this.userService.getById(user_id);
    const newPost = new Post({ ...data, user: { id, name, avatar } });
    const res = await this.postRepository.create(newPost);

    if (!res) {
      throw new InternalServerErrorException('Error while creating a post');
    }
    return newPost;
  }

  public async updateById(
    id: string,
    data: PostUpdateByIdRequest,
  ): Promise<IPost> {
    const post = await this.getById(id);
    const res = await this.postRepository.updateById(id, { ...post, ...data });

    if (!res) {
      throw new InternalServerErrorException('Error while updating a post');
    }
    return { ...post, ...data };
  }

  public async deleteById(id: string): Promise<boolean> {
    const post = await this.getById(id);
    const res = await this.postRepository.deleteById(post.id);

    if (!res) {
      throw new InternalServerErrorException('Error while deleting a post');
    }
    return res;
  }
}
