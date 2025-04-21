import { Reaction } from 'reaction/entity/reaction.entity';
import { Comment } from '../comment/entity/comment.entity';
import { Post } from '../post/entity/post.entity';
import { User } from '../user/entity/user.entity';

export const FirestoreDatabaseProvider = 'firestoredb';
export const FirestoreOptionsProvider = 'firestoreOptions';
export const FirestoreCollectionProviders: string[] = [
  User.collectionName,
  Post.collectionName,
  Comment.collectionName,
  Reaction.collectionName,
];
