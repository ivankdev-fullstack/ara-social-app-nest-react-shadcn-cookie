import { Injectable } from '@nestjs/common';
import { Firestore } from 'firebase-admin/firestore';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class FirestoreService {
  constructor(private firebaseService: FirebaseService) {}

  get firestore(): Firestore {
    return this.firebaseService.getFirestore();
  }
}
