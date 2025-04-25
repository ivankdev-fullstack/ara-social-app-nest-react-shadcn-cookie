import { IUser } from '@interfaces/user/user.interface';

type ConstructorProps = Pick<IUser, 'id' | 'name' | 'email' | 'phone'>;

const defaultAvatarUrl =
  'https://ara-bucket-9009.s3.us-east-1.amazonaws.com/default_avatar.jpg';

export class User implements IUser {
  static collectionName = 'users';

  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar: string;
  createdAt: string;
  updatedAt: string;

  constructor({ id, name, email, phone }: ConstructorProps) {
    const now = new Date().toISOString();

    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone ?? null;
    this.avatar = defaultAvatarUrl;
    this.createdAt = now;
    this.updatedAt = now;
  }
}
