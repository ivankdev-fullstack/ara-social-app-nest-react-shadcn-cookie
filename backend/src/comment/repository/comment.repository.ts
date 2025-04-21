import {
  CommentGetAllByTargetPaginatedRequest,
  CommentGetAllByTargetPaginatedResponse,
} from '@common/contracts/comment';
import { TargetType } from '@common/interfaces/interfaces';
import {
  CollectionReference,
  FieldValue,
  Firestore,
} from '@google-cloud/firestore';
import { IComment } from '@interfaces/comment/comment.interface';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FirestoreDatabaseProvider } from 'firestore/firestore.providers';
import { PostRepository } from '../../post/repostory/post.repository';
import { Comment } from '../entity/comment.entity';

@Injectable()
export class CommentRepository {
  constructor(
    @Inject(FirestoreDatabaseProvider)
    private readonly firestore: Firestore,
    @Inject(Comment.collectionName)
    private collection: CollectionReference<Comment>,
    private postRepository: PostRepository,
  ) {}

  public async getById(id: string): Promise<IComment | null | undefined> {
    const snapshot = await this.collection.doc(id).get();
    if (!snapshot.exists) {
      return null;
    }
    return snapshot.data();
  }

  public async getAllByTargetPaginated({
    target_type,
    target_id,
    limit,
    cursor,
  }: CommentGetAllByTargetPaginatedRequest): Promise<CommentGetAllByTargetPaginatedResponse> {
    let query = this.collection
      .where('target_id', '==', target_id)
      .where('target_type', '==', target_type)
      .orderBy('createdAt', 'asc')
      .limit(limit + 1);

    if (cursor) {
      const cursorDoc = await this.collection.doc(cursor).get();
      if (!cursorDoc.exists) {
        throw new NotFoundException('Cursor not found');
      }
      query = query.startAfter(cursorDoc);
    }

    const snapshot = await query.get();
    const docs = snapshot.docs;

    const hasMore = docs.length > limit;
    const data = hasMore
      ? docs.slice(0, limit).map((doc) => doc.data() as IComment)
      : docs.map((doc) => doc.data() as IComment);

    const nextCursor = hasMore ? docs[limit - 1].id : null;

    return {
      data,
      nextCursor,
    };
  }

  public async create(comment: Comment): Promise<boolean> {
    try {
      return this.firestore.runTransaction(async (trx) => {
        const commentRef = this.collection.doc(comment.id);
        trx.set(commentRef, { ...comment });

        const fieldPath = `countOf.comments`;
        const action = FieldValue.increment(1);

        switch (comment.target_type) {
          case TargetType.POST:
            await this.postRepository.updateCountOfById(
              trx,
              comment.target_id,
              fieldPath,
              action,
            );
            break;

          case TargetType.COMMENT:
            await this.updateCountOfById(
              trx,
              comment.target_id,
              fieldPath,
              action,
            );
            break;

          default:
            throw new BadRequestException(
              'Not valid TargetType was provided in Comment entity',
            );
        }

        return true;
      });
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  public async updateById(id: string, data: IComment): Promise<boolean> {
    try {
      await this.collection.doc(id).update({ ...data });
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  public async updateCountOfById(
    trx: FirebaseFirestore.Transaction,
    id: string,
    fieldPath: string,
    fieldValue: any,
  ): Promise<void> {
    const ref = this.collection.doc(id);
    trx.update(ref, { [fieldPath]: fieldValue });
  }

  public async deleteById(
    id: string,
    target_id: string,
    target_type: TargetType,
  ): Promise<boolean> {
    try {
      return this.firestore.runTransaction(async (trx) => {
        const commentRef = this.collection.doc(id);
        trx.delete(commentRef);

        const fieldPath = `countOf.comments`;
        const action = FieldValue.increment(-1);

        switch (target_type) {
          case TargetType.POST:
            await this.postRepository.updateCountOfById(
              trx,
              target_id,
              fieldPath,
              action,
            );
            break;

          case TargetType.COMMENT:
            await this.updateCountOfById(trx, target_id, fieldPath, action);
            break;

          default:
            throw new BadRequestException(
              'Not valid TargetType was provided in Comment entity',
            );
        }

        return true;
      });
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
