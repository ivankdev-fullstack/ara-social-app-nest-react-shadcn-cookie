import {
  CommentCreateRequest,
  CommentGetAllByTargetPaginatedRequest,
  CommentGetAllByTargetPaginatedResponse,
  CommentUpdateByIdRequest,
} from '@contracts/comment';
import { IComment } from '@interfaces/comment/comment.interface';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from 'user/service/user.service';
import { Comment } from '../entity/comment.entity';
import { CommentRepository } from '../repository/comment.repository';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly userService: UserService,
  ) {}

  public async getById(id: string): Promise<IComment> {
    const comment = await this.commentRepository.getById(id);
    if (!comment) {
      throw new NotFoundException('Comment not found.');
    }
    return comment;
  }

  public async getAllByTargetPaginated(
    data: CommentGetAllByTargetPaginatedRequest,
  ): Promise<CommentGetAllByTargetPaginatedResponse> {
    return this.commentRepository.getAllByTargetPaginated({ ...data });
  }

  public async create(
    user_id: string,
    data: CommentCreateRequest,
  ): Promise<IComment> {
    const { id, name, avatar } = await this.userService.getById(user_id);
    const newComment = new Comment({ ...data, user: { id, name, avatar } });
    const res = await this.commentRepository.create(newComment);

    if (!res) {
      throw new InternalServerErrorException('Error while creating a comment');
    }
    return newComment;
  }

  public async updateById(
    id: string,
    data: CommentUpdateByIdRequest,
  ): Promise<IComment> {
    const comment = await this.getById(id);
    const res = await this.commentRepository.updateById(id, {
      ...comment,
      ...data,
    });

    if (!res) {
      throw new InternalServerErrorException('Error while updating a comment');
    }
    return { ...comment, ...data };
  }

  public async deleteById(id: string): Promise<boolean> {
    const comment = await this.getById(id);
    const res = await this.commentRepository.deleteById(
      comment.id,
      comment.target_id,
      comment.target_type,
    );

    if (!res) {
      throw new InternalServerErrorException('Error while deleting a comment');
    }
    return res;
  }
}
