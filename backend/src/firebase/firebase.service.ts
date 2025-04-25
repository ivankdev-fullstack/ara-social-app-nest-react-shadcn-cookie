import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import * as serviceAccount from '../../service-account.json';

@Injectable()
export class FirebaseService {
  private firebaseApp: admin.app.App;

  constructor(private configService: ConfigService) {
    if (!admin.apps.length) {
      const accountPath = this.configService.get<string>('SA_KEY');

      if (!accountPath) {
        throw new InternalServerErrorException(
          'Firebase service account is not valid',
        );
      }

      const adminConfig: admin.ServiceAccount = {
        projectId: serviceAccount.project_id,
        privateKey: serviceAccount.private_key,
        clientEmail: serviceAccount.client_email,
      };

      this.firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(adminConfig),
        databaseURL: `https://${adminConfig.projectId}.firebaseio.com`,
        storageBucket: `gs://${adminConfig.projectId}.firebasestorage.app`,
      });
    } else {
      this.firebaseApp = admin.app();
    }
  }

  getAuth = (): admin.auth.Auth => {
    return this.firebaseApp.auth();
  };

  getFirestore(): admin.firestore.Firestore {
    return this.firebaseApp.firestore();
  }
}
