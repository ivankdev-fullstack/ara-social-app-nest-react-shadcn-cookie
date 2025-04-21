import { IUser } from '@interfaces/user/user.interface';
import { v4 as uuidv4 } from 'uuid';

type ConstructorProps = Pick<IUser, 'name' | 'email' | 'password' | 'phone'>;

export class User implements IUser {
  static collectionName = 'users';

  id: string;
  name: string;
  email: string;
  password: string;
  phone?: string | null;
  avatar: string;
  createdAt: string;
  updatedAt: string;

  constructor({ name, email, password, phone }: ConstructorProps) {
    const now = new Date().toISOString();

    this.id = uuidv4();
    this.name = name;
    this.email = email;
    this.password = password;
    this.phone = phone ?? null;
    this.avatar =
      'https://ara-bucket-9009.s3.us-east-1.amazonaws.com/default_avatar.jpg';
    this.createdAt = now;
    this.updatedAt = now;
  }
}
