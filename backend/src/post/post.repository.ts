import { PostGetAllPaginatedResponse } from '@common/contracts/post';
import { TargetType } from '@common/interfaces/interfaces';
import { CollectionReference } from '@google-cloud/firestore';
import { IPost } from '@interfaces/post/post.interface';
import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ReactionRepository } from 'reaction/reaction.repository';
import { Post } from './entity/post.entity';

@Injectable()
export class PostRepository {
  constructor(
    @Inject(Post.collectionName)
    private readonly collection: CollectionReference<Post>,
    @Inject(forwardRef(() => ReactionRepository))
    private readonly reactionRepository: ReactionRepository,
  ) {}

  public async getAllPaginated(
    cur_user_id: string,
    limit = 10,
    cursor?: string,
    author_id?: string,
  ): Promise<PostGetAllPaginatedResponse> {
    let query = this.collection.orderBy('createdAt', 'desc').limit(limit + 1);

    if (author_id) {
      query = query.where('user.id', '==', author_id);
    }

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
      ? docs.slice(0, limit).map((doc) => doc.data() as IPost)
      : docs.map((doc) => doc.data() as IPost);

    const nextCursor = hasMore ? docs[limit - 1].id : null;

    const reactionsToPosts =
      await this.reactionRepository.getManyByUserAndTargets(
        cur_user_id,
        data.map((post) => post.id),
        TargetType.POST,
      );

    const dataWithReactions = data.map((post) => {
      const foundReaction = reactionsToPosts?.find(
        (reaction) => reaction.target_id === post.id,
      );

      if (foundReaction?.user_id === cur_user_id) {
        return { ...post, current_reaction: foundReaction.type };
      }

      return post;
    });

    return {
      data: dataWithReactions,
      nextCursor,
    };
  }

  public async getById(id: string): Promise<IPost | null | undefined> {
    const snapshot = await this.collection.doc(id).get();
    if (!snapshot.exists) {
      return null;
    }
    return snapshot.data();
  }

  public async create(post: Post): Promise<boolean> {
    try {
      await this.collection.doc(post.id).set({ ...post });
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  public async updateById(id: string, data: Partial<IPost>): Promise<boolean> {
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
    action: any,
  ): Promise<void> {
    const ref = this.collection.doc(id);
    trx.update(ref, { [fieldPath]: action });
  }

  public async deleteById(id: string): Promise<boolean> {
    try {
      await this.collection.doc(id).delete();
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
