import { getFirestore } from 'firebase-admin/firestore';

export class CrisesService {
  private get db() { return getFirestore(); }

  async getAllCrises() {
    const snapshot = await this.db.collection('crises').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async deleteCrisis(id: string) {
    await this.db.collection('crises').doc(id).delete();
  }
}
