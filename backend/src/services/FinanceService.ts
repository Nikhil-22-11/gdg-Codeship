import { getFirestore } from 'firebase-admin/firestore';
import { Transaction } from '../models/types';

export class FinanceService {
  private get db() { return getFirestore(); }
  private get collection() { return this.db.collection('transactions'); }

  async getFinancialSummary() {
    const snapshot = await this.collection.where('status', '==', 'Completed').get();
    
    let totalBudget = 0;
    let operationalSpend = 0;

    snapshot.docs.forEach(doc => {
      const data = doc.data() as Transaction;
      if (data.amount > 0) {
        // Income / Initial Budget
        totalBudget += data.amount;
      } else {
        // Spend
        operationalSpend += Math.abs(data.amount);
      }
    });

    const allocatedFunds = totalBudget - operationalSpend;

    return {
      totalBudget,
      operationalSpend,
      allocatedFunds
    };
  }
}
