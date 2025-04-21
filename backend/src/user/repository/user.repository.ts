import { CollectionReference } from '@google-cloud/firestore';
import { Inject, Injectable } from '@nestjs/common';
import { IUser } from '@interfaces/user/user.interface';
import { User } from '../entity/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @Inject(User.collectionName)
    private collection: CollectionReference<User>,
  ) {}

  public async getById(id: string): Promise<IUser | null | undefined> {
    const snapshot = await this.collection.doc(id).get();
    if (!snapshot.exists) {
      return null;
    }
    return snapshot.data();
  }

  public async getByEmail(email: string): Promise<IUser | null> {
    const snapshot = await this.collection.where('email', '==', email).get();
    if (snapshot.empty) {
      return null;
    }
    return snapshot.docs[0].data();
  }

  public async create(user: User): Promise<boolean> {
    try {
      await this.collection.doc(user.id).set({ ...user });
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  public async updateById(id: string, data: IUser): Promise<boolean> {
    try {
      await this.collection.doc(id).update({ ...data });
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
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
