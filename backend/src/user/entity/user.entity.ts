import { IUser } from '@interfaces/user/user.interface';

interface ConstructorProps extends Partial<IUser> {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

const defaultAvatarUrl =
  'https://firebasestorage.googleapis.com/v0/b/ara-db-31a41.firebasestorage.app/o/avatars%2Fdefault_avatar.jpg?alt=media&token=13677980-ae2b-4466-9183-4987dceb8f38';

export class User implements IUser {
  static collectionName = 'users';

  id: string;
  name: string;
  email: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;

  constructor({ id, name, email, avatar }: ConstructorProps) {
    const now = new Date().toISOString();

    this.id = id;
    this.name = name;
    this.email = email;
    this.avatar = avatar ?? defaultAvatarUrl;
    this.createdAt = now;
    this.updatedAt = now;
  }
}
