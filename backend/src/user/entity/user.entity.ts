import { IUser } from '@interfaces/user/user.interface';

type ConstructorProps = Pick<IUser, 'id' | 'name' | 'email'>;

const defaultAvatarUrl =
  'https://ara-bucket-9009.s3.us-east-1.amazonaws.com/default_avatar.jpg';

export class User implements IUser {
  static collectionName = 'users';

  id: string;
  name: string;
  email: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;

  constructor({ id, name, email }: ConstructorProps) {
    const now = new Date().toISOString();

    this.id = id;
    this.name = name;
    this.email = email;
    this.avatar = defaultAvatarUrl;
    this.createdAt = now;
    this.updatedAt = now;
  }
}
