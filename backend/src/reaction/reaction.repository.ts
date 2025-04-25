import {
  ReactionCreateRequest,
  ReactionCreateResponse,
} from '@common/contracts/reaction/reaction.create';
import { TargetType } from '@common/interfaces/interfaces';
import {
  IReaction,
  ReactionType,
} from '@common/interfaces/reaction/reaction.interface';
import {
  CollectionReference,
  FieldValue,
  Firestore,
} from '@google-cloud/firestore';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CommentRepository } from 'comment/comment.repository';
import { FirestoreDatabaseProvider } from 'firestore/firestore.providers';
import { PostRepository } from 'post/post.repository';
import { Reaction } from './entity/reaction.entity';

@Injectable()
export class ReactionRepository {
  constructor(
    @Inject(FirestoreDatabaseProvider)
    private readonly firestore: Firestore,
    @Inject(Reaction.collectionName)
    private readonly collection: CollectionReference<Reaction>,
    private readonly postRepository: PostRepository,
    private readonly commentRepository: CommentRepository,
  ) {}

  public async getByUserAndTarget(
    user_id: string,
    target_id: string,
    target_type: TargetType,
  ): Promise<Reaction | null> {
    const snapshot = await this.collection
      .where('user_id', '==', user_id)
      .where('target_id', '==', target_id)
      .where('target_type', '==', target_type)
      .limit(1)
      .get();

    if (snapshot.empty) return null;
    return snapshot.docs[0].data();
  }

  public async getManyByUserAndTargets(
    user_id: string,
    target_ids: string[],
    target_type: TargetType,
  ): Promise<Reaction[] | null> {
    const snapshot = await this.collection
      .where('user_id', '==', user_id)
      .where('target_id', 'in', target_ids)
      .where('target_type', '==', target_type)
      .get();

    if (snapshot.empty) return null;
    return snapshot.docs.map((post) => post.data() as IReaction);
  }

  public async toggleInTransaction(
    data: ReactionCreateRequest & { user_id: string },
  ): Promise<ReactionCreateResponse> {
    const { user_id, target_id, target_type, type: newType } = data;

    const query = this.collection
      .where('user_id', '==', user_id)
      .where('target_id', '==', target_id)
      .where('target_type', '==', target_type)
      .limit(1);

    return this.firestore.runTransaction(async (trx) => {
      // Get reaction within the target (post/comment)
      const snapshot = await trx.get(query);
      const doc = snapshot.docs[0];

      // If not exists (any type) - toggle - create
      if (!doc?.exists) {
        return this.createReaction(trx, data);
      }

      const existingReaction = doc.data();

      // If exists the same type of reaction - toggle - delete
      if (existingReaction.type === newType) {
        return this.deleteReaction(trx, doc.ref, data);
      }

      // If exists another type of reaction - update the existing one
      return this.updateReactionType(trx, doc.ref, existingReaction, data);
    });
  }

  private async createReaction(
    trx: FirebaseFirestore.Transaction,
    data: ReactionCreateRequest & { user_id: string },
  ): Promise<'created'> {
    const { target_id, target_type, type: newType } = data;
    const reaction = new Reaction(data);

    trx.set(this.collection.doc(reaction.id), { ...reaction });

    await this.updateTargetReactionCount(
      trx,
      target_id,
      target_type,
      newType,
      'increment',
    );

    return 'created';
  }

  private async deleteReaction(
    trx: FirebaseFirestore.Transaction,
    ref: FirebaseFirestore.DocumentReference,
    data: ReactionCreateRequest,
  ): Promise<'deleted'> {
    const { target_id, target_type, type: newType } = data;

    trx.delete(ref);

    await this.updateTargetReactionCount(
      trx,
      target_id,
      target_type,
      newType,
      'decrement',
    );

    return 'deleted';
  }

  private async updateReactionType(
    trx: FirebaseFirestore.Transaction,
    ref: FirebaseFirestore.DocumentReference,
    existing: Reaction,
    data: ReactionCreateRequest,
  ): Promise<'updated'> {
    const { target_id, target_type, type: newType } = data;

    trx.update(ref, { type: data.type });

    await Promise.all([
      this.updateTargetReactionCount(
        trx,
        target_id,
        target_type,
        existing.type,
        'decrement',
      ),
      this.updateTargetReactionCount(
        trx,
        target_id,
        target_type,
        newType,
        'increment',
      ),
    ]);

    return 'updated';
  }

  private async updateTargetReactionCount(
    trx: FirebaseFirestore.Transaction,
    target_id: string,
    target_type: TargetType,
    reaction_type: ReactionType,
    actionType: 'increment' | 'decrement',
  ): Promise<void> {
    const fieldPath = `countOf.${reaction_type}s`;
    const action = FieldValue.increment(actionType === 'increment' ? 1 : -1);

    switch (target_type) {
      case TargetType.POST:
        await this.postRepository.updateCountOfById(
          trx,
          target_id,
          fieldPath,
          action,
        );
        return;

      case TargetType.COMMENT:
        await this.commentRepository.updateCountOfById(
          trx,
          target_id,
          fieldPath,
          action,
        );
        return;

      default:
        throw new InternalServerErrorException(
          `Unsupported target_type: ${target_type} in incrementReactionTypeCount`,
        );
    }
  }
}
