import { IsString } from 'class-validator';

export class CommentUpdateByIdRequest {
  @IsString()
  content: string;
}
