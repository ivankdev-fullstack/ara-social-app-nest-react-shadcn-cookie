import { TargetType } from '@common/interfaces/interfaces';
import {
  IReaction,
  ReactionType,
} from '@common/interfaces/reaction/reaction.interface';
import { v4 as uuidv4 } from 'uuid';

type ConstructorProps = Pick<
  IReaction,
  'type' | 'target_id' | 'target_type' | 'user_id'
>;

export class Reaction implements IReaction {
  static collectionName = 'reactions';

  id: string;
  type: ReactionType;
  target_id: string;
  target_type: TargetType;
  user_id: string;
  createdAt: string;
  updatedAt: string;

  constructor({ type, target_id, target_type, user_id }: ConstructorProps) {
    const now = new Date().toISOString();

    this.id = uuidv4();
    this.type = type;
    this.target_id = target_id;
    this.target_type = target_type;
    this.user_id = user_id;
    this.createdAt = now;
    this.updatedAt = now;
  }
}
