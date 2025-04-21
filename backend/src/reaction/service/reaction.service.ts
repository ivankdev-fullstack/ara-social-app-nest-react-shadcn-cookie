import {
  ReactionCreateRequest,
  ReactionCreateResponse,
} from '@common/contracts/reaction/reaction.create';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ReactionRepository } from '../repository/reaction.repository';

@Injectable()
export class ReactionService {
  constructor(private readonly reactionRepository: ReactionRepository) {}

  public async toggle(
    reactionData: ReactionCreateRequest & { user_id: string },
  ): Promise<ReactionCreateResponse> {
    try {
      return this.reactionRepository.toggleInTransaction(reactionData);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Error while toggling reaction');
    }
  }
}
